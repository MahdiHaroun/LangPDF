# RAG PDF Chat Assistant# RAG PDF Chat Assistant



Chat with your PDF documents using AI-powered Retrieval-Augmented Generation (RAG).A production-ready Retrieval-Augmented Generation (RAG) pipeline with conversational memory for chatting with PDF documents. Built with LangChain, FastAPI, Streamlit, and includes a Chrome extension frontend.



## Features[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)

- 📄 Upload and chat with PDF documents[![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org)

- 💬 Conversational AI with memory[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

- 🌐 Multiple interfaces: Chrome Extension, Web App, API

- 📚 Source citations from documents## 🚀 Features



## Quick Start- 📄 **PDF Document Processing**: Smart chunking and text extraction

- 🧠 **Vector Embeddings**: FAISS-powered similarity search

### 1. Setup- 💬 **Conversational AI**: Chat with documents using memory

```bash- 🌐 **Multiple Interfaces**: Streamlit web app, FastAPI, and Chrome extension

# Install dependencies- 🔄 **Production Ready**: Error handling, CORS, and proper architecture

pip install -r requirements.txt- 📚 **Source Citations**: See relevant document excerpts for each answer



# Create .env file with your API keys## 🎯 Available Interfaces

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

## License

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

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** your changes: `git commit -m 'Add feature'`
4. **Push** to branch: `git push origin feature-name`
5. **Submit** a pull request

## 📄 License

This project is part of the RAG learning series and is provided for educational purposes.

---

**Made with ❤️ for the AI/ML community**

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

## 🧪 Testing & Usage

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


## Production Considerations

- ✅ Fixed deprecated imports
- ✅ Proper environment variable handling
- ✅ Error handling for missing dependencies
- ✅ Session state management
- ✅ Path resolution fixes
- ✅ API validation with Pydantic models


# Frontend
# RAG PDF Chrome Extension

A Chrome extension frontend for the RAG PDF Chat Assistant, providing a convenient popup interface to chat with your PDF documents using AI-powered retrieval-augmented generation.

## Features

- 🏠 **Popup Interface**: Compact 400x600px popup for easy access
- 📄 **PDF Upload**: Drag-and-drop or click to upload PDF documents
- 💬 **Real-time Chat**: Interactive chat interface with conversation history
- 📚 **Source Citations**: View relevant document excerpts for each response
- 🔄 **Server Status**: Automatic backend connection monitoring
- 💾 **Session Persistence**: Maintains chat state during browser session
- 🎨 **Modern UI**: Clean, responsive design with emoji indicators

## Prerequisites

1. **Backend Server**: The RAG PDF backend must be running on `localhost:8000`
   ```bash
   cd /path/to/LangPDF
   python main.py
   ```

2. **Node.js**: Version 16 or higher for building the extension

## Installation & Setup

### 1. Install Dependencies

```bash
cd chrome-extension
npm install
```

### 2. Build the Extension

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

### 3. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder
5. The extension should appear in your extensions list

### 4. Pin the Extension

1. Click the puzzle piece icon in Chrome toolbar
2. Find "RAG PDF Chat Assistant"
3. Click the pin icon to keep it visible

## Usage

### Starting a Chat Session

1. **Start Backend**: Ensure the Python backend is running (`python main.py`)
2. **Click Extension**: Click the extension icon in Chrome toolbar
3. **Upload PDF**: Drag & drop or click to select a PDF file
4. **Process**: Click "🚀 Process Document" and wait for confirmation
5. **Chat**: Type your questions in the chat input and press Enter

### Interface Overview

```
┌─────────────────────────────────┐
│ 🤖 RAG PDF Chat                │ ← Header
│ Chat with documents using AI    │
├─────────────────────────────────┤
│ ✅ Document ready for chat      │ ← Status Bar
├─────────────────────────────────┤
│ 📁 Upload PDF Document         │ ← Upload Section
│ [Drag & Drop Area]              │
│ [🚀 Process Document]           │
├─────────────────────────────────┤
│ 💬 Chat Messages                │ ← Chat Area
│ User: How does this work?       │
│ AI: Based on the document...    │
│ 📚 Sources: [excerpts]          │
├─────────────────────────────────┤
│ [Type your message...] [✈️]     │ ← Input Area
└─────────────────────────────────┘
```

### Features in Detail

#### PDF Upload
- **Supported Format**: PDF files only
- **Size Limit**: 10MB maximum
- **Upload Methods**: Drag & drop or file picker
- **Processing**: Real-time progress and status updates

#### Chat Interface
- **Real-time**: Instant responses from AI
- **History**: Maintains conversation context
- **Sources**: Shows relevant document excerpts
- **Scrolling**: Auto-scrolls to latest messages
- **Input**: Multi-line support with Shift+Enter

#### Status Indicators
- 🔄 Checking server status
- ❌ Server offline
- 📄 Upload a PDF to get started
- ✅ Document ready for chat

## Development

### Project Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── package.json           # NPM dependencies
├── webpack.config.js      # Build configuration
├── tsconfig.json         # TypeScript configuration
└── src/
    ├── popup/
    │   ├── index.tsx      # Entry point
    │   ├── App.tsx        # Main application
    │   └── popup.html     # HTML template
    ├── components/
    │   ├── FileUpload.tsx # PDF upload component
    │   └── ChatInterface.tsx # Chat UI component
    ├── services/
    │   └── api.ts         # API communication
    ├── types/
    │   └── index.ts       # TypeScript definitions
    ├── background/
    │   └── background.ts  # Service worker
    └── icons/
        └── *.png          # Extension icons
```

### API Integration

The extension communicates with the FastAPI backend using these endpoints:

- `POST /upload_and_process/`: Upload and process PDF documents
- `POST /chat/`: Send chat messages and receive AI responses

### Customization

#### Styling
Modify styled-components in React components for custom themes:

```typescript
const CustomButton = styled.button`
  background-color: #your-color;
  // ... other styles
`;
```

#### API Configuration
Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:port';
```

## Troubleshooting

### Common Issues

1. **Extension Not Loading**
   - Check if `dist` folder exists (run `npm run build`)
   - Verify manifest.json syntax
   - Check Chrome developer console for errors

2. **Server Connection Failed**
   - Ensure backend is running on `localhost:8000`
   - Check CORS settings in FastAPI
   - Verify network connectivity

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Ensure file is PDF format
   - Verify backend storage permissions

4. **Chat Not Working**
   - Upload a document first
   - Check backend logs for errors
   - Verify API endpoints are accessible

### Development Debugging

1. **Extension Console**:
   - Right-click extension icon → "Inspect popup"
   - Check Console tab for JavaScript errors

2. **Background Script**:
   - Go to `chrome://extensions/`
   - Click "Service worker" link under extension
   - View logs and errors

3. **Network Issues**:
   - Open DevTools → Network tab
   - Monitor API requests and responses
   - Check for CORS or timeout errors

## Building for Production

1. **Create Production Build**:
   ```bash
   npm run build
   ```

2. **Package Extension**:
   ```bash
   # Create ZIP file for Chrome Web Store
   cd dist
   zip -r ../rag-pdf-extension.zip .
   ```

3. **Chrome Web Store Upload**:
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Upload the ZIP file
   - Fill in store listing details
   - Submit for review

## Security Considerations

- Extension only connects to `localhost:8000` by default
- File uploads are processed locally through the backend
- No data is sent to external services
- Chat history is stored locally in extension storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the RAG PDF Chat Assistant and follows the same license terms.


## License

This project is part of the RAG learning series.


