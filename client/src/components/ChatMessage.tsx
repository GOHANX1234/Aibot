type ChatMessageProps = {
  content: string;
  isUser: boolean;
}

export default function ChatMessage({ content, isUser }: ChatMessageProps) {
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
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}
