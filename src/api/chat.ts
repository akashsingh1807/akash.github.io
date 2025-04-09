// src/api/chat.ts

type ChatMessage = {
  content: string;
  role: 'user' | 'assistant';
};

type ChatResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

// This is a mock implementation. In a real application, you would connect to an actual API.
export const handleChatRequest = async (messages: ChatMessage[]): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // Simple response logic based on keywords
  let response = "I'm sorry, I don't understand. Could you please rephrase your question?";
  
  if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
    response = "Hello! How can I help you today?";
  } else if (lastUserMessage.toLowerCase().includes('name')) {
    response = "My name is Akash's AI Assistant. I'm here to help you learn more about Akash and his work.";
  } else if (lastUserMessage.toLowerCase().includes('skill') || lastUserMessage.toLowerCase().includes('expertise')) {
    response = "Akash is a Full Stack Java Developer with expertise in Spring Boot, Microservices, Cloud Architecture, and DevOps.";
  } else if (lastUserMessage.toLowerCase().includes('project') || lastUserMessage.toLowerCase().includes('work')) {
    response = "Akash has worked on various enterprise applications, focusing on scalable and high-performance solutions. You can check out his projects in the Projects section.";
  } else if (lastUserMessage.toLowerCase().includes('contact') || lastUserMessage.toLowerCase().includes('email')) {
    response = "You can contact Akash at Engg.akashsingh@gmail.com or connect with him on LinkedIn.";
  } else if (lastUserMessage.toLowerCase().includes('thank')) {
    response = "You're welcome! Is there anything else I can help you with?";
  }
  
  return {
    choices: [
      {
        message: {
          content: response
        }
      }
    ]
  };
}; 