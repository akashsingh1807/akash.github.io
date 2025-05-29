// Enhanced chat message component supporting buttons and rich content

import React from 'react';
import { ChatMessage as ChatMessageType, ChatLink } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Globe, Mail, User } from 'lucide-react';
import QuickReplyButtons from './QuickReplyButtons';

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReply: (buttonValue: string) => void;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onQuickReply,
  className
}) => {
  const isUser = message.role === 'user';

  const getLinkIcon = (link: ChatLink) => {
    switch (link.type) {
      case 'github':
        return <Github className="h-2.5 w-2.5" />;
      case 'demo':
        return <Globe className="h-2.5 w-2.5" />;
      case 'contact':
        return <Mail className="h-2.5 w-2.5" />;
      case 'portfolio':
        return <User className="h-2.5 w-2.5" />;
      default:
        return <ExternalLink className="h-2.5 w-2.5" />;
    }
  };

  const handleLinkClick = (url: string) => {
    if (url.startsWith('#')) {
      // Internal anchor link
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // External link
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={cn(
        "flex max-w-[85%] mb-4",
        isUser ? "ml-auto justify-end" : "justify-start",
        className
      )}
    >
      <div className="flex flex-col">
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm shadow-sm"
          )}
        >
          {/* Message content */}
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Links section */}
          {message.metadata?.links && message.metadata.links.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.metadata.links.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLinkClick(link.url)}
                  className={cn(
                    "w-full justify-start h-auto p-2 text-left",
                    isUser
                      ? "hover:bg-primary-foreground/10 text-primary-foreground"
                      : "hover:bg-muted-foreground/10"
                  )}
                >
                  <div className="flex items-start gap-2 w-full">
                    {getLinkIcon(link)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">
                        {link.title}
                      </div>
                      {link.description && (
                        <div className={cn(
                          "text-xs mt-0.5 opacity-80",
                          isUser ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {link.description}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60 flex-shrink-0" />
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Quick reply buttons */}
        {!isUser && message.metadata?.buttons && (
          <QuickReplyButtons
            buttons={message.metadata.buttons}
            onButtonClick={onQuickReply}
            className="mt-2"
          />
        )}

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground mt-1 px-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
