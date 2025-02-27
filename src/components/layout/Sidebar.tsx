"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProfileSidebar } from '@/components/user-profile/UserProfileSidebar';
import { Home, BookOpen, Settings, ChevronLeft, ChevronRight, User, BarChart } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col ${isOpen ? 'w-80' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {isOpen ? (
          <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dana Advisor</h2>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">D</div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="p-3">
        <div className={`${isOpen ? 'mb-3 px-3 text-xs font-semibold text-gray-400 uppercase' : 'hidden'}`}>
          Main
        </div>
        <ul className="space-y-1">
          <li>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
              <Home size={20} className="text-blue-600" />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link href="/knowledge-base" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
              <BookOpen size={20} className="text-blue-600" />
              {isOpen && <span>Knowledge Base</span>}
            </Link>
          </li>
        </ul>
        
        {isOpen && (
          <div className="mt-6 mb-3 px-3 text-xs font-semibold text-gray-400 uppercase">
            User Profile
          </div>
        )}
      </nav>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {isOpen && <UserProfileSidebar />}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          {isOpen && (
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Product Manager</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dana Financial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 