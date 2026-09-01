## 1. Overview

Trendsta is an AI-powered content growth platform designed to help creators and digital brands discover trends, generate high-performing content ideas, and make data-driven decisions.
It combines trend analysis, automated data pipelines, and AI-generated insights into a unified system that reduces guesswork in content creation.

---

## 2. Problem Statement

Content creators face several challenges:

- Difficulty identifying emerging trends early  
- Lack of consistency in content performance  
- No clear understanding of why content goes viral  
- Heavy reliance on intuition instead of data  

Existing tools either:
- Provide raw analytics without actionable insights, or  
- Offer generic suggestions without context

Additionally:

- Many users do not have the time to interpret dashboards and analytics  
- Even when insights are available, they are not always easy to act upon  

---

## 3. Solution

Trendsta addresses these challenges by:

- Collecting and processing trend signals from multiple sources  
- Using AI to generate:
  - Content ideas  
  - Hooks  
  - Scripts  
- Providing actionable insights instead of raw data
- Providing a conversational AI consultant for intuitive interaction  
The system focuses on delivering **usable outputs**, not just analytics.

---

## 4. System Architecture
<img width="1151" height="1071" alt="image" src="https://github.com/user-attachments/assets/a8b9294e-cc6d-43e9-9e27-593a1a610efb" />
---

## 5. n8n Workflow (Trend Detection & Scraping)

Trendsta currently uses an **n8n workflow** as the core automation layer for trend detection and data collection.

### Purpose of the Workflow

The n8n workflow is responsible for:

- Scraping or collecting data from socials  
- Extracting relevant signals (engagement, patterns, formats)  
- Structuring this data for further processing  
- Adds an intelligence layer using LLMs  

---

### High-Level Workflow Steps

1. **Trigger**
   - Invoked by backend API request or scheduled trigger for a particular user  

2. **Data Collection**
   - Scrapes data from across socials media platform  

3. **Preprocessing**
   - Cleans and filters raw data  
   - Removes irrelevant entries  

4. **Intelligence layer**
   - Identifies useful indicators such as:
     - Engagement patterns  
     - Repeated formats  
     - Viral hooks or structures
   - Generates scripts and hashtags for user  

5. **Structuring Output**
   - Converts processed data into a consistent format  
   - Saves it to relevant tables in the database 
---

### Why n8n?

- Enables rapid prototyping of data pipelines  
- Easy to modify and experiment with workflows  
- Reduces initial backend complexity  
- Allows quick iteration on scraping and trend logic  

---

## 6. AI Consultant (Conversational Interface)

Trendsta includes a conversational AI consultant that allows users to interact with the system in a natural, chat-based format.

### Purpose

- Provides an alternative to traditional dashboards and analytics  
- Allows users to directly ask questions and receive actionable insights  
- Reduces the effort required to interpret complex data  

### Capabilities

- Answers queries based on processed trend and research data  
- Suggests content ideas, hooks, and strategies  
- Explains why certain content performs well  
- Assists in decision-making for content direction and growth  

### Implementation

- Uses a **Retrieval-Augmented Generation (RAG)** approach to generate responses grounded in processed trend data  
- Retrieves relevant insights from the database (generated via n8n workflows)  
- Incorporates **context management** to maintain conversation continuity  
- Uses **memory mechanisms** to retain user-specific context across interactions  
- Ensures responses are:
  - Context-aware  
  - Data-backed  
  - Actionable  

This allows the AI consultant to function as a **stateful, personalized assistant**, rather than a stateless chatbot.

---

## 7. Project Directory Structure

Here is a high-level overview of how the Trendsta repository is structured:

- **`/app`** - Next.js App Router root containing pages, layouts, and style tokens:
  - **`/app/dashboard`** - Main user dashboard displaying trends, competitors, and growth analytics.
  - **`/app/ai-consultant`** - Chat interface to interact with the AI assistant Stella.
  - **`/app/components`** - Reusable UI components (buttons, input fields, modals, cards) styled with Tailwind CSS.
  - **`/app/api`** - Backend route handlers for triggering research, processing webhooks, and interacting with the AI consultant.
  - **`/app/checkout` & `/app/subscription`** - Dodo Payments integration pages and flows.
- **`/lib`** - Core business logic, configuration modules, and helpers:
  - **`/lib/auth.ts`** - User authentication configuration via Better Auth.
  - **`/lib/prisma.ts`** - Single database client instance.
  - **`/lib/research`** - Parsing and formatting utilities for n8n-generated research results.
- **`/prisma`** - Database design:
  - **`schema.prisma`** - Postgres schema definition detailing model relationships (Users, Wallets, StellaTransactions, Subscriptions, Commissions, Conversations, AnalysisJobs).
  - **`seed.ts`** - Script to initialize default subscription plans (Silver, Gold, Platinum) and top-up Stella credit bundles.

---

## 8. Tech Stack

- **Framework**: Next.js
- **Auth**: Better Auth
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Automation & Pipelines**: n8n workflows
- **AI/LLM orchestration**: LangChain & OpenRouter
- **Payments**: Dodo Payments
- **Email Dispatch**: Resend
- **Analytics**: PostHog

---

## 9. Future Improvements

- Replace n8n workflows with a **custom LangGraph-based pipeline** to improve efficiency
- Improve scalability and performance of trend detection  
- Multi-platform support (YouTube, LinkedIn, X)  

---

## 10. Getting Started & Running Locally

Follow these steps to set up and run the Trendsta development server locally:

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** instance (running locally or hosted)

### Steps

1. **Clone the Repository & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the template env file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the required configuration:
   - `DATABASE_URL`: Connection URL for your PostgreSQL database.
   - `BETTER_AUTH_SECRET` & `BETTER_AUTH_URL`: Configurations for user auth.
   - `DODO_PAYMENTS_API_KEY`: Credentials for subscription checks.
   - `OPENROUTER_API_KEY`: Key to invoke OpenRouter models.

3. **Set Up Database Schema & Seed Data**
   Run the following commands to initialize PostgreSQL tables and seed predefined plans (Silver, Gold, Platinum) along with credit bundles:
   ```bash
   # Push schema changes to your database
   npx prisma db push

   # Generate Prisma Client types
   npx prisma generate

   # Seed the database with plans and credit bundles
   npx prisma db seed
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 11. Limitations

- AI output depends on LLM quality  
- Trend detection is not fully real-time  
- Current workflow takes some minutes to complete the analysis

---

## 12. Use Cases

- Content creators (Instagram, YouTube, short-form platforms)  
- Influencers and personal brands
- AI faceless channels  
- Marketing teams and agencies  
- Growth-focused startups  
