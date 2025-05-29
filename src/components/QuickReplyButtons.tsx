// Quick reply buttons component for predefined menu options

import React from 'react';
import { Button } from '@/components/ui/button';
import { QuickReplyButton } from '@/types/chat';
import { ExternalLink, Mail, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickReplyButtonsProps {
  buttons: QuickReplyButton[];
  onButtonClick: (buttonValue: string) => void;
  onLinkClick?: (url: string) => void;
  className?: string;
}

const QuickReplyButtons: React.FC<QuickReplyButtonsProps> = ({
  buttons,
  onButtonClick,
  onLinkClick,
  className
}) => {
  const getButtonIcon = (button: QuickReplyButton) => {
    if (button.icon) {
      return button.icon;
    }

    // Default icons based on action type
    switch (button.action) {
      case 'link':
        if (button.url?.includes('mailto:')) {
          return <Mail className="h-2.5 w-2.5" />;
        }
        return <ExternalLink className="h-2.5 w-2.5" />;
      case 'form':
        return <FileText className="h-2.5 w-2.5" />;
      default:
        return <MessageSquare className="h-2.5 w-2.5" />;
    }
  };

  const handleButtonClick = (button: QuickReplyButton) => {
    if (button.action === 'link' && button.url) {
      // Handle external links
      if (button.url.startsWith('#')) {
        // Internal anchor link
        const element = document.querySelector(button.url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // External link
        window.open(button.url, '_blank', 'noopener,noreferrer');
      }

      if (onLinkClick) {
        onLinkClick(button.url);
      }
    } else {
      // Handle message actions
      onButtonClick(button.value);
    }
  };

  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2 mt-3", className)}>
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant="outline"
          size="sm"
          onClick={() => handleButtonClick(button)}
          className="h-7 px-2 text-xs font-normal border-border hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-1">
            {getButtonIcon(button)}
            {button.label}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default QuickReplyButtons;
