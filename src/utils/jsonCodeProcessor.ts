// Utility to process JSON responses and properly format code blocks
export const processJSONCodeResponse = (content: string[]): string[] => {
  return content.map(paragraph => {
    // Check if this paragraph contains a code block
    if (paragraph.includes('```')) {
      return unescapeJSONCodeBlock(paragraph);
    }

    // Check if this paragraph is likely a JSON-escaped code block
    if (isJSONEscapedCode(paragraph)) {
      return convertJSONToCodeBlock(paragraph);
    }

    // Regular paragraph - just unescape basic characters
    return unescapeBasicJSON(paragraph);
  });
};

/**
 * Check if a paragraph contains JSON-escaped code
 */
const isJSONEscapedCode = (text: string): boolean => {
  // Look for patterns that suggest JSON-escaped code
  const codeIndicators = [
    /\\n.*{.*\\n/,  // Contains newlines and braces
    /\\n.*function.*\\n/, // Contains function declarations
    /\\n.*const.*=.*\\n/, // Contains variable declarations
    /\\n.*class.*{.*\\n/, // Contains class definitions
    /\\n.*import.*from.*\\n/, // Contains import statements
    /\\n.*def.*:.*\\n/, // Contains Python function definitions
    /\\n.*public.*class.*\\n/, // Contains Java class definitions
  ];

  return codeIndicators.some(pattern => pattern.test(text));
};

/**
 * Convert JSON-escaped text to proper code block
 */
const convertJSONToCodeBlock = (text: string): string => {
  // Try to detect language from content
  const language = detectLanguageFromContent(text);

  // Unescape the JSON
  let unescaped = unescapeJSONCodeBlock(text);

  // If it doesn't already have code block markers, add them
  if (!unescaped.includes('```')) {
    // Split into lines and clean up
    const lines = unescaped.split('\n').map(line => line.trim()).filter(line => line);

    // Check if this looks like code
    if (lines.some(line => /[{}();=]/.test(line) || /^(const|let|var|function|class|def|import|from)/.test(line))) {
      unescaped = `\`\`\`${language}\n${lines.join('\n')}\n\`\`\``;
    }
  }

  return unescaped;
};

/**
 * Unescape JSON characters in code blocks
 */
const unescapeJSONCodeBlock = (text: string): string => {
  let unescaped = text;

  // Unescape common JSON characters
  unescaped = unescaped.replace(/\\n/g, '\n');
  unescaped = unescaped.replace(/\\"/g, '"');
  unescaped = unescaped.replace(/\\'/g, "'");
  unescaped = unescaped.replace(/\\\\/g, '\\');
  unescaped = unescaped.replace(/\\t/g, '\t');
  unescaped = unescaped.replace(/\\r/g, '\r');

  return unescaped;
};

/**
 * Unescape basic JSON characters for regular text
 */
const unescapeBasicJSON = (text: string): string => {
  let unescaped = text;

  // Only unescape quotes and backslashes for regular text
  unescaped = unescaped.replace(/\\"/g, '"');
  unescaped = unescaped.replace(/\\'/g, "'");
  unescaped = unescaped.replace(/\\\\/g, '\\');

  return unescaped;
};

/**
 * Detect programming language from content
 */
const detectLanguageFromContent = (content: string): string => {
  const lower = content.toLowerCase();

  // JavaScript/TypeScript patterns
  if (/\b(const|let|var|function|class|import.*from|export|=>)\b/.test(lower)) {
    if (/\b(interface|type|enum|public|private|protected)\b/.test(lower)) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Python patterns
  if (/\b(def|class|import|from|if __name__|print\(|range\()\b/.test(lower)) {
    return 'python';
  }

  // Java patterns
  if (/\b(public class|private|protected|package|system\.out)\b/.test(lower)) {
    return 'java';
  }

  // C# patterns
  if (/\b(using|namespace|public class|private|protected|internal)\b/.test(lower)) {
    return 'csharp';
  }

  // CSS patterns
  if (/[.#][a-z-]+\s*{|@media|@import/.test(lower)) {
    return 'css';
  }

  // HTML patterns
  if (/<[a-z]+[^>]*>|<!doctype/i.test(content)) {
    return 'html';
  }

  // SQL patterns
  if (/\b(select|insert|update|delete|create|alter|drop)\b/.test(lower)) {
    return 'sql';
  }

  // JSON patterns
  if (/^\s*[{\[]/.test(content) && /[}\]]\s*$/.test(content)) {
    return 'json';
  }

  // Default to no language specification
  return '';
};

/**
 * Clean up malformed code blocks in existing content
 */
export const cleanMalformedCodeBlocks = (content: string[]): string[] => {
  return content.map(paragraph => {
    let cleaned = paragraph;

    // Remove duplicate code block markers
    cleaned = cleaned.replace(/```(\w+)?\s*```(\w+)?/g, '```$1$2');

    // Remove duplicate language labels
    cleaned = cleaned.replace(/(\w+)\s+\1/g, '$1');

    // Fix escaped characters that shouldn't be escaped
    cleaned = unescapeJSONCodeBlock(cleaned);

    // Clean up duplicate lines
    const lines = cleaned.split('\n');
    const uniqueLines: string[] = [];
    let previousLine = '';

    for (const line of lines) {
      // Skip duplicate lines in code blocks
      if (line === previousLine && line.trim() !== '' && /[{}();=]/.test(line)) {
        continue;
      }
      uniqueLines.push(line);
      previousLine = line;
    }

    return uniqueLines.join('\n');
  });
};

/**
 * Process AI response to ensure proper code formatting
 */
export const processAIResponse = (response: any): any => {
  if (response.content && Array.isArray(response.content)) {
    return {
      ...response,
      content: processJSONCodeResponse(response.content)
    };
  }

  return response;
};

/**
 * Validate and fix code block structure
 */
export const validateCodeBlocks = (text: string): string => {
  const lines = text.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;


  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true;
        result.push(line);
      } else {
        // Ending a code block
        inCodeBlock = false;
        result.push('```');
      }
    } else {
      result.push(line);
    }
  }

  // If we're still in a code block at the end, close it
  if (inCodeBlock) {
    result.push('```');
  }

  return result.join('\n');
};
