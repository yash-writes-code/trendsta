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


## 8. Tech Stack

- **Webapp** : Next.js  
- **Automation Layer:** n8n  
- **Consultant AI** Langchain  
- **State Management:** Zustand  
- **Database:** PostgreSQL  

---

## 9. Future Improvements

- Replace n8n workflows with a **custom LangGraph-based pipeline** to improve efficiency
- Improve scalability and performance of trend detection  
- Multi-platform support (YouTube, LinkedIn, X)  

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

- AI-generated content  
- Conversational AI consulting  
- Actionable insights  
