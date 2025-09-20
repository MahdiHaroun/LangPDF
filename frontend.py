import streamlit as st
import requests
import json

# Configure Streamlit page
st.set_page_config(
    page_title="RAG Chat Assistant",
    page_icon="🤖",
    layout="wide"
)

# API Configuration
API_BASE_URL = "http://localhost:8000"

def main():
    st.title("🤖 RAG Chat Assistant")
    st.markdown("Upload a document and chat with your AI assistant!")
    
    # Initialize session state
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "document_uploaded" not in st.session_state:
        st.session_state.document_uploaded = False
    
    # Sidebar for file upload
    with st.sidebar:
        st.header("📁 Document Upload")
        
        uploaded_file = st.file_uploader(
            "Choose a PDF file",
            type=['pdf'],
            help="Upload a PDF document to chat with"
        )
        
        if uploaded_file is not None:
            if st.button("🚀 Process Document", type="primary"):
                with st.spinner("Processing document..."):
                    success = upload_and_process_document(uploaded_file)
                    if success:
                        st.session_state.document_uploaded = True
                        st.session_state.chat_history = []  # Reset chat history
                        st.session_state.messages = []  # Reset displayed messages
                        st.success("✅ Document processed successfully!")
                        st.rerun()
                    else:
                        st.error("❌ Failed to process document")
        
        # Display upload status
        if st.session_state.document_uploaded:
            st.success("📄 Document is ready for chat!")
        else:
            st.warning("⚠️ Please upload and process a document first")
        
        # Clear chat button
        if st.button("🗑️ Clear Chat"):
            st.session_state.chat_history = []
            st.session_state.messages = []
            st.rerun()
    
    # Main chat interface
    st.header("💬 Chat Interface")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            
            # Show sources if available
            if message["role"] == "assistant" and "sources" in message:
                if message["sources"]:
                    with st.expander("📚 View Sources"):
                        for i, source in enumerate(message["sources"], 1):
                            st.markdown(f"**Source {i}:**")
                            st.text(source)
                            st.markdown("---")
    
    # Chat input
    if prompt := st.chat_input("Ask me anything about your document..."):
        if not st.session_state.document_uploaded:
            st.error("⚠️ Please upload and process a document first!")
            return
        
        # Add user message to chat
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = send_chat_message(prompt)
                
                if response:
                    # Display answer
                    st.markdown(response["answer"])
                    
                    # Add assistant message to chat
                    assistant_message = {
                        "role": "assistant", 
                        "content": response["answer"],
                        "sources": response.get("sources", [])
                    }
                    st.session_state.messages.append(assistant_message)
                    
                    # Update chat history for next request
                    st.session_state.chat_history = response.get("updated_history", [])
                    
                    # Show sources
                    if response.get("sources"):
                        with st.expander("📚 View Sources"):
                            for i, source in enumerate(response["sources"], 1):
                                st.markdown(f"**Source {i}:**")
                                st.text(source)
                                st.markdown("---")
                else:
                    st.error("Failed to get response from AI")

def upload_and_process_document(uploaded_file):
    """Upload and process document via FastAPI"""
    try:
        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")}
        response = requests.post(f"{API_BASE_URL}/upload_and_process/", files=files)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("status") == "success"
        else:
            st.error(f"Upload failed: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        st.error(f"Connection error: {str(e)}")
        return False

def send_chat_message(question):
    """Send chat message to FastAPI backend"""
    try:
        payload = {
            "question": question,
            "history": st.session_state.chat_history
        }
        
        response = requests.post(
            f"{API_BASE_URL}/chat/",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Chat failed: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        st.error(f"Connection error: {str(e)}")
        return None

if __name__ == "__main__":
    main()