// Intelligent code formatter that understands context and content types
export interface CodeBlock {
  content: string[];
  language: string;
  startIndex: number;
  endIndex: number;
}

export interface ContentSegment {
  type: 'text' | 'code';
  content: string[];
  language?: string;
}

export class IntelligentCodeFormatter {
  private readonly codeKeywords = {
    javascript: ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'return', '=>', 'useState', 'useEffect'],
    typescript: ['interface', 'type', 'enum', 'public', 'private', 'protected', 'readonly', 'Promise'],
    python: ['def', 'class', 'import', 'from', 'if __name__', 'print(', 'range(', 'len(', 'str('],
    java: ['public class', 'private', 'protected', 'package', 'System.out', 'new ', 'extends', 'implements'],
    css: ['{', '}', ':', ';', '@media', '@import', 'px', 'rem', 'em', '%'],
    html: ['<', '>', '</', 'DOCTYPE', 'html>', 'head>', 'body>', 'div>', 'span>'],
    sql: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'FROM', 'WHERE'],
    json: ['{', '}', '[', ']', ':', ',', '"']
  };

  private readonly textIndicators = [
    'the', 'this', 'that', 'and', 'but', 'or', 'so', 'when', 'where', 'how', 'why', 'what', 'who', 'which',
    'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'about', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'among', 'under', 'over', 'here', 'there',
    'provides', 'allows', 'enables', 'helps', 'makes', 'creates', 'builds', 'develops', 'implements'
  ];

  /**
   * Main function to intelligently format content
   */
  formatContent(text: string): string {
    // Skip if already has code blocks
    if (text.includes('```')) {
      return this.cleanExistingCodeBlocks(text);
    }

    const segments = this.analyzeContent(text);
    return this.reconstructContent(segments);
  }

  /**
   * Analyze content and segment into text and code parts
   */
  private analyzeContent(text: string): ContentSegment[] {
    const lines = text.split('\n');
    const segments: ContentSegment[] = [];
    let currentSegment: ContentSegment | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineType = this.classifyLine(line, lines, i);

      if (!currentSegment || currentSegment.type !== lineType.type) {
        // Start new segment
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = {
          type: lineType.type,
          content: [line],
          language: lineType.language
        };
      } else {
        // Continue current segment
        currentSegment.content.push(line);
      }
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }

    return this.mergeSmallSegments(segments);
  }

  /**
   * Classify a single line as text or code
   */
  private classifyLine(line: string, allLines: string[], index: number): { type: 'text' | 'code'; language?: string } {
    const trimmed = line.trim();

    // Empty lines inherit context from surrounding lines
    if (!trimmed) {
      const prevLine = index > 0 ? allLines[index - 1] : '';
      const nextLine = index < allLines.length - 1 ? allLines[index + 1] : '';
      
      if (this.isDefinitelyCode(prevLine) || this.isDefinitelyCode(nextLine)) {
        return { type: 'code' };
      }
      return { type: 'text' };
    }

    // Check if it's definitely text
    if (this.isDefinitelyText(trimmed)) {
      return { type: 'text' };
    }

    // Check if it's definitely code
    if (this.isDefinitelyCode(trimmed)) {
      const language = this.detectLanguage(trimmed, allLines, index);
      return { type: 'code', language };
    }

    // Ambiguous - use context
    return this.classifyByContext(trimmed, allLines, index);
  }

  /**
   * Check if a line is definitely text (prose)
   */
  private isDefinitelyText(line: string): boolean {
    const lower = line.toLowerCase();

    // Starts with common text words
    const startsWithText = this.textIndicators.some(word => 
      lower.startsWith(word + ' ') || lower.startsWith(word + ':')
    );

    // Ends with sentence punctuation (but not code punctuation)
    const endsWithSentence = /[.!?]$/.test(line) && !/[;{}()]/.test(line);

    // Contains common text patterns
    const hasTextPatterns = /\b(is|are|was|were|will|would|should|could|can|may|might)\b/.test(lower);

    // Long sentences with multiple words
    const isLongSentence = line.split(' ').length > 8 && !/[{}();=]/.test(line);

    // Contains explanatory phrases
    const hasExplanations = /\b(for example|such as|in other words|that is|i\.e\.|e\.g\.)\b/i.test(line);

    return startsWithText || endsWithSentence || hasTextPatterns || isLongSentence || hasExplanations;
  }

  /**
   * Check if a line is definitely code
   */
  private isDefinitelyCode(line: string): boolean {
    const trimmed = line.trim();

    // Code-specific patterns
    const codePatterns = [
      /^(import|from|export)\s+/, // Import/export statements
      /^(const|let|var|function|class|def)\s+\w+/, // Declarations
      /^(if|for|while|try|catch)\s*\(/, // Control structures
      /^\w+\s*\([^)]*\)\s*[{;]$/, // Function calls/definitions
      /^[a-zA-Z_$]\w*\s*[=:]\s*[^=]/, // Assignments
      /^[\s]*[{}()[\]]+[\s]*$/, // Brackets only
      /^(\/\/|#|\*|<!--)/, // Comments
      /[{}();=]{2,}/, // Multiple operators
      /<[A-Z]\w*[^>]*>/, // JSX/HTML tags
      /\.[a-zA-Z_$]\w*\s*\(/, // Method calls
      /=>\s*[{(]/, // Arrow functions
      /:\s*(string|number|boolean|object|any|void|Promise)/, // Type annotations
    ];

    return codePatterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * Classify ambiguous lines using context
   */
  private classifyByContext(line: string, allLines: string[], index: number): { type: 'text' | 'code'; language?: string } {
    const contextWindow = 3;
    const start = Math.max(0, index - contextWindow);
    const end = Math.min(allLines.length, index + contextWindow + 1);
    
    let codeScore = 0;
    let textScore = 0;

    // Analyze surrounding lines
    for (let i = start; i < end; i++) {
      if (i === index) continue;
      
      const contextLine = allLines[i].trim();
      if (this.isDefinitelyCode(contextLine)) codeScore++;
      if (this.isDefinitelyText(contextLine)) textScore++;
    }

    // Check if line has code-like characteristics
    if (/[{}();=]/.test(line)) codeScore += 0.5;
    if (/\b(and|the|is|are|will|would)\b/.test(line.toLowerCase())) textScore += 0.5;

    if (codeScore > textScore) {
      const language = this.detectLanguage(line, allLines, index);
      return { type: 'code', language };
    }

    return { type: 'text' };
  }

  /**
   * Detect programming language
   */
  private detectLanguage(line: string, allLines: string[], index: number): string {
    const contextLines = allLines.slice(Math.max(0, index - 2), Math.min(allLines.length, index + 3));
    const context = contextLines.join(' ').toLowerCase();

    for (const [lang, keywords] of Object.entries(this.codeKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (context.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);

      if (score >= 2) {
        return lang;
      }
    }

    // Default language detection
    if (/interface|type|enum/.test(context)) return 'typescript';
    if (/def |import |class /.test(context)) return 'python';
    if (/const|let|var|function/.test(context)) return 'javascript';
    if (/<[A-Z]/.test(context)) return 'jsx';

    return '';
  }

  /**
   * Merge small segments to avoid fragmentation
   */
  private mergeSmallSegments(segments: ContentSegment[]): ContentSegment[] {
    const merged: ContentSegment[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // If it's a small text segment between code segments, merge it with code
      if (segment.type === 'text' && segment.content.length <= 2) {
        const prevSegment = merged[merged.length - 1];
        const nextSegment = segments[i + 1];
        
        if (prevSegment?.type === 'code' && nextSegment?.type === 'code') {
          // Merge with previous code segment
          prevSegment.content.push(...segment.content);
          continue;
        }
      }

      // If it's a small code segment, check if it should be text
      if (segment.type === 'code' && segment.content.length === 1) {
        const line = segment.content[0].trim();
        if (this.isDefinitelyText(line)) {
          segment.type = 'text';
          delete segment.language;
        }
      }

      merged.push(segment);
    }

    return merged;
  }

  /**
   * Reconstruct content with proper code blocks
   */
  private reconstructContent(segments: ContentSegment[]): string {
    const result: string[] = [];

    for (const segment of segments) {
      if (segment.type === 'text') {
        result.push(...segment.content);
      } else {
        // Code segment
        const nonEmptyLines = segment.content.filter(line => line.trim());
        if (nonEmptyLines.length > 0) {
          result.push('');
          result.push(`\`\`\`${segment.language || ''}`);
          result.push(...segment.content);
          result.push('```');
          result.push('');
        }
      }
    }

    return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * Clean existing code blocks that might be malformed
   */
  private cleanExistingCodeBlocks(text: string): string {
    let cleaned = text;

    // Remove duplicate code block markers
    cleaned = cleaned.replace(/```(\w+)?\s*```(\w+)?/g, '```$1$2');
    
    // Remove duplicate language labels
    cleaned = cleaned.replace(/(\w+)\s+\1/g, '$1');
    
    // Clean up duplicate lines within code blocks
    const lines = cleaned.split('\n');
    const result: string[] = [];
    let inCodeBlock = false;
    let previousLine = '';

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        result.push(line);
        previousLine = line;
        continue;
      }

      if (inCodeBlock && line === previousLine && line.trim() !== '') {
        continue; // Skip duplicate line in code block
      }

      result.push(line);
      previousLine = line;
    }

    return result.join('\n');
  }
}

// Export the main formatting function
export const intelligentFormatContent = (text: string): string => {
  const formatter = new IntelligentCodeFormatter();
  return formatter.formatContent(text);
};

// Format blog post content array
export const intelligentFormatBlogPost = (contentArray: string[]): string[] => {
  return contentArray.map(paragraph => intelligentFormatContent(paragraph));
};
