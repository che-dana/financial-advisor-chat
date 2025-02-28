"use client"

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { MarketingPlanProvider } from "@/contexts/MarketingPlanContext";
import { KnowledgeBaseProvider } from "@/contexts/KnowledgeBaseContext";
import { FinalPromptProvider } from "@/contexts/FinalPromptContext";
import { ChatProvider } from "@/contexts/ChatContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <UserProfileProvider>
          <KnowledgeBaseProvider>
            <MarketingPlanProvider>
              <FinalPromptProvider>
                <ChatProvider>
                  {children}
                </ChatProvider>
              </FinalPromptProvider>
            </MarketingPlanProvider>
          </KnowledgeBaseProvider>
        </UserProfileProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 