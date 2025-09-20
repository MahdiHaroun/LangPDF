from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from classes.RAG_Pipeline import RAG_pipeline 
from classes.chat import ChatRAG
from langchain_core.messages import HumanMessage, AIMessage
import tempfile
import shutil
import os

app = FastAPI() 

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_pipeline = RAG_pipeline() 
chat_rag = ChatRAG()  # Initialize ChatRAG instance

class ChatRequest(BaseModel):
    question: str
    history: List[str] = []


@app.post("/upload_and_process/")
async def upload_and_process(file: UploadFile):
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            # Copy uploaded file content to temp file
            shutil.copyfileobj(file.file, tmp)
            temp_file_path = tmp.name  # Path to temporary file

        # Process the file with RAG pipeline
        result = rag_pipeline.start_RAG(temp_file_path)
        
        # Clean up temp file
        os.remove(temp_file_path)

        if "RAG is READY" in result:
            # Initialize ChatRAG with the already created conversational RAG chain from pipeline
            if rag_pipeline.conversational_rag_chain:
                chat_rag.initialize_chain(rag_pipeline.conversational_rag_chain)
            
            return {"message": "File processed successfully", "status": "success"}
        else:
            return {"message": f"Processing failed: {result}", "status": "error"}
            
    except Exception as e:
        # Clean up temp file if it exists
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        return {"message": f"Error processing file: {str(e)}", "status": "error"}



@app.post("/chat/")
async def chat(request: ChatRequest):
    try:
        # Check if RAG system is initialized
        if not chat_rag.conversational_rag_chain:
            raise HTTPException(status_code=400, detail="RAG system not initialized. Please upload and process a document first.")
        
        # Convert string history from request to message format
        chat_history = []
        for i in range(0, len(request.history), 2):
            if i + 1 < len(request.history):
                chat_history.append(HumanMessage(content=request.history[i]))
                chat_history.append(AIMessage(content=request.history[i + 1]))
        
        print(f"Incoming chat history: {len(chat_history)} messages")
        
        # Get answer using ChatRAG
        result = chat_rag.get_answer(request.question, chat_history)
        
        # Update chat history using ChatRAG (this appends the new Q&A)
        updated_history = chat_rag.get_updated_history(chat_history, result)
        
        # Extract sources using ChatRAG
        sources = chat_rag.extract_sources(result)
        
        # Convert updated history back to strings for response
        history_strings = chat_rag.convert_history_to_strings(updated_history)

        print(f"Updated chat history: {len(updated_history)} messages")
        print(f"History strings: {history_strings}")
        
        return {
            "answer": result['answer'], 
            "sources": sources, 
            "updated_history": history_strings
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during chat: {str(e)}")
    


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)