// Main conversational chatbot component

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useChat } from "@/context/ChatContext";
import { cn } from '@/lib/utils';
import ChatMessage from './ChatMessage';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConversationalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    sendQuickReply,
    clearChat
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus the input field when the chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim() || isLoading) return;

    const messageToSend = input.trim();
    setInput("");

    await sendMessage(messageToSend);
  };

  const handleQuickReply = async (buttonValue: string) => {
    if (isLoading) return;
    await sendQuickReply(buttonValue);
  };

  const handleClearChat = () => {
    clearChat();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50 border-0"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="sm:max-w-[420px] h-[600px] sm:h-[600px] p-0 sm:right-4 sm:left-auto sm:bottom-4 sm:top-auto fixed rounded-t-lg sm:rounded-lg shadow-xl border border-border"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="flex-row justify-between items-center p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-base font-semibold">
                  AI Assistant
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Powered by AI21 Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8"
                aria-label="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Error Alert */}
          {error && (
            <Alert className="mx-4 mt-2 border-amber-200 bg-amber-50">
              <AlertDescription className="text-sm text-amber-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onQuickReply={handleQuickReply}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted rounded-lg px-4 py-3 rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 bg-background"
          >
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about projects, skills, or requirements..."
                className="flex-1"
                disabled={isLoading}
                maxLength={500}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Character count */}
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {input.length}/500
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConversationalChatbot;
