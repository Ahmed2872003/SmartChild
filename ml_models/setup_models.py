import os
import zipfile
import gdown
import shutil

DRIVE_URL = "https://drive.google.com/drive/folders/1519K-yMYTbHCHeDNcNufoVdkJH7catUi?usp=sharing"

def extract_zip(zip_path, extract_to):
    print(f"Extracting {zip_path} to {extract_to}...")
    os.makedirs(extract_to, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

def main():
    print("Downloading model weights from Google Drive...")
    os.makedirs('downloads', exist_ok=True)
    try:
        gdown.download_folder(url=DRIVE_URL, output='downloads', quiet=False, use_cookies=False)
    except Exception as e:
        print(f"Error downloading folder: {e}")
        return

    chatbot_zip = 'downloads/chatbot.zip'
    drawing_zip = 'downloads/drawing.zip'
    
    if os.path.exists(chatbot_zip):
        extract_zip(chatbot_zip, 'chatbot/model/weights')
    else:
        print(f"Warning: {chatbot_zip} not found in the downloaded folder!")

    if os.path.exists(drawing_zip):
        extract_zip(drawing_zip, 'emotion')
    else:
        print(f"Warning: {drawing_zip} not found in the downloaded folder!")

    print("Cleaning up...")
    shutil.rmtree('downloads', ignore_errors=True)
    print("Model setup complete!")

if __name__ == '__main__':
    main()
