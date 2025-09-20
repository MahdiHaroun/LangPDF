from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pathlib import Path
from dotenv import load_dotenv
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os

# Fix .env path resolution - look for .env in project root
current_dir = Path(__file__).parent
project_root = current_dir.parent.parent  # Go up to RAG project root
env_path = project_root / '.env'
load_dotenv(env_path)





class RAGChainWithHistory: 
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"), 
            model_name="Gemma2-9b-It"
        )
        self.conversational_rag_chain = None

    def create_contextualize_q_prompt(self):
        contextualize_q_system_prompt = """Given a chat history and the latest user question 
        which might reference context in the chat history, formulate a standalone question 
        which can be understood without the chat history. Do NOT answer the question, 
        just reformulate it if needed and otherwise return it as is.""" 

        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        return contextualize_q_prompt
    
    def create_history_aware_retriever(self, retriever):
        contextualize_q_prompt = self.create_contextualize_q_prompt()
        history_aware_retriever = create_history_aware_retriever(
            llm=self.llm,
            retriever=retriever,
            prompt=contextualize_q_prompt,
        )
        return history_aware_retriever
    
    def create_question_answer_chain(self): 
        qa_system_prompt = """You are an assistant for question-answering tasks. 
        Use the following pieces of retrieved context to answer the question. 
        If you don't know the answer, just say that you don't know. 
        Use three sentences maximum and keep the answer concise.

        {context}"""

        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        qa_chain = create_stuff_documents_chain(
            llm=self.llm,
            prompt=qa_prompt
        ) 

        return qa_chain
    
    def create_conversational_rag_chain(self, retriever):
        """Create the complete conversational RAG chain"""
        history_aware_retriever = self.create_history_aware_retriever(retriever)
        qa_chain = self.create_question_answer_chain()
        
        conversational_rag_chain = create_retrieval_chain(
            history_aware_retriever,
            qa_chain,
        )
        
        self.conversational_rag_chain = conversational_rag_chain
        return conversational_rag_chain
    





         


    


    
   