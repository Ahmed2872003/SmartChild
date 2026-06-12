# SmartChild ML API

This repository contains the unified Machine Learning backend for the SmartChild project, combining both the Chatbot and the Emotion Detection services.

## 🛠 Installation & Execution

**Important Prerequisite:** This repository uses **Git LFS (Large File Storage)** to securely store the large model weights. Ensure you have Git LFS installed on your system before cloning so the weights download automatically.

```bash
git lfs install
git clone <your-repo-url>
cd <your-repo-directory>
```

You can run this project either using Docker or locally.

### Option 1: Using Docker (Recommended)

The Docker setup seamlessly configures the system dependencies and exposes the API on the standard Hugging Face port.

1. Build the Docker image:

   ```bash
   docker build -t smartchild-ml-api .
   ```

2. Run the container:
   ```bash
   docker run -p 7860:7860 -d smartchild-ml-api
   ```
   _The API will be accessible at `http://localhost:7860`._

---

### Option 2: Running Locally

If you prefer to run the application outside of Docker, ensure your environment is set up with the required Python dependencies.

1. Create a virtual environment and install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Run the unified FastAPI server:
   ```bash
   uvicorn main:app --port 5001 --reload
   ```
   _The local API will be accessible at `http://localhost:5001`._

---

## 📡 Endpoints

All secured endpoints require the `X-API-Key` header for authentication.

### 1. Chatbot API

- **`POST /chatbot/child`**
  - **Headers**: `X-API-Key: <api-key>`
  - **Query Parameters**: `stream` (boolean, optional, default: false)
  - **Body (JSON)**: `childName`, `age`, `message`, `history`
  - **Returns**: A response tailored for the child.

- **`POST /chatbot/parent`**
  - **Headers**: `X-API-Key: <api-key>`
  - **Query Parameters**: `stream` (boolean, optional, default: false)
  - **Body (JSON)**: `childName`, `age`, `report`, `child_history`, `message`, `history`
  - **Returns**: A response tailored for the parent based on the child's interactions.

### 2. Emotion Detection API

- **`GET /emotion/classes`**
  - **Headers**: `X-API-Key: <api-key>`
  - **Returns**: The list of detectable emotion classes.

- **`POST /emotion/predict`**
  - **Headers**: `X-API-Key: <api-key>`
  - **Body (Multipart/Form-Data)**: Send the image file under the `file` field.
  - **Returns**: The predicted emotion and confidence scores.

### 3. System Health

- **`GET /health`**
  - _(No API Key required)_
  - **Returns**: The loading status of both models.
