"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Create context
interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isLoading, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 