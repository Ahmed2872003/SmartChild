"""
model/loader.py
---------------
Handles loading the fine-tuned Qwen2.5 + LoRA adapter.
Falls back to base model if adapter not found (for development).
"""

import os
import logging
import threading
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TextIteratorStreamer

logger = logging.getLogger('smartchild.loader')


class ModelLoader:
    def __init__(self, model_path: str, base_model: str,
                 use_4bit: bool = True, device: str = 'auto'):
        self.model_path = model_path
        self.base_model = base_model
        self.use_4bit   = use_4bit
        self.device     = device
        self.model      = None
        self.tokenizer  = None
        self._load()

    # ── Private ──────────────────────────────────────────────────────────────

    def _resolve_device(self):
        if self.device == 'auto':
            return 'cuda' if torch.cuda.is_available() else 'cpu'
        return self.device

    def _bnb_config(self):
        return BitsAndBytesConfig(
            load_in_4bit               = True,
            bnb_4bit_compute_dtype     = torch.float16,
            bnb_4bit_use_double_quant  = True,
            bnb_4bit_quant_type        = 'nf4',
        )

    def _load(self):
        device  = self._resolve_device()
        adapter_exists = os.path.isdir(self.model_path) and \
                         os.path.isfile(os.path.join(self.model_path, 'adapter_config.json'))

        # ── Choose load source ────────────────────────────────────────────────
        if adapter_exists:
            load_source = self.model_path
            logger.info(f'Loading fine-tuned adapter from: {self.model_path}')
        else:
            load_source = self.base_model
            logger.warning(
                f'Adapter not found at {self.model_path}. '
                f'Loading base model: {self.base_model}'
            )

        # ── Tokenizer ─────────────────────────────────────────────────────────
        tok_source = self.model_path if adapter_exists else self.base_model
        self.tokenizer = AutoTokenizer.from_pretrained(
            tok_source,
            trust_remote_code = True,
        )
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        # ── Model ─────────────────────────────────────────────────────────────
        quant_cfg   = self._bnb_config() if (self.use_4bit and device == 'cuda') else None
        dtype       = torch.float16 if device == 'cuda' else torch.float32

        base = AutoModelForCausalLM.from_pretrained(
            self.base_model if adapter_exists else load_source,
            quantization_config = quant_cfg,
            torch_dtype         = dtype,
            device_map          = 'auto' if device == 'cuda' else None,
            trust_remote_code   = True,
        )

        # ── Attach LoRA adapter if it exists ─────────────────────────────────
        if adapter_exists:
            try:
                from peft import PeftModel
                self.model = PeftModel.from_pretrained(base, self.model_path)
                logger.info('LoRA adapter attached ✅')
            except ImportError:
                logger.warning('peft not installed — running base model only')
                self.model = base
        else:
            self.model = base

        self.model.eval()
        self._device_str = device
        logger.info(f'Model ready on device: {device}')

    # ── Public ───────────────────────────────────────────────────────────────

    def generate(self, messages: list, max_new_tokens: int = 150,
                 temperature: float = 0.7, disable_lora: bool = False) -> str:
        """
        Apply chat template, run inference, return decoded string.
        """
        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize              = False,
            add_generation_prompt = True,
        )
        inputs = self.tokenizer(
            text,
            return_tensors = 'pt',
            truncation     = True,
            max_length     = 900,
        )
        if self._device_str == 'cuda':
            inputs = {k: v.to('cuda') for k, v in inputs.items()}

        import contextlib
        disable_ctx = self.model.disable_adapter() if disable_lora and hasattr(self.model, "disable_adapter") else contextlib.nullcontext()

        with torch.no_grad(), disable_ctx:
            output_ids = self.model.generate(
                **inputs,
                max_new_tokens     = max_new_tokens,
                temperature        = temperature,
                do_sample          = temperature > 0,
                repetition_penalty = 1.1,
                pad_token_id       = self.tokenizer.eos_token_id,
            )

        new_tokens = output_ids[0][inputs['input_ids'].shape[1]:]
        return self.tokenizer.decode(new_tokens, skip_special_tokens=True).strip()

    def info(self) -> dict:
        return {
            'base_model'     : self.base_model,
            'adapter_path'   : self.model_path,
            'device'         : self._device_str,
            'use_4bit'       : self.use_4bit,
            'vocab_size'     : self.tokenizer.vocab_size,
            'cuda_available' : torch.cuda.is_available(),
        }

    def generate_stream(self, messages: list, max_new_tokens: int = 150,
                        temperature: float = 0.7, disable_lora: bool = False):
        """
        Stream generation yielding tokens asynchronously.
        """
        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize              = False,
            add_generation_prompt = True,
        )
        inputs = self.tokenizer(
            text,
            return_tensors = 'pt',
            truncation     = True,
            max_length     = 900,
        )
        if self._device_str == 'cuda':
            inputs = {k: v.to('cuda') for k, v in inputs.items()}

        streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
        
        generation_kwargs = dict(
            **inputs,
            streamer           = streamer,
            max_new_tokens     = max_new_tokens,
            temperature        = temperature,
            do_sample          = temperature > 0,
            repetition_penalty = 1.1,
            pad_token_id       = self.tokenizer.eos_token_id,
        )

        def run_generation():
            import contextlib
            disable_ctx = self.model.disable_adapter() if disable_lora and hasattr(self.model, "disable_adapter") else contextlib.nullcontext()
            with torch.no_grad(), disable_ctx:
                self.model.generate(**generation_kwargs)

        thread = threading.Thread(target=run_generation)
        thread.start()

        for new_text in streamer:
            yield new_text

