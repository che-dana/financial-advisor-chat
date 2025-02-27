import { FinancialAdvisorChat } from '@/components/financial-advisor/FinancialAdvisorChat';
import { MarketingPlanGenerator } from '@/components/marketing-plan/MarketingPlanGenerator';
import { FinalPromptConfig } from '@/components/final-prompt/FinalPromptConfig';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 min-h-screen">
          <div className="grid grid-cols-1 gap-6 pb-8">
            <div className="h-[70vh]">
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