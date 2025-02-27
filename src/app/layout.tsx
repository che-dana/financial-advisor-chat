import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { KnowledgeBaseProvider } from "@/contexts/KnowledgeBaseContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { MarketingPlanProvider } from "@/contexts/MarketingPlanContext";
import { FinalPromptProvider } from "@/contexts/FinalPromptContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financial Advisor Builder",
  description: "Design and optimize financial advisor conversations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProfileProvider>
          <KnowledgeBaseProvider>
            <ChatProvider>
              <MarketingPlanProvider>
                <FinalPromptProvider>
                  {children}
                  <Toaster />
                </FinalPromptProvider>
              </MarketingPlanProvider>
            </ChatProvider>
          </KnowledgeBaseProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
} 