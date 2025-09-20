// @ts-nocheck
import axios from 'axios';
import { ChatRequest, ChatResponse, UploadResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export class RAGApiService {
  /**
   * Upload and process a PDF document
   */
  static async uploadAndProcessDocument(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/upload_and_process/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file upload
      });

      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message || 'Failed to upload document');
      }
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Send a chat message and get AI response
   */
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post('/chat/', request);
      return response.data;
    } catch (error: any) {
      console.error('Chat error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Please upload and process a document first');
        }
        throw new Error(error.response?.data?.detail || error.message || 'Failed to send message');
      }
      throw new Error('Failed to send message');
    }
  }

  /**
   * Check if the API server is available
   */
  static async checkServerHealth(): Promise<boolean> {
    try {
      // Try to make a simple request to check if server is running
      await axios.get(`${API_BASE_URL}/docs`, { timeout: 5000 });
      return true;
    } catch (error: any) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
}