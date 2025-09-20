import os
from pathlib import Path
from dotenv import load_dotenv

# Fix .env path resolution - look for .env in project root
current_dir = Path(__file__).parent
project_root = current_dir.parent.parent  # Go up to RAG project root
env_path = project_root / '.env'
load_dotenv(env_path)
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from typing import List




class PDFProcessor:
    
    def __init__(self, chunk_size=1000, chunk_overlap=100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""],
        )

    def process_pdf(self,pdf_path:str)->List[Document]:
        """Process PDF with smart chunking and metadata enhancement"""

        # Laod PDF

        loader=PyPDFLoader(pdf_path)
        pages=loader.load()

        ## Process each page

        processed_chunks=[]

        for page_num,page in enumerate(pages):
            ## clean text
            cleaned_text=self._clean_text(page.page_content)

            # Skip nearly empty pages
            if len(cleaned_text.strip()) < 50:
                continue

            # Create chunks with enhanced metadata
            chunks = self.text_splitter.create_documents(
                texts=[cleaned_text],
                metadatas=[{
                    **page.metadata,
                    "page": page_num + 1,
                    "total_pages": len(pages),
                    "chunk_method": "smart_pdf_processor",
                    "char_count": len(cleaned_text)
                }]
            )
            
            processed_chunks.extend(chunks)

        return processed_chunks

    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        text = " ".join(text.split())
        
        # Fix common PDF extraction issues
        text = text.replace("ﬁ", "fi")
        text = text.replace("ﬂ", "fl")
        
        return text




        


        
if __name__ == "__main__":
    processor = PDFProcessor(chunk_size=1000, chunk_overlap=100)
    processed_chunks = processor.process_pdf("attention.pdf")
    print(f"Created {len(processed_chunks)} chunks from {len(processed_chunks)} documents")
    print(f"\nChunk example:")
    print(f"Content: {processed_chunks[0].page_content[:150]}...")
    print(f"Metadata: {processed_chunks[0].metadata}")