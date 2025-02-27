import { FinancialAdvisorChat } from '@/components/financial-advisor/FinancialAdvisorChat';
import { MarketingPlanGenerator } from '@/components/marketing-plan/MarketingPlanGenerator';
import { FinalPromptConfig } from '@/components/final-prompt/FinalPromptConfig';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-4 h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Financial Advisor Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 h-[calc(100vh-120px)]">
            <div className="h-full">
              <FinancialAdvisorChat />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MarketingPlanGenerator />
              <FinalPromptConfig />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 