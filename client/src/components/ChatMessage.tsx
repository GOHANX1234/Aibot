import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="relative rounded-lg bg-black/40 text-gray-100 font-mono text-sm my-3 overflow-hidden border border-primary/20">
      {language && (
        <div className="bg-primary/20 text-primary-foreground px-4 py-1 text-xs font-semibold flex justify-between">
          <span>{language}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-primary-foreground hover:text-white hover:bg-primary/30 h-5 w-5 p-0"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      )}
      <div className="p-4 overflow-x-auto whitespace-pre">
        {content}
      </div>
      {!language && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="absolute right-2 top-2 text-primary-foreground hover:text-white bg-primary/20 hover:bg-primary/30 h-6 w-6 p-0"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span className="sr-only">Copy code</span>
        </Button>
      )}
    </div>
  );
}

export default function ChatMessage({ content, isUser }: ChatMessageProps) {
  const messageParts = processMessageContent(content);
  
  return (
    <div className={cn(
      "flex w-full mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser ? "bg-gradient-to-br from-purple-500 to-indigo-700" : "bg-gradient-to-br from-indigo-600 to-violet-800"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        <div className={cn(
          "rounded-lg px-4 py-3 shadow-md",
          isUser 
            ? "user-message-gradient text-white rounded-tr-none" 
            : "ai-message-gradient text-gray-100 rounded-tl-none"
        )}>
          {messageParts.map((part, index) => (
            part.type === 'text' ? (
              <div key={index} className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {part.content}
              </div>
            ) : (
              <CodeBlock key={index} content={part.content} language={part.language} />
            )
          ))}
        </div>
      </div>
    </div>
  );
}
