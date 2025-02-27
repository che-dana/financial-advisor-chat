import { Sidebar } from '@/components/layout/Sidebar';
import { KnowledgeBaseEditor } from '@/components/knowledge-base/KnowledgeBaseEditor';

export default function KnowledgeBasePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <KnowledgeBaseEditor />
      </main>
    </div>
  );
} 