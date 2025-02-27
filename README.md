# Financial Advisor Builder

## Overview
Financial Advisor Builder is a platform built for investment product managers at Dana to design and optimize financial advisor conversations. These conversations are intended to influence end users to purchase investment products. The platform allows product managers to experiment with prompts, user data, and chatbot responses to prepare a finely-tuned financial advisor experience before launch.

## Repository
This project is hosted on GitHub at: [https://github.com/che-dana/financial-advisor-chat](https://github.com/che-dana/financial-advisor-chat)

## Architecture
Financial Advisor Builder is a Next.js web application with styling from shadcn-ui. The application consists of two main pages:

1. **Financial Advisor Page** - The core interface with three primary components:
   - Chat interface with streaming capabilities
   - Marketing Plan Generator
   - Final Prompt Configuration

2. **Knowledge Base Page** - For storing and managing product information

The application uses a sidebar for user profile configuration and maintains version history for prompts and marketing plans.

## Features

### User Profile Customization
The left navigation sidebar allows configuration of detailed user profiles with the following parameters:

#### Personality Traits
- Openness (High/Low)
- Conscientiousness (High/Low)
- Extraversion (High/Low)
- Agreeableness (High/Low)
- Neuroticism (High/Low)

#### Demographics & Financial Status
- Education Level (High School, Bachelor's, Master's, PhD)
- Income Level (Low, Medium, High)
- Housing Status (Renting, Own House, Living with Family)
- Vehicle Ownership (None, Car, Motorcycle)
- Nature of Work (Salaried, Self-employed, Freelancer, Retired)
- Number of Family Dependants (0-10)
- Age (18-100)
- Behavioral Trait (Saver, Spender, Investor)

#### Investment Product Status
- eMAS (Existing User: Yes/No)

### Financial Advisor Chat
- Interactive chat interface with shadcn components
- Streaming response capabilities
- Context-aware responses based on user profile and knowledge base

### Marketing Plan Generator
- Customizable marketing prompt with user profile context
- One-click generation of comprehensive marketing plans
- Output includes:
  - Best Products for the user
  - Marketing technique to be used
  - Conversation Starter
  - Conversation Sequence
- Version history tracking for prompts, plans, and user properties

### Final Prompt Configuration
- Configuration panel for the core prompt that powers the financial advisor
- Context integration from user properties and knowledge base

### Knowledge Base Management
- Dedicated page for product information management
- Separate sections for each product (eMAS, Dana+, Reksa Dana)
- Information used by both the Financial Advisor and Marketing Plan Generator

## Tech Stack
- **Framework**: Next.js
- **UI Components**: shadcn-ui
- **Data Storage**: JSON files for version history and configurations
- **State Management**: React Context/Hooks
- **Deployment**: [To be determined]

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation 