
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const DialogflowChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! I'm Akash's virtual assistant. How can I help you?", isUser: false, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = { text: inputText, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // TODO: Integrate with Dialogflow API
    // For now, just simulate a response
    setTimeout(() => {
      // Simple responses for demonstration
      let botResponse = "I'm sorry, I don't have that information yet. As Akash continues to develop me, I'll be able to help with more specific questions.";
      
      const lowerCaseInput = inputText.toLowerCase();
      if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        botResponse = "Hello! How can I help you with information about Akash?";
      } else if (lowerCaseInput.includes('experience') || lowerCaseInput.includes('work')) {
        botResponse = "Akash has worked with technologies like Java, Spring Boot, React, and more. He has experience in full-stack development across various industries.";
      } else if (lowerCaseInput.includes('project')) {
        botResponse = "Akash has worked on several projects including enterprise applications, web services, and UI development. You can check out the Projects section for more details.";
      } else if (lowerCaseInput.includes('contact') || lowerCaseInput.includes('email')) {
        botResponse = "You can contact Akash through the contact form in the Contact section, or directly via email at engg.akashsingh@gmail.com.";
      } else if (lowerCaseInput.includes('skill')) {
        botResponse = "Akash's skills include Java, Spring Boot, JavaScript, React, SQL, MongoDB, Docker, and many more. The Skills section has a detailed breakdown.";
      }
      
      const botMessage = { text: botResponse, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                aria-label="Open chat"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </motion.div>
        )}
      </AnimatePresence>
      
      <SheetContent 
        className="w-[90%] sm:w-[380px] p-0 rounded-t-lg border overflow-hidden" 
        side="bottom"
      >
        <div className="flex flex-col h-[500px] max-h-[80vh]">
          {/* Chat header */}
          <div className="p-3 border-b bg-muted/50 flex justify-between items-center">
            <h3 className="font-medium text-sm">Chat with Akash's Assistant</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon" 
              className="h-9 w-9"
              disabled={!inputText.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DialogflowChat;
