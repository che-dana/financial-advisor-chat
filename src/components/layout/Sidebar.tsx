"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProfileSidebar } from '@/components/user-profile/UserProfileSidebar';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`border-r bg-background ${isOpen ? 'w-80' : 'w-16'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className={`font-semibold ${isOpen ? 'block' : 'hidden'}`}>Financial Advisor Builder</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-muted"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 rounded-md hover:bg-muted">
              <span className="mr-2">🏠</span>
              {isOpen && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link href="/knowledge-base" className="flex items-center p-2 rounded-md hover:bg-muted">
              <span className="mr-2">📚</span>
              {isOpen && <span>Knowledge Base</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="flex-1 overflow-auto">
        {isOpen && <UserProfileSidebar />}
      </div>
    </div>
  );
} 