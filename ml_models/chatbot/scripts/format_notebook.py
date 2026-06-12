import nbformat

def fix():
    with open('SmartChild_Chatbot_FineTuning.ipynb', 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)

    for cell in nb.cells:
        if cell.cell_type != 'code':
            continue
            
        src = cell.source
        
        # CELL 7: safe_load
        if "def safe_load(" in src and "try:" in src:
            src = src.replace(
"""def safe_load(name, split='train', **kwargs):
 try:
 ds = load_dataset(name, split=split, trust_remote_code=True, **kwargs)
 print(f' {name:50s} → {len(ds):>7,} rows'); return ds
 except Exception as e:
 print(f' {name}: {e}'); return None""",
"""def safe_load(name, split='train', **kwargs):
    try:
        ds = load_dataset(name, split=split, trust_remote_code=True, **kwargs)
        print(f' {name:50s} → {len(ds):>7,} rows'); return ds
    except Exception as e:
        print(f' {name}: {e}'); return None"""
            )
            
        # CELL 10: get_wc
        if "def get_wc(" in src:
            src = src.replace(
"""def get_wc(ds, col, n=3000):
 s = ds.select(range(min(n,len(ds))))
 return [len(str(r[col]).split()) for r in s]""",
"""def get_wc(ds, col, n=3000):
    s = ds.select(range(min(n,len(ds))))
    return [len(str(r[col]).split()) for r in s]"""
            )
            src = src.replace(
"""for ax,(ds,name,col) in zip(axes,infos):
 if ds is None: ax.set_visible(False); continue
 try:
 wc=[w for w in get_wc(ds,col) if w<500]
 ax.hist(wc,bins=40,color=PALETTE[0],edgecolor='white',alpha=0.85)
 ax.set_title(f'{name}\\nmedian={int(np.median(wc))} words',fontsize=10)
 except Exception as e: ax.set_title(f'{name}\\nerror:{e}',fontsize=9)""",
"""for ax,(ds,name,col) in zip(axes,infos):
    if ds is None: 
        ax.set_visible(False); continue
    try:
        wc=[w for w in get_wc(ds,col) if w<500]
        ax.hist(wc,bins=40,color=PALETTE[0],edgecolor='white',alpha=0.85)
        ax.set_title(f'{name}\\nmedian={int(np.median(wc))} words',fontsize=10)
    except Exception as e: 
        ax.set_title(f'{name}\\nerror:{e}',fontsize=9)"""
            )
            
        # CELL 19: validate
        if "def validate(r):" in src:
            src = src.replace(
"""def validate(r):
 msgs=r.get('messages',[])
 if len(msgs)<3: return False
 roles=[m['role'] for m in msgs]
 if roles[0]!='system' or 'user' not in roles or 'assistant' not in roles: return False
 return all(m.get('content','').strip() for m in msgs)""",
"""def validate(r):
    msgs=r.get('messages',[])
    if len(msgs)<3: return False
    roles=[m['role'] for m in msgs]
    if roles[0]!='system' or 'user' not in roles or 'assistant' not in roles: return False
    return all(m.get('content','').strip() for m in msgs)"""
            )
            src = src.replace(
"""def save_jsonl(records,path):
 with open(path,'w',encoding='utf-8') as f:
 for r in records: f.write(json.dumps(r,ensure_ascii=False)+'\\n')
 print(f' Saved {len(records):,} → {path}')""",
"""def save_jsonl(records,path):
    with open(path,'w',encoding='utf-8') as f:
        for r in records: f.write(json.dumps(r,ensure_ascii=False)+'\\n')
    print(f' Saved {len(records):,} → {path}')"""
            )
            
        # CELL 21: FastLanguageModel
        if "model,tokenizer=FastLanguageModel" in src:
            src = src.replace(
"""model,tokenizer=FastLanguageModel.from_pretrained(
 model_name=CFG['model_name'],
 max_seq_length=CFG['max_seq_length'],
 dtype=None, load_in_4bit=CFG['load_in_4bit'])""",
"""model,tokenizer=FastLanguageModel.from_pretrained(
    model_name=CFG['model_name'],
    max_seq_length=CFG['max_seq_length'],
    dtype=None, load_in_4bit=CFG['load_in_4bit'])"""
            )
            src = src.replace(
"""model=FastLanguageModel.get_peft_model(
 model, r=CFG['lora_r'],
 target_modules=['q_proj','k_proj','v_proj','o_proj','gate_proj','up_proj','down_proj'],
 lora_alpha=CFG['lora_alpha'], lora_dropout=CFG['lora_dropout'],
 bias='none', use_gradient_checkpointing='unsloth', random_state=42)""",
"""model=FastLanguageModel.get_peft_model(
    model, r=CFG['lora_r'],
    target_modules=['q_proj','k_proj','v_proj','o_proj','gate_proj','up_proj','down_proj'],
    lora_alpha=CFG['lora_alpha'], lora_dropout=CFG['lora_dropout'],
    bias='none', use_gradient_checkpointing='unsloth', random_state=42)"""
            )
            
        # CELL 23: fmt
        if "def fmt(ex):" in src:
            src = src.replace(
"""def fmt(ex):
 return {'text':tokenizer.apply_chat_template(ex['messages'],tokenize=False,add_generation_prompt=False)}""",
"""def fmt(ex):
    return {'text':tokenizer.apply_chat_template(ex['messages'],tokenize=False,add_generation_prompt=False)}"""
            )
            
        # CELL 24: SFTTrainer
        if "trainer=SFTTrainer" in src:
            src = src.replace(
"""args=TrainingArguments(
 output_dir=CFG['output_dir'],
 num_train_epochs=CFG['epochs'],
 per_device_train_batch_size=CFG['batch_size'],
 per_device_eval_batch_size=CFG['batch_size'],
 gradient_accumulation_steps=CFG['grad_accum'],
 warmup_ratio=CFG['warmup_ratio'],
 weight_decay=CFG['weight_decay'],
 learning_rate=CFG['lr'],
 lr_scheduler_type='cosine',
 optim='adamw_8bit',
 fp16=not torch.cuda.is_bf16_supported(),
 bf16=torch.cuda.is_bf16_supported(),
 logging_steps=25,
 eval_strategy='epoch',
 save_strategy='epoch',
 load_best_model_at_end=True,
 metric_for_best_model='eval_loss',
 report_to='none', seed=42)""",
"""args=TrainingArguments(
    output_dir=CFG['output_dir'],
    num_train_epochs=CFG['epochs'],
    per_device_train_batch_size=CFG['batch_size'],
    per_device_eval_batch_size=CFG['batch_size'],
    gradient_accumulation_steps=CFG['grad_accum'],
    warmup_ratio=CFG['warmup_ratio'],
    weight_decay=CFG['weight_decay'],
    learning_rate=CFG['lr'],
    lr_scheduler_type='cosine',
    optim='adamw_8bit',
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    logging_steps=25,
    eval_strategy='epoch',
    save_strategy='epoch',
    load_best_model_at_end=True,
    metric_for_best_model='eval_loss',
    report_to='none', seed=42)"""
            )
            src = src.replace(
"""trainer=SFTTrainer(model=model,tokenizer=tokenizer,
 train_dataset=train_hf, eval_dataset=val_hf,
 dataset_text_field='text',
 max_seq_length=CFG['max_seq_length'],
 dataset_num_proc=2, args=args)""",
"""trainer=SFTTrainer(model=model,tokenizer=tokenizer,
    train_dataset=train_hf, eval_dataset=val_hf,
    dataset_text_field='text',
    max_seq_length=CFG['max_seq_length'],
    dataset_num_proc=2, args=args)"""
            )
            
        # CELL 28: chat
        if "def chat(" in src:
            src = src.replace(
"""def chat(system,user,max_t=150):
 msgs=[{'role':'system','content':system},{'role':'user','content':user}]
 text=tokenizer.apply_chat_template(msgs,tokenize=False,add_generation_prompt=True)
 inp=tokenizer(text,return_tensors='pt').to('cuda')
 with torch.no_grad():
 out=model.generate(**inp,max_new_tokens=max_t,temperature=0.7,
 do_sample=True,repetition_penalty=1.1)
 return tokenizer.decode(out[0][inp['input_ids'].shape[1]:],skip_special_tokens=True).strip()""",
"""def chat(system,user,max_t=150):
    msgs=[{'role':'system','content':system},{'role':'user','content':user}]
    text=tokenizer.apply_chat_template(msgs,tokenize=False,add_generation_prompt=True)
    inp=tokenizer(text,return_tensors='pt').to('cuda')
    with torch.no_grad():
        out=model.generate(**inp,max_new_tokens=max_t,temperature=0.7,
            do_sample=True,repetition_penalty=1.1)
    return tokenizer.decode(out[0][inp['input_ids'].shape[1]:],skip_special_tokens=True).strip()"""
            )
            src = src.replace(
"""for msg,emo in [('I finished all my games today!','happy'),
 ('I feel sad today.','sad'),
 ('This game is too hard!','angry'),
 ('Tell me a short story!','happy'),
 ('أنهيت كل الألعاب اليوم!','happy')]:
 r=chat(CHILD_SYS+f' Child feels {emo}.',msg,80)
 print(f'\\n {msg}\\n {r}')""",
"""for msg,emo in [('I finished all my games today!','happy'),
    ('I feel sad today.','sad'),
    ('This game is too hard!','angry'),
    ('Tell me a short story!','happy'),
    ('أنهيت كل الألعاب اليوم!','happy')]:
    r=chat(CHILD_SYS+f' Child feels {emo}.',msg,80)
    print(f'\\n {msg}\\n {r}')"""
            )
            src = src.replace(
"""for msg in ['My child scored low in color recognition, what should I do?',
 'Ahmed seems sad in his drawings, is that concerning?',
 'What activities help with reaction speed?',
 'كيف حال أحمد بشكل عام؟']:
 r=chat('You are a warm child development advisor for SmartChild. Max 4 sentences. Never diagnose.',msg)
 print(f'\\n {msg}\\n {r}')""",
"""for msg in ['My child scored low in color recognition, what should I do?',
    'Ahmed seems sad in his drawings, is that concerning?',
    'What activities help with reaction speed?',
    'كيف حال أحمد بشكل عام؟']:
    r=chat('You are a warm child development advisor for SmartChild. Max 4 sentences. Never diagnose.',msg)
    print(f'\\n {msg}\\n {r}')"""
            )
            
        # CELL 33: final print loop
        if "for f in ['smartchild-model/" in src:
            src = src.replace(
"""for f in ['smartchild-model/','smartchild_train.jsonl',
 'smartchild_val.jsonl','smartchild_final_dataset.jsonl',
 'training_curve.png','dataset_composition.png','word_distributions.png']:
 print(f' {f}')""",
"""for f in ['smartchild-model/','smartchild_train.jsonl',
    'smartchild_val.jsonl','smartchild_final_dataset.jsonl',
    'training_curve.png','dataset_composition.png','word_distributions.png']:
    print(f' {f}')"""
            )

        cell.source = src

    with open('SmartChild_Chatbot_FineTuning.ipynb', 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)

if __name__ == '__main__':
    fix()
    print("Indentation fixed strictly!")
