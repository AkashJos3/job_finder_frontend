import type { PageView } from '../../App';
import { API_URL } from '../../lib/api';
import {
  MessageSquare, Search, Send
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StudentSidebar } from '../../components/layout/StudentSidebar';

interface StudentMessagesProps {
  onNavigate: (view: PageView) => void;
  onLogout: () => void;
}

export function StudentMessages({ onNavigate, onLogout }: StudentMessagesProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUserId(session.user.id);
        fetchConversations(session.access_token);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      const poll = setInterval(() => fetchMessages(selectedChat.id), 5000);
      return () => clearInterval(poll);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setConversations(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${API_URL}/api/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ receiver_id: selectedChat.id, content: messageInput })
      });
      if (res.ok) {
        setMessageInput('');
        fetchMessages(selectedChat.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] dark:bg-[#121212] flex transition-colors duration-200">
      <StudentSidebar activeView="student-messages" onNavigate={onNavigate} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 px-8 py-4">
          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white">Messages</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chat with employers</p>
            </div>
          </div>
        </header>

        {/* Messages Content */}
        <div className="flex h-[calc(100vh-89px)]"> {/* Adjusted height to fill remaining screen space */}
          {/* Chat List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#2D2D2D] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518] transition-colors"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No conversations yet</div>
              ) : conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors ${selectedChat?.id === chat.id ? 'bg-[#F5C518]/10 dark:bg-[#F5C518]/20 border-l-4 border-[#F5C518]' : ''
                    }`}
                >
                  <div className="w-12 h-12 bg-[#1A1A1A] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-[#1A1A1A] font-bold shadow-sm">
                    {chat.full_name ? chat.full_name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-[#1A1A1A] dark:text-white line-clamp-1">{chat.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate capitalize">{chat.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[#FFFBF0] dark:bg-[#121212]">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shadow-sm z-10">
                  <div className="w-10 h-10 bg-[#1A1A1A] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-[#1A1A1A] font-bold">
                    {selectedChat.full_name ? selectedChat.full_name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] dark:text-white">{selectedChat.full_name || 'Unknown User'}</p>
                    <p className="text-xs text-green-500 dark:text-green-400">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe
                            ? 'bg-[#F5C518] text-[#1A1A1A] rounded-br-none'
                            : 'bg-white dark:bg-[#2D2D2D] text-[#1A1A1A] dark:text-white rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800'
                            }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 text-right ${isMe ? 'text-[#1A1A1A]/60' : 'text-gray-400 dark:text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#2D2D2D] border border-gray-200 dark:border-gray-700 text-[#1A1A1A] dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#F5C518] transition-colors"
                    />
                    <button onClick={handleSend} className="w-12 h-12 bg-[#F5C518] rounded-full flex items-center justify-center hover:bg-[#E5B508] transition-colors shadow-sm flex-shrink-0">
                      <Send className="w-5 h-5 text-[#1A1A1A]" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white dark:bg-[#2D2D2D] rounded-full flex items-center justify-center mx-auto mb-4 card-shadow border border-transparent dark:border-gray-800">
                    <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
