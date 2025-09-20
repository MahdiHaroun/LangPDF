# RAG PDF Chat Assistant# RAG PDF Chat Assistant



Chat with your PDF documents using AI-powered Retrieval-Augmented Generation (RAG).A production-ready Retrieval-Augmented Generation (RAG) pipeline with conversational memory for chatting with PDF documents. Built with LangChain, FastAPI, Streamlit, and includes a Chrome extension frontend.
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)



## Features



-  Upload and chat with PDF documents

-  Conversational AI with memory

-  Multiple interfaces: Chrome Extension, Web App, API

-  Source citations from documents## 🚀 Features



## Quick Start-  **PDF Document Processing**: Smart chunking and text extraction

-  **Vector Embeddings**: FAISS-powered similarity search

### 1. Setup-  **Conversational AI**: Chat with documents using memory

```bash-  **Multiple Interfaces**: Streamlit web app, FastAPI, and Chrome extension

# Install dependencies-  **Production Ready**: Error handling, CORS, and proper architecture

pip install -r requirements.txt-  **Source Citations**: See relevant document excerpts for each answer



# Create .env file with your API keys##  Available Interfaces

GROQ_API_KEY=your_groq_api_key_here

HF_TOKEN=your_huggingface_token_here### 1. Chrome Extension (Recommended)

```- **Popup Interface**: 400x600px convenient popup

- **PDF Upload**: Drag-and-drop with real-time processing

### 2. Run Backend- **Chat Interface**: Interactive messaging with history

```bash- **Server Monitoring**: Automatic backend status checks

python main.py- **Location**: `./chrome-extension/`

# Server runs on http://localhost:8000

```### 2. Streamlit Web App (Good for Testing)

- **File Upload**: PDF processing via web interface

### 3. Choose Interface- **Chat Interface**: Real-time conversation with documents

- **Source Display**: View document excerpts used for answers

**Chrome Extension (Recommended)**- **Run**: `streamlit run frontend.py`

```bash

cd chrome-extension### 3. FastAPI Backend (Core Service)

npm install- **REST API**: Production-ready endpoints

npm run build- **Documentation**: Auto-generated at `/docs`

# Load chrome-extension/dist/ in Chrome Developer Mode- **CORS Enabled**: Cross-origin request support

```- **Run**: `python main.py`



**Web App**

```bash

streamlit run frontend.py## 📋 Prerequisites

# Open http://localhost:8501

```1. **Python Environment**: Python 3.8+ with required packages

   ```bash

**API Only**   pip install -r requirements.txt

- Visit http://localhost:8000/docs for API documentation   ```



## Usage2. **Environment Variables**: Create a `.env` file in the project root:

   ```env

1. Start the backend server   GROQ_API_KEY=your_groq_api_key_here

2. Choose your preferred interface   HF_TOKEN=your_huggingface_token_here

3. Upload a PDF document   ```

4. Start asking questions about the document

3. **Node.js** (For Chrome Extension): Version 16+ for building the extension

## Project Structure

## 🚀 Quick Start

```

LangPDF/### Option 1: Chrome Extension (Most Convenient)

├── main.py              # FastAPI backend

├── frontend.py          # Streamlit web app1. **Start Backend**:

├── requirements.txt     # Python dependencies   ```bash

├── classes/            # RAG pipeline components   python main.py

└── chrome-extension/   # Chrome extension frontend   ```

```

2. **Build Extension**:

## API Endpoints   ```bash

   cd chrome-extension

- `POST /upload_and_process/` - Upload and process PDF   npm install

- `POST /chat/` - Chat with processed document   npm run build

   ```

## Tech Stack

3. **Install in Chrome**:

- **Backend**: FastAPI, LangChain, FAISS   - Go to `chrome://extensions/`

- **Frontend**: Streamlit, React (Chrome Extension)   - Enable "Developer mode"

- **AI**: ChatGroq (Gemma2-9b), HuggingFace Embeddings   - Click "Load unpacked" → Select `chrome-extension/dist/`

   - Click the extension icon and upload a PDF!

### Option 2: Streamlit Interface

MIT License - Feel free to use and modify!
1. **Run Streamlit**:
   ```bash
   streamlit run frontend.py
   ```

2. **Open Browser**: Go to `http://localhost:8501`

3. **Upload & Chat**: Upload a PDF and start asking questions!

### Option 3: FastAPI Backend Only

1. **Start Server**:
   ```bash
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **API Documentation**: Visit `http://localhost:8000/docs`

3. **Use Endpoints**:
   - `POST /upload_and_process/` - Upload and process PDFs
   - `POST /chat/` - Chat with processed documents

## 📦 API Reference

### Upload and Process Document
```bash
curl -X POST "http://localhost:8000/upload_and_process/" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your_document.pdf"
```

**Response:**
```json
{
    "message": "File processed successfully",
    "status": "success"
}
```

