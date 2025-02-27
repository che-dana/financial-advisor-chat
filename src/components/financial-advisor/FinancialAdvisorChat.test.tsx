import { render, screen } from '@testing-library/react'
import { FinancialAdvisorChat } from './FinancialAdvisorChat'
import { ChatProvider } from '@/contexts/ChatContext'
import { UserProfileProvider } from '@/contexts/UserProfileContext'
import { KnowledgeBaseProvider } from '@/contexts/KnowledgeBaseContext'
import { FinalPromptProvider } from '@/contexts/FinalPromptContext'

describe('FinancialAdvisorChat', () => {
  it('renders the chat interface', () => {
    render(
      <UserProfileProvider>
        <KnowledgeBaseProvider>
          <FinalPromptProvider>
            <ChatProvider>
              <FinancialAdvisorChat />
            </ChatProvider>
          </FinalPromptProvider>
        </KnowledgeBaseProvider>
      </UserProfileProvider>
    )
    
    expect(screen.getByText('Financial Advisor Chat')).toBeInTheDocument()
    expect(screen.getByText('Start a conversation with the financial advisor.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
  })
}) 