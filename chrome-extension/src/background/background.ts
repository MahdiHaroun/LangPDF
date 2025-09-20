// Background script for RAG PDF Chat Extension

// Listen for extension installation
(globalThis as any).chrome.runtime.onInstalled.addListener((details: any) => {
  if (details.reason === 'install') {
    console.log('RAG PDF Chat Extension installed');
    
    // Set default storage values
    (globalThis as any).chrome.storage.local.set({
      documentUploaded: false,
      chatHistory: [],
      messages: []
    });
  }
});

// Listen for messages from popup or content scripts
(globalThis as any).chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  switch (request.action) {
    case 'checkServerStatus':
      // This could be used to check server status if needed
      fetch('http://localhost:8000/docs')
        .then((response: any) => {
          sendResponse({ status: 'online', success: response.ok });
        })
        .catch((error: any) => {
          sendResponse({ status: 'offline', error: error.message });
        });
      return true; // Keep message channel open for async response
      
    case 'clearStorage':
      (globalThis as any).chrome.storage.local.clear(() => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'saveState':
      (globalThis as any).chrome.storage.local.set(request.state, () => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'loadState':
      (globalThis as any).chrome.storage.local.get(null, (data: any) => {
        sendResponse({ data });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle tab updates (optional - could be used to inject content scripts)
(globalThis as any).chrome.tabs.onUpdated.addListener((tabId: any, changeInfo: any, tab: any) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could be used to detect PDF pages or inject functionality
    console.log('Tab updated:', tab.url);
  }
});

export {};