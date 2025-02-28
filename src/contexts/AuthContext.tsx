"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

interface AuthContextType {
  user: any;
  status: "authenticated" | "loading" | "unauthenticated";
  signIn: (provider?: string, options?: any) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider 
      value={{ 
        user: session?.user,
        status,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 