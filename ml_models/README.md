# SmartChild ML API

This repository contains the unified Machine Learning backend for the SmartChild project, combining both the Chatbot and the Emotion Detection services.

## 🛠 Installation & Execution

You can run this project either using Docker (which automates the model setup) or locally.

### Option 1: Using Docker (Recommended)

The Docker setup automatically downloads the necessary model weights and configures the system dependencies. You **do not** need to download the models manually.

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

If you run the application outside of Docker, you must download the model weights manually.

**1. Model Weights Setup**
The model weights are too large to be stored in version control and are instead hosted on Google Drive.

**[Download Models from Google Drive Here](https://drive.google.com/drive/folders/1519K-yMYTbHCHeDNcNufoVdkJH7catUi?usp=sharing)**

Once downloaded, extract the ZIP files:

- Extract `chatbot.zip` into your chatbot model directory in `chatbot/model/weights`.
- Extract `drawing.zip` into your emotion model root directory.

**2. Start the Server**
Create a virtual environment and install dependencies:

```bash
pip install -r requirements.txt
```

Run the unified FastAPI server:

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
