// Utility to clean up malformed code blocks and duplicates
export const cleanCodeBlocks = (text: string): string => {
  // Remove duplicate code block markers and clean up formatting
  let cleaned = text;

  // Remove duplicate ```javascript markers
  cleaned = cleaned.replace(/```javascript\s*```javascript/g, '```javascript');
  cleaned = cleaned.replace(/```typescript\s*```typescript/g, '```typescript');
  cleaned = cleaned.replace(/```python\s*```python/g, '```python');
  cleaned = cleaned.replace(/```\s*```/g, '```');

  // Remove duplicate language labels
  cleaned = cleaned.replace(/javascript\s*javascript/g, 'javascript');
  cleaned = cleaned.replace(/typescript\s*typescript/g, 'typescript');
  cleaned = cleaned.replace(/python\s*python/g, 'python');

  // Clean up duplicate code lines
  const lines = cleaned.split('\n');
  const cleanedLines: string[] = [];
  let inCodeBlock = false;
  let previousLine = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Track if we're in a code block
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      cleanedLines.push(line);
      previousLine = line;
      continue;
    }

    // If we're in a code block, check for duplicates
    if (inCodeBlock) {
      // Skip if this line is identical to the previous line (likely a duplicate)
      if (line === previousLine && line.trim() !== '') {
        continue;
      }
      
      // Skip if this line is a duplicate of a line we just added
      if (cleanedLines.length > 0 && line === cleanedLines[cleanedLines.length - 1] && line.trim() !== '') {
        continue;
      }
    }

    cleanedLines.push(line);
    previousLine = line;
  }

  // Join back and clean up extra whitespace
  cleaned = cleanedLines.join('\n');

  // Remove excessive empty lines
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');

  // Clean up code block formatting
  cleaned = cleaned.replace(/```(\w+)\s*\n\s*\n/g, '```$1\n');
  cleaned = cleaned.replace(/\n\s*\n```/g, '\n```');

  return cleaned;
};

// Clean up specific patterns from the example you showed
export const fixSpecificCodeIssues = (text: string): string => {
  let fixed = text;

  // Fix the "Array of Links:Array of Links:" pattern
  fixed = fixed.replace(/(\w+:\s*)\1/g, '$1');

  // Fix duplicate code block openings
  fixed = fixed.replace(/```(\w+)\s*```(\w+)/g, '```$1');

  // Fix lines that repeat themselves
  const lines = fixed.split('\n');
  const fixedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    // If current line and next line are identical and contain code-like content
    if (line === nextLine && line.trim() !== '' && /[{}();=]/.test(line)) {
      fixedLines.push(line);
      i++; // Skip the duplicate
    } else {
      fixedLines.push(line);
    }
  }

  return fixedLines.join('\n');
};

// Comprehensive cleaning function
export const cleanAllCodeFormatting = (text: string): string => {
  let cleaned = text;
  
  // Apply all cleaning functions
  cleaned = cleanCodeBlocks(cleaned);
  cleaned = fixSpecificCodeIssues(cleaned);
  
  // Final cleanup
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
};

// Clean blog post content array
export const cleanBlogPostContent = (contentArray: string[]): string[] => {
  return contentArray.map(paragraph => cleanAllCodeFormatting(paragraph));
};
