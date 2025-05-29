// Chat context for managing conversational chatbot state

import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ChatMessage, ChatContext as ChatContextType } from '@/types/chat';
import {
  generateResponse,
  handleQuickReply,
  createWelcomeMessage,
  generateMessageId,
  formatMessagesForAI,
  createSystemPrompt,
  sanitizeUserInput,
  shouldUseAI
} from '@/utils/chatbot';

interface ChatProviderProps {
  children: React.ReactNode;
}

interface ChatContextValue extends ChatContextType {
  sendMessage: (content: string) => Promise<void>;
  sendQuickReply: (buttonValue: string) => Promise<void>;
  clearChat: () => void;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  /**
   * Adds a message to the chat
   */
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Generates AI response using AI21 Studio with multiple fallbacks
   */
  const generateAIResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    try {
      // Try AI21 Studio first (Primary)
      return await generateAI21Response(userMessage, conversationHistory);
    } catch (error) {
      console.error('AI21 Studio error:', error);

      // Fallback to OpenAI if available
      try {
        return await generateOpenAIResponse(userMessage, conversationHistory);
      } catch (openaiError) {
        console.error('OpenAI fallback failed:', openaiError);

        // Final fallback to OpenRouter
        try {
          return await generateOpenRouterResponse(userMessage, conversationHistory);
        } catch (fallbackError) {
          console.error('All AI providers failed:', fallbackError);
          throw new Error('Failed to generate AI response');
        }
      }
    }
  };

  /**
   * Primary AI response using AI21 Studio Jamba model
   */
  const generateAI21Response = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    const ai21ApiKey = import.meta.env.VITE_AI21_API_KEY || process.env.AI21_API_KEY;

    if (!ai21ApiKey) {
      throw new Error('AI21 API key not configured');
    }

    const systemPrompt = createSystemPrompt();
    const formattedMessages = formatMessagesForAI(conversationHistory);

    const response = await fetch('https://api.ai21.com/studio/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ai21ApiKey}`
      },
      body: JSON.stringify({
        model: 'jamba-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('AI21 Studio API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I cannot generate a response right now.';
  };

  /**
   * Fallback AI response using OpenAI via Vercel AI SDK
   */
  const generateOpenAIResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!openaiApiKey || openaiApiKey === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = createSystemPrompt();
    const formattedMessages = formatMessagesForAI(conversationHistory);

    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: [
        ...formattedMessages,
        { role: 'user' as const, content: userMessage }
      ],
      maxTokens: 150,
      temperature: 0.7,
    });

    return text;
  };

  /**
   * Fallback AI response using OpenRouter API
   */
  const generateOpenRouterResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<string> => {
    const openrouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      throw new Error('No AI API keys configured');
    }

    const systemPrompt = createSystemPrompt();
    const formattedMessages = formatMessagesForAI(conversationHistory);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterApiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Akash Singh Portfolio'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('OpenRouter API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I cannot generate a response right now.';
  };

  /**
   * Sends a text message and generates response
   */
  const sendMessage = useCallback(async (content: string) => {
    const sanitizedContent = sanitizeUserInput(content);
    if (!sanitizedContent.trim()) return;

    setError(null);
    setIsLoading(true);
    setIsTyping(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: sanitizedContent,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    addMessage(userMessage);

    try {
      let responseData;

      // Determine whether to use AI or rule-based response
      if (shouldUseAI(sanitizedContent)) {
        // Use AI for complex queries
        const aiResponse = await generateAIResponse(sanitizedContent, messages);
        responseData = {
          content: aiResponse,
          buttons: undefined,
          links: undefined
        };
      } else {
        // Use rule-based response for simple queries
        responseData = generateResponse(sanitizedContent);
      }

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        content: responseData.content,
        role: 'assistant',
        timestamp: new Date(),
        type: responseData.buttons ? 'menu' : 'text',
        metadata: {
          buttons: responseData.buttons,
          links: responseData.links
        }
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback to rule-based response on AI failure
      const fallbackResponse = generateResponse(sanitizedContent);

      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        content: fallbackResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        type: 'menu',
        metadata: {
          buttons: fallbackResponse.buttons
        }
      };

      addMessage(errorMessage);
      setError('AI service temporarily unavailable. Using fallback responses.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages, addMessage]);

  /**
   * Handles quick reply button clicks
   */
  const sendQuickReply = useCallback(async (buttonValue: string) => {
    setError(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const responseData = handleQuickReply(buttonValue);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        content: responseData.content,
        role: 'assistant',
        timestamp: new Date(),
        type: responseData.buttons ? 'menu' : 'text',
        metadata: {
          buttons: responseData.buttons,
          links: responseData.links
        }
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error handling quick reply:', error);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [addMessage]);

  /**
   * Clears the chat and resets to welcome message
   */
  const clearChat = useCallback(() => {
    setMessages([createWelcomeMessage()]);
    setError(null);
    setIsLoading(false);
    setIsTyping(false);
  }, []);

  const value: ChatContextValue = {
    messages,
    isLoading,
    isTyping,
    error,
    sessionId,
    sendMessage,
    sendQuickReply,
    clearChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Hook to use the chat context
 */
export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
