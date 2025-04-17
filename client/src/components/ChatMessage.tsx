import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type ChatMessageProps = {
  content: string;
  isUser: boolean;
}

// Function to parse message content for code blocks
function processMessageContent(content: string) {
  const codeBlockRegex = /<code-block language="(.*?)">([\s\S]*?)<\/code-block>/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [fullMatch, language, code] = match;
    const matchIndex = match.index;
    
    // Add text before code block
    if (matchIndex > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, matchIndex)
      });
    }
    
    // Add code block
    parts.push({
      type: 'code',
      content: code,
      language: language || 'text'
    });
    
    lastIndex = matchIndex + fullMatch.length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }
  
  // If no code blocks were found, return the original content as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content
    });
  }
  
  return parts;
}

// Component for rendering a code block with copy functionality
function CodeBlock({ content, language }: { content: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative rounded bg-gray-900 text-gray-100 font-mono text-sm my-2 overflow-hidden">
      {language && (
        <div className="bg-gray-800 text-gray-400 px-4 py-1 text-xs">{language}</div>
      )}
      <div className="p-4 overflow-x-auto whitespace-pre">
        {content}
      </div>
      <Button 
        size="sm" 
        variant="ghost" 
        className="absolute right-2 top-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 h-7 w-7 p-0"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  );
}

export default function ChatMessage({ content, isUser }: ChatMessageProps) {
  const messageParts = processMessageContent(content);
  
  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm mr-2 mt-1 flex-shrink-0">
          A
        </div>
      )}
      <div 
        className={`${
          isUser 
            ? 'bg-primary text-white rounded-lg rounded-tr-none' 
            : 'bg-white dark:bg-gray-800 rounded-lg rounded-tl-none'
        } p-3 shadow-sm max-w-[85%]`}
      >
        {messageParts.map((part, index) => (
          part.type === 'text' ? (
            <p key={index} className="text-sm">{part.content}</p>
          ) : (
            <CodeBlock key={index} content={part.content} language={part.language} />
          )
        ))}
      </div>
    </div>
  );
}
