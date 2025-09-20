
from langchain_core.messages import HumanMessage, AIMessage


class ChatRAG:
    def __init__(self):
        """Initialize the ChatRAG - will be configured with existing RAG chain"""
        self.conversational_rag_chain = None

    def initialize_chain(self, conversational_rag_chain):
        """Initialize with an already created conversational RAG chain"""
        self.conversational_rag_chain = conversational_rag_chain
    
    def get_answer(self, question, chat_history):
        """Get an answer from the RAG system"""
        if not self.conversational_rag_chain:
            raise ValueError("RAG chain is not initialized. Please create it first using initialize_chain().")
        
        result = self.conversational_rag_chain.invoke({
            "input": question,
            "chat_history": chat_history
        })
        
        return result
    
    def get_updated_history(self, chat_history, result):
        """Update chat history with the latest question and answer"""
        chat_history.extend([
            HumanMessage(content=result['input']),
            AIMessage(content=result['answer'])
        ])
        return chat_history
    
    def extract_sources(self, result):
        """Extract and display sources from the result, return them as a list"""
        if 'context' not in result or not result['context']:
            print("No sources found in the result.")
            return []
        
        sources = []
        for i, doc in enumerate(result['context']):
            print(f"\n--- Source {i+1} ---")
            # Show only the first 200 characters for readability
            source_text = doc.page_content[:200] + "..."
            print(source_text)
            sources.append(source_text)
        
        return sources
    
    def convert_history_to_strings(self, chat_history):
        """Convert message history to list of strings"""
        history_strings = []
        for msg in chat_history:
            if isinstance(msg, HumanMessage):
                history_strings.append(msg.content)
            elif isinstance(msg, AIMessage):
                history_strings.append(msg.content)
        return history_strings
