
// Temporary chat API placeholder
// This file is needed by Chatbot.tsx

export const sendMessage = async (message: string) => {
  console.log('Message sent:', message);
  // In a real implementation, this would send the message to a backend
  return {
    text: 'This is a placeholder response. The chat API is not fully implemented.',
    timestamp: new Date().toISOString(),
  };
};

export const fetchChatHistory = async () => {
  // In a real implementation, this would fetch chat history from storage or backend
  return [];
};
