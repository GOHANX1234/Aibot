import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Trash2, Menu, X, LayoutDashboard } from 'lucide-react';
import { ChatSession, getChatSessions } from '@/lib/chatSessionService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ChatSidebarProps = {
  activeSessionId: string;
  onCreateNewChat: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
};

export default function ChatSidebar({
  activeSessionId,
  onCreateNewChat,
  onSwitchSession,
  onDeleteSession
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Load chat sessions
  useEffect(() => {
    const loadSessions = () => {
      const allSessions = getChatSessions();
      setSessions(allSessions);
    };
    
    loadSessions();
    
    // Set up an interval to refresh sessions
    const interval = setInterval(loadSessions, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Create a new chat and close sidebar on mobile
  const handleCreateNewChat = () => {
    onCreateNewChat();
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  // Switch to a session and close sidebar on mobile
  const handleSwitchSession = (sessionId: string) => {
    onSwitchSession(sessionId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="fixed top-2 right-3 z-50 md:hidden bg-black/50 backdrop-blur-md border border-primary/40 shadow-lg shadow-black/50 hover:bg-primary/20"
      >
        <Menu className="h-5 w-5 text-primary" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {/* Overlay for mobile */}
      <div 
        className={cn(
          "hamburger-overlay",
          isOpen && "open"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={cn(
          "hamburger-menu",
          isOpen && "open"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-4 pl-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-300">
                AuraAi Chats
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* New Chat Button */}
          <Button 
            onClick={handleCreateNewChat}
            className="mb-6 flex items-center gap-2 group"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
            New Chat
          </Button>
          
          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No chat sessions yet
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className={cn(
                    "chat-item p-2 text-sm rounded-lg flex items-center gap-2 cursor-pointer group",
                    activeSessionId === session.id && "active"
                  )}
                  onClick={() => handleSwitchSession(session.id)}
                >
                  <MessageSquare className="h-4 w-4 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(session.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 md:opacity-0 opacity-70 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all bg-black/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this chat?')) {
                        onDeleteSession(session.id);
                      }
                    }}
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-primary/10 mt-4 pt-4 text-xs text-center text-muted-foreground">
            <p>© 2025 AuraAi</p>
            <p className="mt-1">Space-themed AI Assistant</p>
          </div>
        </div>
      </div>
    </>
  );
}