// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FileUpload } from '../components/FileUpload';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage, AppState } from '../types';
import { RAGApiService } from '../services/api';

const AppContainer = styled.div`
  height: 600px;
  width: 400px;
  display: flex;
  flex-direction: column;
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
`;

const StatusBar = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 8px 16px;
  font-size: 12px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#e8f5e8';
      case 'error': return '#ffeaea';
      case 'info': return '#e3f2fd';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#2e7d32';
      case 'error': return '#d32f2f';
      case 'info': return '#1976d2';
      default: return '#666';
    }
  }};
  border-bottom: 1px solid #e0e0e0;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background-color: #ffeaea;
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  margin-left: auto;
  
  &:hover {
    color: #333;
  }
`;

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isDocumentUploaded: false,
    chatHistory: [],
    messages: [],
    isLoading: false,
    error: null
  });

  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    setServerStatus('checking');
    try {
      const isOnline = await RAGApiService.checkServerHealth();
      setServerStatus(isOnline ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleUploadStart = () => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
  };

  const handleUploadSuccess = () => {
    setAppState(prev => ({
      ...prev,
      isDocumentUploaded: true,
      isLoading: false,
      error: null,
      messages: [],
      chatHistory: []
    }));
  };

  const handleUploadError = (error: string) => {
    setAppState(prev => ({
      ...prev,
      isLoading: false,
      error
    }));
  };

  const handleNewMessage = (message: ChatMessage) => {
    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };

  const handleHistoryUpdate = (history: string[]) => {
    setAppState(prev => ({
      ...prev,
      chatHistory: history
    }));
  };

  const handleClearChat = () => {
    setAppState(prev => ({
      ...prev,
      messages: [],
      chatHistory: []
    }));
  };

  const renderStatusBar = () => {
    if (serverStatus === 'offline') {
      return (
        <StatusBar type="error">
          ❌ Server offline - Make sure the backend is running on localhost:8000
        </StatusBar>
      );
    }
    
    if (serverStatus === 'checking') {
      return (
        <StatusBar type="info">
          🔄 Checking server status...
        </StatusBar>
      );
    }

    if (appState.isDocumentUploaded) {
      return (
        <StatusBar type="success">
          ✅ Document ready for chat
          <ClearButton onClick={handleClearChat} title="Clear chat history">
            🗑️ Clear
          </ClearButton>
        </StatusBar>
      );
    }

    return (
      <StatusBar type="info">
        📄 Upload a PDF to get started
      </StatusBar>
    );
  };

  return (
    <AppContainer>
      <Header>
        <Title>🤖 RAG PDF Chat</Title>
        <Subtitle>Chat with your documents using AI</Subtitle>
      </Header>

      {renderStatusBar()}

      {appState.error && (
        <ErrorMessage>
          {appState.error}
        </ErrorMessage>
      )}

      <MainContent>
        {serverStatus === 'online' ? (
          <>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadStart={handleUploadStart}
              onError={handleUploadError}
              isLoading={appState.isLoading}
            />
            <ChatInterface
              messages={appState.messages}
              chatHistory={appState.chatHistory}
              onNewMessage={handleNewMessage}
              onHistoryUpdate={handleHistoryUpdate}
              isDocumentUploaded={appState.isDocumentUploaded}
            />
          </>
        ) : (
          <div style={{ 
            padding: '32px 16px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
            <div style={{ marginBottom: '8px' }}>Backend Server Required</div>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              Please start the FastAPI server:<br/>
              <code style={{ 
                background: '#f5f5f5', 
                padding: '2px 4px', 
                borderRadius: '3px',
                fontSize: '11px'
              }}>
                python main.py
              </code>
            </div>
            <button
              onClick={checkServerStatus}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Retry Connection
            </button>
          </div>
        )}
      </MainContent>
    </AppContainer>
  );
};