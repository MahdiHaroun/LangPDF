// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../types';
import { RAGApiService } from '../services/api';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  chatHistory: string[];
  onNewMessage: (message: ChatMessage) => void;
  onHistoryUpdate: (history: string[]) => void;
  isDocumentUploaded: boolean;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: 400px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 16px;
  background-color: ${props => props.isUser ? '#4285f4' : '#f1f3f4'};
  color: ${props => props.isUser ? 'white' : '#333'};
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-size: 14px;
  max-height: 100px;
  min-height: 36px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#ccc' : '#4285f4'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#3367d6'};
  }
`;

const SourcesContainer = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4285f4;
`;

const SourceItem = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  padding: 4px 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 32px 16px;
  font-size: 14px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #666;
  font-size: 14px;
`;

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  chatHistory,
  onNewMessage,
  onHistoryUpdate,
  isDocumentUploaded
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isDocumentUploaded) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    // Add user message immediately
    onNewMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await RAGApiService.sendChatMessage({
        question: userMessage.content,
        history: chatHistory
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      };

      onNewMessage(assistantMessage);
      onHistoryUpdate(response.updated_history);

    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}`
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isDocumentUploaded) {
    return (
      <ChatContainer>
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <div>Upload a PDF document to start chatting!</div>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
            <div>Your document is ready!</div>
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
              Ask me anything about your document...
            </div>
          </EmptyState>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} isUser={message.role === 'user'}>
              <div>
                <MessageContent isUser={message.role === 'user'}>
                  {message.content}
                </MessageContent>
                
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <SourcesContainer>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
                      📚 Sources:
                    </div>
                    {message.sources.map((source, sourceIndex) => (
                      <SourceItem key={sourceIndex}>
                        {source}
                      </SourceItem>
                    ))}
                  </SourcesContainer>
                )}
              </div>
            </MessageBubble>
          ))
        )}
        
        {isLoading && (
          <LoadingIndicator>
            <div>🤖 Thinking...</div>
          </LoadingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your document..."
            disabled={isLoading}
            rows={1}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            ✈️
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};