// @ts-nocheck
import React, { useState } from 'react';
import styled from 'styled-components';
import { RAGApiService } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
  onUploadStart: () => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

const UploadContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#4285f4' : '#ccc'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragOver ? '#f8f9ff' : '#fafafa'};
  
  &:hover {
    border-color: #4285f4;
    background-color: #f8f9ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.p`
  margin: 8px 0;
  color: #666;
  font-size: 14px;
`;

const UploadButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#ccc' : '#4285f4'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  margin-top: 8px;
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#3367d6'};
  }
`;

const StatusText = styled.div<{ type: 'success' | 'error' | 'info' }>`
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
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
`;

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadStart,
  onError,
  isLoading
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus('Please select a PDF file');
      setStatusType('error');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus('File size must be less than 10MB');
      setStatusType('error');
      return;
    }

    setSelectedFile(file);
    setUploadStatus(`Selected: ${file.name}`);
    setStatusType('info');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      setStatusType('error');
      return;
    }

    try {
      onUploadStart();
      setUploadStatus('Processing document...');
      setStatusType('info');

      const response = await RAGApiService.uploadAndProcessDocument(selectedFile);
      
      if (response.status === 'success') {
        setUploadStatus('✅ Document processed successfully!');
        setStatusType('success');
        onUploadSuccess();
        setSelectedFile(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setUploadStatus(`❌ ${error.message}`);
      setStatusType('error');
      onError(error.message);
    }
  };

  return (
    <UploadContainer>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
        📁 Upload PDF Document
      </h3>
      
      <UploadArea
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
        <UploadText>
          {selectedFile ? selectedFile.name : 'Drop PDF here or click to select'}
        </UploadText>
        <UploadText style={{ fontSize: '12px', color: '#999' }}>
          Max size: 10MB
        </UploadText>
      </UploadArea>

      <FileInput
        id="file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
      />

      <UploadButton
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? '🔄 Processing...' : '🚀 Process Document'}
      </UploadButton>

      {uploadStatus && (
        <StatusText type={statusType}>
          {uploadStatus}
        </StatusText>
      )}
    </UploadContainer>
  );
};