"""
scripts/download_model.py
--------------------------
Usage:
    # Download from Google Drive (e.g. from your zipped Colab output)
    python scripts/download_model.py --drive_url "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"

    # Option A — download from your HuggingFace Hub repo
    python scripts/download_model.py --hf_repo YOUR_USERNAME/smartchild-chatbot

    # Option B — download base model only (no fine-tuning yet)
    python scripts/download_model.py --base_only

    # Option C — copy from a local path (e.g. mounted Google Drive)
    python scripts/download_model.py --local_path /path/to/smartchild-model
"""

import os
import sys
import shutil
import argparse
import logging
import zipfile

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger('download')

WEIGHTS_DIR  = os.path.join(os.path.dirname(__file__), '..', 'model', 'weights')
BASE_MODEL   = 'Qwen/Qwen2.5-1.5B-Instruct'

def download_from_drive(drive_url: str):
    import gdown
    logger.info(f'Downloading zip from Google Drive: {drive_url}')
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    
    zip_path = os.path.join(WEIGHTS_DIR, 'model_weights.zip')
    
    # gdown automatically handles the Drive URL format
    gdown.download(url=drive_url, output=zip_path, quiet=False)
    
    if not os.path.exists(zip_path):
        logger.error("Download failed! Check your Google Drive link permissions.")
        sys.exit(1)
        
    logger.info('Extracting zip file...')
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # Extract files directly to WEIGHTS_DIR, ignoring top-level folders if they exist inside the zip
        for member in zip_ref.namelist():
            filename = os.path.basename(member)
            # Skip directories
            if not filename:
                continue
            # Copy file
            source = zip_ref.open(member)
            target = open(os.path.join(WEIGHTS_DIR, filename), "wb")
            with source, target:
                shutil.copyfileobj(source, target)
                
    logger.info('Cleaning up zip file...')
    os.remove(zip_path)
    logger.info(f'✅ Drive weights successfully extracted to: {WEIGHTS_DIR}')

def download_from_hub(repo_id: str):
    from huggingface_hub import snapshot_download
    logger.info(f'Downloading from HuggingFace Hub: {repo_id}')
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    snapshot_download(
        repo_id        = repo_id,
        local_dir      = WEIGHTS_DIR,
        ignore_patterns= ['*.msgpack', '*.h5', 'flax_model*'],
    )
    logger.info(f'✅ Adapter saved to: {WEIGHTS_DIR}')


def download_base_only():
    from transformers import AutoModelForCausalLM, AutoTokenizer
    logger.info(f'Downloading base model: {BASE_MODEL}')
    os.makedirs(WEIGHTS_DIR, exist_ok=True)

    logger.info('  Downloading tokenizer...')
    tok = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=True)
    tok.save_pretrained(WEIGHTS_DIR)

    logger.info('  Downloading model weights (this may take a few minutes)...')
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        trust_remote_code = True,
    )
    model.save_pretrained(WEIGHTS_DIR)
    logger.info(f'✅ Base model saved to: {WEIGHTS_DIR}')


def copy_from_local(src: str):
    src = os.path.abspath(src)
    dst = os.path.abspath(WEIGHTS_DIR)

    if not os.path.isdir(src):
        logger.error(f'Source path does not exist: {src}')
        sys.exit(1)

    logger.info(f'Copying from {src} → {dst}')
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)
    logger.info(f'✅ Model copied to: {dst}')


def verify_weights():
    """Check the weights directory has the expected files."""
    required = ['tokenizer_config.json']
    adapter_files = ['adapter_config.json', 'adapter_model.safetensors']
    base_files    = ['config.json']

    missing = [f for f in required if not os.path.isfile(os.path.join(WEIGHTS_DIR, f))]
    has_adapter = all(os.path.isfile(os.path.join(WEIGHTS_DIR, f)) for f in adapter_files)
    has_base    = any(os.path.isfile(os.path.join(WEIGHTS_DIR, f)) for f in base_files)

    if missing:
        logger.warning(f'Missing files: {missing}')
    elif has_adapter:
        logger.info('✅ Fine-tuned LoRA adapter detected')
    elif has_base:
        logger.info('✅ Base model detected (no LoRA adapter)')
    else:
        logger.warning('⚠️  Could not verify model files — check ./model/weights manually')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Download SmartChild model weights')
    group  = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--drive_url',   type=str, help='Google Drive shareable link for the zip file')
    group.add_argument('--hf_repo',     type=str, help='HuggingFace repo id, e.g. username/smartchild-chatbot')
    group.add_argument('--base_only',   action='store_true', help='Download base Qwen2.5-1.5B only')
    group.add_argument('--local_path',  type=str, help='Copy weights from a local directory')
    args = parser.parse_args()

    os.makedirs(WEIGHTS_DIR, exist_ok=True)

    if args.drive_url:
        download_from_drive(args.drive_url)
    elif args.hf_repo:
        download_from_hub(args.hf_repo)
    elif args.base_only:
        download_base_only()
    elif args.local_path:
        copy_from_local(args.local_path)

    verify_weights()
    logger.info(f'\nNext step: Run the uvicorn server')
