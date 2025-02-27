import { FinancialAdvisorChat } from '@/components/financial-advisor/FinancialAdvisorChat';
import { MarketingPlanGenerator } from '@/components/marketing-plan/MarketingPlanGenerator';
import { FinalPromptConfig } from '@/components/final-prompt/FinalPromptConfig';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <FinancialAdvisorChat />
          </div>
          <MarketingPlanGenerator />
          <FinalPromptConfig />
        </div>
      </main>
    </div>
  );
} 