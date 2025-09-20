from classes.proccessing import PDFProcessor 
from classes.addVector import VectorEmbedder 
from classes.RAG_chains import RAGChainWithHistory 

class RAG_pipeline: 
    
    def __init__(self): 
        self.pdf_processor = PDFProcessor() 
        self.vector_embedder = VectorEmbedder()
        self.rag_chain = RAGChainWithHistory()
        self.vector_store = None
        self.retriever = None
        self.conversational_rag_chain = None
        self.is_initialized = False

    def start_RAG(self, file_path): 

            
        try:
            # Step 1: Process the PDF and get text chunks 
            print("Processing PDF...")
            processed_chunks = self.pdf_processor.process_pdf(file_path) 
            print(f"Created {len(processed_chunks)} chunks from PDF")

            # Step 2: Initialize embeddings and vector store 
            print("Creating embeddings and vector store...")
            self.retriever, self.vector_store = self.vector_embedder.embed_chunks(processed_chunks)
            print("Vector store created successfully")

            # Step 3: Create RAG chain with history 
            print("Setting up RAG chain...")
            self.conversational_rag_chain = self.rag_chain.create_conversational_rag_chain(self.retriever)
            print("RAG chain initialized")

            # Mark as initialized
            self.is_initialized = True

            return "RAG is READY"
            
        except Exception as e:
            print(f"Error in RAG pipeline: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}"
    

    
