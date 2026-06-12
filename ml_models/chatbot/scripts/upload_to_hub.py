"""
scripts/upload_to_hub.py
------------------------
Run this IN COLAB after training to push your fine-tuned
adapter to your HuggingFace Hub repo so you can download
it locally with download_model.py.

Usage (in Colab cell):
    !python scripts/upload_to_hub.py \
        --adapter_path ./smartchild-model \
        --repo_id      YOUR_USERNAME/smartchild-chatbot \
        --token        YOUR_HF_TOKEN
"""

import argparse
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger('upload')


def upload(adapter_path: str, repo_id: str, token: str):
    from huggingface_hub import HfApi, create_repo

    api = HfApi(token=token)

    # Create repo if it does not exist
    logger.info(f'Creating/verifying repo: {repo_id}')
    create_repo(repo_id, token=token, exist_ok=True, private=True)

    # Upload all files in adapter_path
    logger.info(f'Uploading adapter from {adapter_path} → {repo_id}')
    api.upload_folder(
        folder_path = adapter_path,
        repo_id     = repo_id,
        token       = token,
        commit_message = 'Upload SmartChild fine-tuned adapter',
    )
    logger.info(f'✅ Upload complete: https://huggingface.co/{repo_id}')
    logger.info(f'\nTo download locally:')
    logger.info(f'  python scripts/download_model.py --hf_repo {repo_id}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--adapter_path', required=True, help='Path to saved adapter folder')
    parser.add_argument('--repo_id',      required=True, help='HuggingFace repo id')
    parser.add_argument('--token',        required=True, help='HuggingFace write token')
    args = parser.parse_args()

    if not os.path.isdir(args.adapter_path):
        logger.error(f'Adapter path not found: {args.adapter_path}')
        raise SystemExit(1)

    upload(args.adapter_path, args.repo_id, args.token)
