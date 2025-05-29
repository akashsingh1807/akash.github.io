// Tests for chatbot utility functions

import { 
  analyzeIntent, 
  generateResponse, 
  handleQuickReply, 
  createWelcomeMessage,
  sanitizeUserInput,
  shouldUseAI
} from '../chatbot';
import { MAIN_MENU_OPTIONS } from '../../types/chat';

describe('Chatbot Utilities', () => {
  describe('analyzeIntent', () => {
    it('should recognize greeting intent', () => {
      const intent = analyzeIntent('hello');
      expect(intent?.name).toBe('greeting');
    });

    it('should recognize projects intent', () => {
      const intent = analyzeIntent('show me your projects');
      expect(intent?.name).toBe('projects');
    });

    it('should recognize skills intent', () => {
      const intent = analyzeIntent('what are your skills');
      expect(intent?.name).toBe('skills');
    });

    it('should return null for unrecognized input', () => {
      const intent = analyzeIntent('random gibberish xyz123');
      expect(intent).toBeNull();
    });
  });

  describe('generateResponse', () => {
    it('should generate greeting response with buttons', () => {
      const response = generateResponse('hello');
      expect(response.content).toContain('Hello!');
      expect(response.buttons).toEqual(MAIN_MENU_OPTIONS);
    });

    it('should generate projects response with links', () => {
      const response = generateResponse('projects');
      expect(response.content).toContain('featured projects');
      expect(response.links).toBeDefined();
      expect(response.links?.length).toBeGreaterThan(0);
    });

    it('should generate fallback response for unknown input', () => {
      const response = generateResponse('unknown query');
      expect(response.content).toContain("I'm not sure I understand");
      expect(response.buttons).toEqual(MAIN_MENU_OPTIONS);
    });
  });

  describe('handleQuickReply', () => {
    it('should handle show_projects button', () => {
      const response = handleQuickReply('show_projects');
      expect(response.content).toContain('featured projects');
      expect(response.links).toBeDefined();
    });

    it('should handle show_qualifications button', () => {
      const response = handleQuickReply('show_qualifications');
      expect(response.content).toContain('Full Stack Java Developer');
    });

    it('should handle unknown button value', () => {
      const response = handleQuickReply('unknown_button');
      expect(response.content).toContain('How can I help you today?');
      expect(response.buttons).toEqual(MAIN_MENU_OPTIONS);
    });
  });

  describe('createWelcomeMessage', () => {
    it('should create welcome message with correct structure', () => {
      const message = createWelcomeMessage();
      expect(message.role).toBe('assistant');
      expect(message.type).toBe('menu');
      expect(message.content).toContain('AI assistant');
      expect(message.metadata?.buttons).toEqual(MAIN_MENU_OPTIONS);
    });
  });

  describe('sanitizeUserInput', () => {
    it('should remove HTML tags', () => {
      const sanitized = sanitizeUserInput('<script>alert("test")</script>hello');
      expect(sanitized).toBe('scriptalert("test")/scripthello');
    });

    it('should trim whitespace', () => {
      const sanitized = sanitizeUserInput('  hello world  ');
      expect(sanitized).toBe('hello world');
    });

    it('should limit length to 500 characters', () => {
      const longInput = 'a'.repeat(600);
      const sanitized = sanitizeUserInput(longInput);
      expect(sanitized.length).toBe(500);
    });
  });

  describe('shouldUseAI', () => {
    it('should return false for simple greetings', () => {
      expect(shouldUseAI('hello')).toBe(false);
      expect(shouldUseAI('hi there')).toBe(false);
    });

    it('should return false for simple keywords', () => {
      expect(shouldUseAI('projects')).toBe(false);
      expect(shouldUseAI('skills')).toBe(false);
      expect(shouldUseAI('contact')).toBe(false);
    });

    it('should return true for complex queries', () => {
      expect(shouldUseAI('Can you tell me about your experience with microservices architecture?')).toBe(true);
    });

    it('should return true for questions', () => {
      expect(shouldUseAI('What is your experience?')).toBe(true);
    });
  });
});
