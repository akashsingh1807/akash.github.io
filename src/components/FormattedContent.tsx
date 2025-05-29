// Component to render formatted content with markdown-style formatting
import React from 'react';

interface FormattedContentProps {
  content: string;
  className?: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({ content, className = '' }) => {
  // Function to parse and format markdown-style content
  const formatContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let partIndex = 0;

    // Regular expressions for different formatting
    const patterns = [
      // Code blocks with language (```language\ncode```)
      {
        regex: /```(\w+)?\s*([\s\S]*?)```/g,
        render: (match: string, language: string, code: string) => (
          <div key={`code-block-${partIndex++}`} className="my-6">
            {language && (
              <div className="bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground border border-b-0 rounded-t-lg">
                {language}
              </div>
            )}
            <pre className={`bg-muted p-4 overflow-x-auto text-sm border font-mono ${language ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}`}>
              <code className="text-foreground leading-relaxed">{code.trim()}</code>
            </pre>
          </div>
        )
      },
      // Simple code blocks (```code```)
      {
        regex: /```([\s\S]*?)```/g,
        render: (match: string, code: string) => (
          <pre key={`code-${partIndex++}`} className="bg-muted p-4 rounded-lg overflow-x-auto my-6 text-sm border font-mono">
            <code className="text-foreground leading-relaxed">{code.trim()}</code>
          </pre>
        )
      },
      // Inline code (`code`)
      {
        regex: /`([^`]+)`/g,
        render: (match: string, code: string) => (
          <code key={`inline-${partIndex++}`} className="bg-muted px-2 py-1 rounded-md text-sm font-mono border">
            {code}
          </code>
        )
      },
      // Bold text (**text**)
      {
        regex: /\*\*(.*?)\*\*/g,
        render: (match: string, text: string) => (
          <strong key={`bold-${partIndex++}`} className="font-semibold">
            {text}
          </strong>
        )
      },
      // Italic text (*text*)
      {
        regex: /\*(.*?)\*/g,
        render: (match: string, text: string) => (
          <em key={`italic-${partIndex++}`} className="italic">
            {text}
          </em>
        )
      },
      // Links [text](url)
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/g,
        render: (match: string, text: string, url: string) => (
          <a
            key={`link-${partIndex++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {text}
          </a>
        )
      },
      // Auto-detect code patterns (function calls, imports, etc.)
      {
        regex: /((?:import|from|const|let|var|function|class|def|public|private|protected)\s+[^.!?]*[;{}]?)/g,
        render: (match: string, code: string) => (
          <pre key={`auto-code-${partIndex++}`} className="bg-muted p-3 rounded-md overflow-x-auto my-3 text-sm border font-mono">
            <code className="text-foreground">{code.trim()}</code>
          </pre>
        )
      }
    ];

    // Process the text with all patterns
    let processedText = text;
    const replacements: Array<{ start: number; end: number; element: React.ReactNode }> = [];

    patterns.forEach(pattern => {
      let match;
      pattern.regex.lastIndex = 0; // Reset regex

      while ((match = pattern.regex.exec(text)) !== null) {
        const element = pattern.render(match[0], match[1], match[2]);
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element
        });
      }
    });

    // Sort replacements by start position
    replacements.sort((a, b) => a.start - b.start);

    // Build the final content array
    let lastEnd = 0;

    replacements.forEach(replacement => {
      // Add text before the replacement
      if (replacement.start > lastEnd) {
        const textBefore = text.slice(lastEnd, replacement.start);
        if (textBefore) {
          parts.push(textBefore);
        }
      }

      // Add the replacement element
      parts.push(replacement.element);
      lastEnd = replacement.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      const remainingText = text.slice(lastEnd);
      if (remainingText) {
        parts.push(remainingText);
      }
    }

    // If no replacements were made, return the original text
    if (parts.length === 0) {
      parts.push(text);
    }

    return parts;
  };

  // Handle line breaks and paragraphs
  const formatParagraphs = (text: string): React.ReactNode[] => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      const lines = paragraph.split('\n').filter(line => line.trim());

      return (
        <div key={`paragraph-${index}`} className="mb-6 last:mb-0">
          {lines.map((line, lineIndex) => (
            <div key={`line-${lineIndex}`} className={`leading-relaxed ${lineIndex > 0 ? 'mt-3' : ''}`}>
              {formatContent(line)}
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={`formatted-content prose prose-sm max-w-none ${className}`}>
      <div className="space-y-4">
        {formatParagraphs(content)}
      </div>
    </div>
  );
};

// Simple version for inline content (no paragraphs)
export const InlineFormattedContent: React.FC<FormattedContentProps> = ({ content, className = '' }) => {
  const formatInlineContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let partIndex = 0;

    // Simple patterns for inline formatting
    const inlinePatterns = [
      // Inline code (`code`)
      {
        regex: /`([^`]+)`/g,
        render: (match: string, code: string) => (
          <code key={`inline-${partIndex++}`} className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
            {code}
          </code>
        )
      },
      // Bold text (**text**)
      {
        regex: /\*\*(.*?)\*\*/g,
        render: (match: string, text: string) => (
          <strong key={`bold-${partIndex++}`} className="font-semibold">
            {text}
          </strong>
        )
      },
      // Italic text (*text*)
      {
        regex: /\*(.*?)\*/g,
        render: (match: string, text: string) => (
          <em key={`italic-${partIndex++}`} className="italic">
            {text}
          </em>
        )
      }
    ];

    let processedText = text;
    const replacements: Array<{ start: number; end: number; element: React.ReactNode }> = [];

    inlinePatterns.forEach(pattern => {
      let match;
      pattern.regex.lastIndex = 0;

      while ((match = pattern.regex.exec(text)) !== null) {
        const element = pattern.render(match[0], match[1]);
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          element
        });
      }
    });

    // Sort and build content
    replacements.sort((a, b) => a.start - b.start);
    let lastEnd = 0;

    replacements.forEach(replacement => {
      if (replacement.start > lastEnd) {
        const textBefore = text.slice(lastEnd, replacement.start);
        if (textBefore) {
          parts.push(textBefore);
        }
      }
      parts.push(replacement.element);
      lastEnd = replacement.end;
    });

    if (lastEnd < text.length) {
      const remainingText = text.slice(lastEnd);
      if (remainingText) {
        parts.push(remainingText);
      }
    }

    if (parts.length === 0) {
      parts.push(text);
    }

    return parts;
  };

  return (
    <span className={className}>
      {formatInlineContent(content)}
    </span>
  );
};
