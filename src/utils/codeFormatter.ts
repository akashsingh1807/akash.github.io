// Utility to detect and format code content in blog posts
export const detectAndFormatCode = (text: string): string => {
  // First, check if the text already has code blocks - if so, don't process it
  if (text.includes('```')) {
    return text;
  }

  // Split text into lines for analysis
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if this line starts a code block
    if (isCodeLine(trimmedLine)) {
      const codeBlock = extractCodeBlock(lines, i);
      const language = detectLanguage(codeBlock.code);

      // Only create code block if we have substantial code content
      if (codeBlock.code.length > 0 && codeBlock.code.some(line => line.trim().length > 0)) {
        // Add the code block with proper formatting
        result.push('');
        result.push(`\`\`\`${language}`);
        result.push(...codeBlock.code);
        result.push('```');
        result.push('');
      } else {
        // Not enough code content, treat as regular text
        result.push(...codeBlock.code);
      }

      i = codeBlock.endIndex;
    } else {
      // Regular text line
      result.push(line);
      i++;
    }
  }

  return result.join('\n');
};

// Check if a line looks like code
const isCodeLine = (line: string): boolean => {
  const trimmed = line.trim();

  // Empty lines are not code
  if (!trimmed) return false;

  // Skip lines that are clearly text (common English words)
  const textIndicators = /^(the|this|that|and|but|or|so|if|when|where|how|why|what|who|which|a|an|in|on|at|to|for|with|by|from|up|about|into|through|during|before|after|above|below|between|among|under|over|inside|outside|here|there|now|then|today|tomorrow|yesterday)\s+/i;
  if (textIndicators.test(trimmed)) return false;

  // Skip lines that end with common punctuation (likely prose)
  if (/[.!?]$/.test(trimmed) && !/[;{}()]/.test(trimmed)) return false;

  // Common code patterns
  const codePatterns = [
    // Import statements
    /^(import|from)\s+/,
    // Variable declarations
    /^(const|let|var|def|function|class)\s+/,
    // Control structures
    /^(if|for|while|try|catch|return|else)\s*[\(\{]/,
    // Function calls with parentheses and semicolons
    /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*[{;]$/,
    // Assignment operations with semicolons
    /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*[=:]\s*.+[;]$/,
    // Object/array literals with proper syntax
    /^[\s]*[{[].*[}\]][,;]$/,
    // Comments
    /^(\/\/|#|\*)/,
    // Brackets and braces only
    /^[\s]*[{}()[\]]+[\s]*$/,
    // Method calls with dots
    /\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/,
    // Arrow functions
    /=>\s*[{(]/,
    // Type annotations (TypeScript)
    /:\s*(string|number|boolean|object|any|void|Promise)/,
    // Python specific
    /^[\s]*(def|class|if|for|while|try|except|import|from)\s+/,
    // Decorators
    /^@[a-zA-Z_]/,
    // JSX elements
    /<[A-Z][a-zA-Z0-9]*[^>]*>/,
    // Multiple operators or special characters
    /[=;{}()[\]]{2,}/
  ];

  // Must match at least one pattern and have some code-like characteristics
  const hasCodePattern = codePatterns.some(pattern => pattern.test(trimmed));
  const hasCodeChars = /[{}();=[\]<>]/.test(trimmed);

  return hasCodePattern && hasCodeChars;
};

// Extract a complete code block starting from a given line
const extractCodeBlock = (lines: string[], startIndex: number): { code: string[]; endIndex: number } => {
  const codeLines: string[] = [];
  let i = startIndex;
  let consecutiveEmptyLines = 0;
  let consecutiveNonCodeLines = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      // Empty line - allow up to 1 consecutive empty line in code blocks
      consecutiveEmptyLines++;
      if (consecutiveEmptyLines <= 1) {
        codeLines.push(line);
        i++;
        continue;
      } else {
        // Too many empty lines, end the code block
        break;
      }
    } else {
      consecutiveEmptyLines = 0;
    }

    // Check if this line is still part of the code block
    if (isCodeLine(trimmedLine) || isCodeContinuation(trimmedLine, codeLines)) {
      codeLines.push(line);
      consecutiveNonCodeLines = 0;
      i++;
    } else {
      // This line doesn't look like code
      consecutiveNonCodeLines++;

      // Allow 1 non-code line in case it's a comment or explanation within code
      if (consecutiveNonCodeLines <= 1 && codeLines.length > 0) {
        codeLines.push(line);
        i++;
      } else {
        // End the code block
        break;
      }
    }
  }

  // Remove trailing empty lines
  while (codeLines.length > 0 && !codeLines[codeLines.length - 1].trim()) {
    codeLines.pop();
  }

  return {
    code: codeLines,
    endIndex: i
  };
};

// Check if a line is a continuation of a code block
const isCodeContinuation = (line: string, previousLines: string[]): boolean => {
  const trimmed = line.trim();

  // If we have previous code lines, check for common continuation patterns
  if (previousLines.length > 0) {
    const lastLine = previousLines[previousLines.length - 1]?.trim() || '';

    // Closing brackets/braces
    if (/^[}\])];?$/.test(trimmed)) return true;

    // Indented lines (likely part of a block)
    if (line.startsWith('  ') || line.startsWith('\t')) return true;

    // Chain calls
    if (trimmed.startsWith('.')) return true;

    // Continuation of multi-line statements
    if (lastLine.endsWith(',') || lastLine.endsWith('{') || lastLine.endsWith('[')) return true;
  }

  return false;
};

// Detect programming language from code content
const detectLanguage = (codeLines: string[]): string => {
  const code = codeLines.join('\n').toLowerCase();

  // JavaScript/TypeScript patterns
  if (/\b(const|let|var|function|class|import.*from|export|=>)\b/.test(code)) {
    if (/\b(interface|type|enum|public|private|protected)\b/.test(code)) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Python patterns
  if (/\b(def|class|import|from|if __name__|print\(|range\()\b/.test(code)) {
    return 'python';
  }

  // Java patterns
  if (/\b(public class|private|protected|package|system\.out)\b/.test(code)) {
    return 'java';
  }

  // CSS patterns
  if (/[.#][a-z-]+\s*{|@media|@import/.test(code)) {
    return 'css';
  }

  // HTML patterns
  if (/<[a-z]+[^>]*>|<!doctype/i.test(code)) {
    return 'html';
  }

  // SQL patterns
  if (/\b(select|insert|update|delete|create|alter|drop)\b/.test(code)) {
    return 'sql';
  }

  // JSON patterns
  if (/^\s*[{\[]/.test(code) && /[}\]]\s*$/.test(code)) {
    return 'json';
  }

  // Default to no language specification
  return '';
};

// Format a blog post content array by detecting and wrapping code
export const formatBlogPostContent = (contentArray: string[]): string[] => {
  return contentArray.map(paragraph => {
    // Skip if already has code blocks
    if (paragraph.includes('```')) {
      return paragraph;
    }

    // Apply code detection and formatting
    return detectAndFormatCode(paragraph);
  });
};

// Fix existing malformed blog posts
export const fixCodeFormattingInPosts = (posts: any[]): any[] => {
  return posts.map(post => {
    if (post.content && Array.isArray(post.content)) {
      return {
        ...post,
        content: formatBlogPostContent(post.content)
      };
    }
    return post;
  });
};
