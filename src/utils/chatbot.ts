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

    case 'discuss_project_here':
      return {
        content: "Great! I'd love to learn about your project. Please tell me:\n\n🎯 **What type of application** are you looking to build?\n⚙️ **What technologies** do you prefer or need?\n📅 **What's your timeline** for the project?\n💰 **Do you have a budget range** in mind?\n\nFeel free to share as much detail as you'd like - I'm here to help!",
        buttons: [
          {
            id: 'web_app',
            label: '🌐 Web Application',
            value: 'project_type_web',
            action: 'message'
          },
          {
            id: 'mobile_app',
            label: '📱 Mobile App',
            value: 'project_type_mobile',
            action: 'message'
          },
          {
            id: 'enterprise',
            label: '🏢 Enterprise System',
            value: 'project_type_enterprise',
            action: 'message'
          },
          {
            id: 'ecommerce',
            label: '🛒 E-commerce Platform',
            value: 'project_type_ecommerce',
            action: 'message'
          }
        ]
      };

    case 'project_type_web':
      return {
        content: "Excellent choice! Web applications are my specialty. I can help you build:\n\n🚀 **Modern SPAs** with React/TypeScript\n⚡ **Fast APIs** with Spring Boot\n☁️ **Cloud-native** solutions on AWS/Azure\n📊 **Real-time features** with WebSockets\n🔒 **Secure authentication** and authorization\n\nWhat specific features do you need in your web application?",
        buttons: MAIN_MENU_OPTIONS
      };

    case 'project_type_mobile':
      return {
        content: "Great! For mobile development, I can help with:\n\n📱 **React Native** for cross-platform apps\n🌐 **Progressive Web Apps** (PWAs)\n🔗 **API integration** with mobile backends\n📊 **Real-time data sync**\n🔔 **Push notifications**\n\nWhat type of mobile experience are you envisioning?",
        buttons: MAIN_MENU_OPTIONS
      };

    case 'project_type_enterprise':
      return {
        content: "Perfect! Enterprise systems are where I excel. I can help with:\n\n🏗️ **Microservices architecture**\n🔄 **System integration** and APIs\n📈 **Scalable solutions** for high traffic\n🛡️ **Enterprise security** standards\n📊 **Data analytics** and reporting\n☁️ **Cloud migration** strategies\n\nWhat's the scale and complexity of your enterprise needs?",
        buttons: MAIN_MENU_OPTIONS
      };

    case 'project_type_ecommerce':
      return {
        content: "E-commerce is one of my favorite domains! I can build:\n\n🛒 **Complete shopping platforms**\n💳 **Payment gateway integration**\n📦 **Inventory management**\n👥 **User management** and profiles\n📊 **Analytics and reporting**\n📱 **Mobile-responsive** design\n\nWhat's your target market and expected scale?",
        buttons: MAIN_MENU_OPTIONS
      };

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
export function formatMessagesForAI(messages: ChatMessage[]): Array<{role: 'user' | 'assistant'; content: string}> {
  return messages
    .filter(msg => msg.type === 'text' || !msg.type) // Only include text messages for AI context
    .map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));
}

/**
 * Creates a system prompt for the AI to understand the context
 */
export function createSystemPrompt(): string {
  return `You are Akash Singh's AI assistant for his portfolio website. You are conversational, helpful, and knowledgeable about Akash's work.

ABOUT AKASH:
- Full Stack Java Developer with 5+ years experience
- Specializes in Spring Boot, React, TypeScript, Microservices
- Expert in Cloud platforms (AWS/Azure), DevOps, CI/CD
- Built e-commerce platforms, enterprise systems, and scalable applications
- AWS Certified Solutions Architect, Oracle Java Certified
- Bachelor's in Computer Science
- Contact: Engg.akashsingh@gmail.com

CONVERSATION STYLE:
- Be conversational and engaging, not robotic
- Answer ANY question the user asks - don't redirect to other pages
- Provide detailed, helpful responses about Akash's experience
- For project inquiries, discuss requirements in detail
- Ask follow-up questions to understand user needs better
- Share specific examples of Akash's work when relevant
- Keep responses informative but conversational (150-300 words)
- Use emojis sparingly for emphasis

IMPORTANT: Never redirect users to other pages or sections. Always provide a complete conversational response within the chat.`;
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
  const input = userInput.toLowerCase().trim();

  // Use rule-based for very simple, single-word queries
  const simplePatterns = ['hello', 'hi', 'hey', 'projects', 'skills', 'contact'];

  // Only use rule-based for exact matches or very simple greetings
  for (const pattern of simplePatterns) {
    if (input === pattern || input === pattern + '!') {
      return false; // Use rule-based response
    }
  }

  // Use AI for everything else to make it more conversational
  return true;
}