### Chat with Document
```bash
curl -X POST "http://localhost:8000/chat/" \
     -H "accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What is this document about?",
       "history": []
     }'
```

**Response:**
```json
{
    "answer": "This document discusses...",
    "sources": ["Relevant excerpt 1...", "Relevant excerpt 2..."],
    "updated_history": ["What is this document about?", "This document discusses..."]
}
```




This project is part of the RAG learning series and is provided for educational purposes.

---


## 🏗️ Project Architecture

### Core Components

1. **PDFProcessor** (`classes/proccessing.py`)
   - PDF loading and text extraction
   - Smart chunking with overlap
   - Metadata preservation

2. **VectorEmbedder** (`classes/addVector.py`) 
   - HuggingFace embeddings (`all-MiniLM-L6-v2`)
   - FAISS vector store
   - Similarity search configuration

3. **RAGChainWithHistory** (`classes/RAG_chains.py`)
   - Conversational RAG with memory
   - History-aware retrieval
   - ChatGroq integration

4. **RAG_pipeline** (`classes/RAG_Pipeline.py`)
   - Pipeline orchestration
   - State management
   - Error handling

### File Structure
```
LangPDF/
├── main.py                    # FastAPI backend server
├── frontend.py                # Streamlit web interface  
├── requirements.txt           # Python dependencies
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── README.md                # This documentation
├── classes/                 # Core RAG components
│   ├── RAG_Pipeline.py      # Main pipeline orchestrator
│   ├── RAG_chains.py        # Conversational RAG
│   ├── proccessing.py       # PDF processing
│   ├── addVector.py         # Vector embeddings
│   └── chat.py             # Chat utilities
└── chrome-extension/        # Chrome extension frontend
    ├── manifest.json        # Extension configuration
    ├── package.json         # NPM dependencies
    ├── webpack.config.js    # Build configuration
    ├── src/                 # Extension source code
    └── dist/               # Built extension files
```

## ⚙️ Configuration

### Environment Variables
- `GROQ_API_KEY`: Required for ChatGroq LLM access
- `HF_TOKEN`: Optional for HuggingFace model downloads

### Model Configuration
- **Embedding Model**: `all-MiniLM-L6-v2` (CPU-optimized)
- **LLM**: `Gemma2-9b-It` via ChatGroq
- **Vector Store**: FAISS with similarity search
- **Chunk Size**: 1000 characters with 100 overlap
- **Max File Size**: 10MB for uploads

## Testing & Usage

### Chrome Extension Testing
1. Build and install the extension (see Quick Start)
2. Start the backend: `python main.py`
3. Click extension icon → upload PDF → start chatting
4. Test features: drag-drop, chat history, source citations

### Streamlit Interface Testing
1. Run: `streamlit run frontend.py`
2. Upload a test PDF document
3. Ask questions and verify responses
4. Check chat history persistence

### FastAPI Testing
1. Start server: `python main.py`
2. Visit: `http://localhost:8000/docs`
3. Test `/upload_and_process/` endpoint
4. Test `/chat/` endpoint with conversation history

## 💭 How Conversational Memory Works

This RAG system implements **stateless conversational memory** where chat history is maintained by the frontend and sent with each request.

### 🔄 Complete Request Flow

```python
# Each /chat/ request follows this pattern:

# 1. Start with empty history  
chat_history = []

# 2. Rebuild from frontend strings
for i in range(0, len(request.history), 2):
    if i + 1 < len(request.history):
        chat_history.append(HumanMessage(content=request.history[i]))
        chat_history.append(AIMessage(content=request.history[i + 1]))

# 3. Process current question with context
result = conversational_rag_chain.invoke({
    "input": request.question,
    "chat_history": chat_history
})

# 4. Add current Q&A to history
updated_history = chat_history + [
    HumanMessage(content=request.question),
    AIMessage(content=result['answer'])
]

# 5. Convert back to strings for response
history_strings = [msg.content for msg in updated_history]
```

### 📊 Example Request/Response

**First Request:**
```json
{
    "question": "What is machine learning?",
    "history": []
}
```

**First Response:**
```json
{
    "answer": "Machine learning is a subset of AI that...",
    "sources": ["Document excerpt 1...", "Document excerpt 2..."],
    "updated_history": [
        "What is machine learning?", 
        "Machine learning is a subset of AI that..."
    ]
}
```

**Second Request (with context):**
```json
{
    "question": "Give me examples",
    "history": [
        "What is machine learning?", 
        "Machine learning is a subset of AI that..."
    ]
}
```

**Second Response:**
```json
{
    "answer": "Some examples include neural networks, decision trees...",
    "sources": ["Document excerpt 3..."],
    "updated_history": [
        "What is machine learning?", 
        "Machine learning is a subset of AI that...",
        "Give me examples",
        "Some examples include neural networks, decision trees..."
    ]
}
```


