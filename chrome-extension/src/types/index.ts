export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  updated_history: string[];
}

export interface UploadResponse {
  message: string;
  status: 'success' | 'error';
}

export interface ChatRequest {
  question: string;
  history: string[];
}

export interface AppState {
  isDocumentUploaded: boolean;
  chatHistory: string[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}