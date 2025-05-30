/**
 * Code formatting utilities for blog posts and content
 * Provides intelligent code detection and formatting with proper TypeScript types
 */

import { CodeDetectionResult } from '@/types/common';
import { logger } from '@/utils/logger';

/**
 * Language detection patterns for code formatting
 */
interface LanguagePattern {
  name: string;
  patterns: RegExp[];
  weight: number;
}

/**
 * Code extraction result
 */
interface CodeExtractionResult {
  code: string[];
  endIndex: number;
  confidence: number;
}

/**
 * Text analysis indicators
 */
interface TextIndicators {
  textPatterns: RegExp[];
  codePatterns: RegExp[];
  punctuationPatterns: RegExp[];
}

/**
 * Main function to detect and format code content in blog posts
 * @param text - The input text to analyze and format
 * @returns Formatted text with proper code blocks
 */
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
    if (!line) {
      i++;
      continue;
    }
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

/**
 * Language detection patterns with weights for accuracy
 */
const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    name: 'typescript',
    patterns: [
      /\b(interface|type|enum|public|private|protected)\b/,
      /:\s*(string|number|boolean|object|any|void|Promise)/,
      /\bas\s+\w+/,
    ],
    weight: 3,
  },
  {
    name: 'javascript',
    patterns: [
      /\b(const|let|var|function|class|import.*from|export|=>)\b/,
      /\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/,
      /=>\s*[{(]/,
    ],
    weight: 2,
  },
  {
    name: 'python',
    patterns: [
      /\b(def|class|import|from|if __name__|print\(|range\()\b/,
      /^[\s]*(def|class|if|for|while|try|except|import|from)\s+/,
      /^@[a-zA-Z_]/,
    ],
    weight: 2,
  },
  {
    name: 'java',
    patterns: [
      /\b(public class|private|protected|package|system\.out)\b/,
      /package\s+[a-zA-Z.]+;/,
      /public\s+static\s+void\s+main/,
    ],
    weight: 2,
  },
];

/**
 * Text analysis patterns
 */
const TEXT_INDICATORS: TextIndicators = {
  textPatterns: [
    /^(the|this|that|and|but|or|so|if|when|where|how|why|what|who|which|a|an|in|on|at|to|for|with|by|from|up|about|into|through|during|before|after|above|below|between|among|under|over|inside|outside|here|there|now|then|today|tomorrow|yesterday)\s+/i,
  ],
  codePatterns: [
    /^(import|from)\s+/,
    /^(const|let|var|def|function|class)\s+/,
    /^(if|for|while|try|catch|return|else)\s*[\(\{]/,
    /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*[{;]$/,
    /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*[=:]\s*.+[;]$/,
    /^[\s]*[{[].*[}\]][,;]$/,
    /^(\/\/|#|\*)/,
    /^[\s]*[{}()[\]]+[\s]*$/,
    /\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/,
    /=>\s*[{(]/,
    /:\s*(string|number|boolean|object|any|void|Promise)/,
    /^[\s]*(def|class|if|for|while|try|except|import|from)\s+/,
    /^@[a-zA-Z_]/,
    /<[A-Z][a-zA-Z0-9]*[^>]*>/,
    /[=;{}()[\]]{2,}/,
  ],
  punctuationPatterns: [
    /[.!?]$/,
  ],
};

/**
 * Check if a line looks like code based on patterns and heuristics
 * @param line - The line to analyze
 * @returns True if the line appears to be code
 */
const isCodeLine = (line: string): boolean => {
  const trimmed = line.trim();

  // Empty lines are not code
  if (!trimmed) return false;

  // Skip lines that are clearly text (common English words)
  if (TEXT_INDICATORS.textPatterns.some(pattern => pattern.test(trimmed))) {
    return false;
  }

  // Skip lines that end with common punctuation (likely prose)
  if (TEXT_INDICATORS.punctuationPatterns.some(pattern => pattern.test(trimmed)) &&
      !/[;{}()]/.test(trimmed)) {
    return false;
  }

  // Must match at least one pattern and have some code-like characteristics
  const hasCodePattern = TEXT_INDICATORS.codePatterns.some(pattern => pattern.test(trimmed));
  const hasCodeChars = /[{}();=[\]<>]/.test(trimmed);

  return hasCodePattern && hasCodeChars;
};

/**
 * Extract a complete code block starting from a given line
 * @param lines - Array of text lines
 * @param startIndex - Starting line index
 * @returns Code extraction result with confidence score
 */
const extractCodeBlock = (lines: string[], startIndex: number): CodeExtractionResult => {
  const codeLines: string[] = [];
  let i = startIndex;
  let consecutiveEmptyLines = 0;
  let consecutiveNonCodeLines = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
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
  while (codeLines.length > 0) {
    const lastLineIndex = codeLines.length - 1;
    const lastLine = codeLines[lastLineIndex];
    if (!lastLine || !lastLine.trim()) {
      codeLines.pop();
    } else {
      break;
    }
  }

  // Calculate confidence based on code patterns found
  const totalLines = codeLines.length;
  const codeLineCount = codeLines.filter(line => isCodeLine(line.trim())).length;
  const confidence = totalLines > 0 ? codeLineCount / totalLines : 0;

  return {
    code: codeLines,
    endIndex: i,
    confidence,
  };
};

/**
 * Check if a line is a continuation of a code block
 * @param line - The line to check
 * @param previousLines - Previous lines in the code block
 * @returns True if the line continues the code block
 */
const isCodeContinuation = (line: string, previousLines: string[]): boolean => {
  const trimmed = line.trim();

  // If we have previous code lines, check for common continuation patterns
  if (previousLines.length > 0) {
    const lastLineIndex = previousLines.length - 1;
    const lastLine = previousLines[lastLineIndex];
    if (!lastLine) return false;
    const trimmedLastLine = lastLine.trim();

    // Closing brackets/braces
    if (/^[}\])];?$/.test(trimmed)) return true;

    // Indented lines (likely part of a block)
    if (line.startsWith('  ') || line.startsWith('\t')) return true;

    // Chain calls
    if (trimmed.startsWith('.')) return true;

    // Continuation of multi-line statements
    if (trimmedLastLine.endsWith(',') || trimmedLastLine.endsWith('{') || trimmedLastLine.endsWith('[')) return true;
  }

  return false;
};

/**
 * Detect programming language from code content using weighted patterns
 * @param codeLines - Array of code lines to analyze
 * @returns Detected language or empty string if uncertain
 */
const detectLanguage = (codeLines: string[]): string => {
  const code = codeLines.join('\n').toLowerCase();
  const scores: Record<string, number> = {};

  // Score each language pattern
  LANGUAGE_PATTERNS.forEach(({ name, patterns, weight }) => {
    const matches = patterns.filter(pattern => pattern.test(code)).length;
    scores[name] = matches * weight;
  });

  // Additional language patterns not in main list
  const additionalPatterns = [
    { name: 'css', pattern: /[.#][a-z-]+\s*{|@media|@import/, weight: 2 },
    { name: 'html', pattern: /<[a-z]+[^>]*>|<!doctype/i, weight: 2 },
    { name: 'sql', pattern: /\b(select|insert|update|delete|create|alter|drop)\b/, weight: 2 },
    { name: 'json', pattern: /^\s*[{\[].*[}\]]\s*$/s, weight: 1 },
  ];

  additionalPatterns.forEach(({ name, pattern, weight }) => {
    if (pattern.test(code)) {
      scores[name] = (scores[name] || 0) + weight;
    }
  });

  // Find the highest scoring language
  const bestMatch = Object.entries(scores).reduce(
    (best, [lang, score]) => (score > best.score ? { lang, score } : best),
    { lang: '', score: 0 }
  );

  // Only return language if confidence is high enough
  return bestMatch.score >= 2 ? bestMatch.lang : '';
};

/**
 * Format a blog post content array by detecting and wrapping code
 * @param contentArray - Array of content paragraphs
 * @returns Formatted content array with proper code blocks
 */
export const formatBlogPostContent = (contentArray: string[]): string[] => {
  try {
    return contentArray.map(paragraph => {
      // Skip if already has code blocks
      if (paragraph.includes('```')) {
        return paragraph;
      }

      // Apply code detection and formatting
      return detectAndFormatCode(paragraph);
    });
  } catch (error) {
    logger.error('Error formatting blog post content', error, 'codeFormatter');
    return contentArray; // Return original content on error
  }
};

/**
 * Fix existing malformed blog posts with proper typing
 * @param posts - Array of blog posts to fix
 * @returns Fixed blog posts with proper code formatting
 */
export const fixCodeFormattingInPosts = <T extends { content?: string[] }>(posts: T[]): T[] => {
  try {
    return posts.map(post => {
      if (post.content && Array.isArray(post.content)) {
        return {
          ...post,
          content: formatBlogPostContent(post.content),
        };
      }
      return post;
    });
  } catch (error) {
    logger.error('Error fixing code formatting in posts', error, 'codeFormatter');
    return posts; // Return original posts on error
  }
};

/**
 * Analyze code content and return detection results
 * @param text - Text to analyze
 * @returns Code detection result with confidence score
 */
export const analyzeCodeContent = (text: string): CodeDetectionResult => {
  const lines = text.split('\n');
  const codeLines = lines.filter(line => isCodeLine(line.trim()));
  const confidence = lines.length > 0 ? codeLines.length / lines.length : 0;
  const language = confidence > 0.5 ? detectLanguage(lines) : '';

  return {
    isCode: confidence > 0.3,
    language,
    confidence,
  };
};
