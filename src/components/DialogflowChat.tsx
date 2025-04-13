
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useDialogflow } from "@/context/DialogflowContext";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const DialogflowChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm the portfolio assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sessionId, isInitialized } = useDialogflow();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus the input field when the chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateId = () => `msg_${Math.random().toString(36).substring(2, 9)}`;

  // Simulate sending a message to Dialogflow and getting a response
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate API delay
    setTimeout(() => {
      // This would be replaced with a real API call to Dialogflow
      const botResponses = [
        "I'd be happy to tell you more about my developer skills!",
        "You can check out my projects section for examples of my work.",
        "Feel free to contact me through the form on this page.",
        "I'm experienced in Java, React, and full-stack development.",
        "Let me know if you have any other questions!"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: generateId(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="sm:max-w-[400px] h-[550px] sm:h-[550px] p-0 sm:right-4 sm:left-auto sm:bottom-4 sm:top-auto fixed rounded-t-lg sm:rounded-lg shadow-lg border border-border">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-medium text-lg">Portfolio Assistant</h3>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close chat">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex max-w-[80%] mb-2",
                  message.isUser ? "ml-auto justify-end" : ""
                )}
              >
                <div 
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    message.isUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form 
            onSubmit={handleSendMessage}
            className="border-t p-3 flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DialogflowChat;
