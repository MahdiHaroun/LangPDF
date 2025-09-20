import os
from pathlib import Path
from dotenv import load_dotenv

# Fix .env path resolution - look for .env in project root
current_dir = Path(__file__).parent
project_root = current_dir.parent.parent  # Go up to RAG project root
env_path = project_root / '.env'
load_dotenv(env_path)

os.environ["HF_TOKEN"]=os.getenv("HF_TOKEN")
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from classes.proccessing import PDFProcessor

class VectorEmbedder: 
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2", 
            model_kwargs={"device": "cpu"}
        )

    def embed_chunks(self, processed_chunks):
        """Create FAISS vector store from processed document chunks"""
        vector_store = FAISS.from_documents(
            documents=processed_chunks,
            embedding=self.embeddings
        )

        retriever = vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4}
        )

        return retriever, vector_store 
    
    
        

          
     

