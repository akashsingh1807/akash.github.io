// Chatbot utility functions for natural language understanding and response generation

import { ChatMessage, ChatIntent, QuickReplyButton, CHAT_INTENTS, MAIN_MENU_OPTIONS } from '@/types/chat';

/**
 * Analyzes user input and determines the most likely intent
 */
export function analyzeIntent(userInput: string): ChatIntent | null {
  const input = userInput.toLowerCase().trim();
  
  // Find the best matching intent based on patterns
  let bestMatch: { intent: ChatIntent; score: number } | null = null;
  
  for (const intent of CHAT_INTENTS) {
    let score = 0;
    
    for (const pattern of intent.patterns) {
      if (input.includes(pattern.toLowerCase())) {
        // Exact match gets higher score
        if (input === pattern.toLowerCase()) {
          score += 10;
        } else {
          score += 5;
        }
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { intent, score };
    }
  }
  
  return bestMatch ? bestMatch.intent : null;
}

/**
 * Generates a response based on user input using intent analysis
 */
export function generateResponse(userInput: string): {
  content: string;
  buttons?: QuickReplyButton[];
  links?: any[];
} {
  const intent = analyzeIntent(userInput);
  
  if (intent) {
    return {
      content: intent.response,
      buttons: intent.buttons,
      links: intent.links
    };
  }
  
  // Fallback response for unrecognized input
  return {
    content: "I'm not sure I understand that. Here are some things I can help you with:",
    buttons: MAIN_MENU_OPTIONS
  };
}

/**
 * Handles quick reply button actions
 */
export function handleQuickReply(buttonValue: string): {
  content: string;
  buttons?: QuickReplyButton[];
  links?: any[];
} {
  switch (buttonValue) {
    case 'show_projects':
      return generateResponse('projects');
    
    case 'show_qualifications':
      return generateResponse('skills');
    
    case 'contact_support':
      return generateResponse('contact');
    
    case 'submit_requirements':
      return generateResponse('requirements');
    
    default:
      return {
        content: "How can I help you today?",
        buttons: MAIN_MENU_OPTIONS
      };
  }
}

/**
 * Creates a welcome message with main menu options
 */
export function createWelcomeMessage(): ChatMessage {
  return {
    id: `msg_${Date.now()}`,
    content: "Hi there! I'm Akash's AI assistant. I can help you explore his projects, learn about his qualifications, or discuss your project requirements. What would you like to know?",
    role: 'assistant',
    timestamp: new Date(),
    type: 'menu',
    metadata: {
      buttons: MAIN_MENU_OPTIONS
    }
  };
}

/**
 * Generates a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats chat messages for AI API consumption
 */
export function formatMessagesForAI(messages: ChatMessage[]): Array<{role: string; content: string}> {
  return messages
    .filter(msg => msg.type === 'text' || !msg.type) // Only include text messages for AI context
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
}

/**
 * Creates a system prompt for the AI to understand the context
 */
export function createSystemPrompt(): string {
  return `You are Akash Singh's AI assistant for his portfolio website. You help visitors learn about:

1. PROJECTS: Akash is a Full Stack Java Developer with 5+ years experience. Key projects include:
   - E-commerce platforms with Spring Boot and React
   - Microservices architecture with Docker/Kubernetes
   - Cloud-native applications on AWS/Azure
   - This portfolio website with AI chatbot

2. QUALIFICATIONS:
   - Skills: Java, Spring Boot, React, TypeScript, Microservices, Cloud (AWS/Azure), DevOps, CI/CD
   - Experience: 5+ years Full Stack Development
   - Certifications: AWS Solutions Architect, Oracle Java, Spring Professional
   - Education: Bachelor's in Computer Science

3. CONTACT: Email at Engg.akashsingh@gmail.com, LinkedIn, or through the contact form

Guidelines:
- Be helpful, professional, and concise
- Always offer relevant quick actions (buttons)
- For project inquiries, guide them to email or contact form
- If unsure, offer the main menu options
- Keep responses under 150 words
- Use a friendly, professional tone`;
}

/**
 * Validates and sanitizes user input
 */
export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Determines if a message should trigger AI processing or use rule-based responses
 */
export function shouldUseAI(userInput: string): boolean {
  const input = userInput.toLowerCase();
  
  // Use rule-based for simple, common queries
  const simplePatterns = ['hello', 'hi', 'projects', 'skills', 'contact', 'help'];
  
  for (const pattern of simplePatterns) {
    if (input.includes(pattern)) {
      return false; // Use rule-based response
    }
  }
  
  // Use AI for complex queries
  return input.length > 20 || input.includes('?');
}
