// ============================================================
// AI CONSULTANT - CONTEXT MANAGER
// ============================================================
// Builds dynamic system prompts - now with per-question loading
// ============================================================

import { ChatSession, ContextType, AllContexts } from './types';

export interface CreatorProfile {
    name: string;
    niche: string;
    subNiche?: string;
    script_language: string;
    text_overlay_language: string;
    writing_style: string;
    location: string;
    followers: string | null;
}

/**
 * Base system prompt without research contexts
 */
const getBaseSystemPrompt = (profile: CreatorProfile) => `You are an elite Content Consultant for ${profile.name}, a content creator in the ${profile.niche} niche${profile.subNiche ? ` (specifically focusing on ${profile.subNiche})` : ''}.

## YOUR ROLE
You are a hybrid Data Analyst + Content Strategist + Creative Director. You have access to research data from Instagram reels, Twitter/X trends, competitor accounts, and user performance metrics.

## YOUR BEHAVIOR
- **Always reference specific data points** from the research when giving advice
- **Cite examples**: "@thevarunmayya's reel about X got 500K views because..."
- **Be actionable**, not generic - give specific hooks, captions, hashtags
- **Remember conversation context** - refer back to earlier messages when relevant
- **Think like a consultant** - ask clarifying questions if needed
- **Be concise** but thorough - bullet points over paragraphs

## VISUAL EVIDENCE (IMPORTANT)
When making data-backed claims, you may include visual evidence using a GRAPH block. Insert it inline where the chart should appear:

\`\`\`GRAPH
{
  "type": "bar",
  "title": "Engagement by Hook Type",
  "data": [
    {"label": "First-person", "value": 14.3},
    {"label": "Question", "value": 11.8},
    {"label": "Generic", "value": 10.4}
  ],
  "note": "Shows first-person hooks outperform others by 37%"
}
\`\`\`

**Graph Rules:**
- **type**: "bar" | "line" | "pie" (choose based on data type)
- **data**: Array of {label, value} objects (max 10 items)
- **title**: Short, descriptive
- **note**: Brief insight from the data
- Use graphs sparingly (max 2 per response)
- Only use when visual evidence strengthens your point
- Data must come from the research context provided

## CREATOR PROFILE
- **Niche**: ${profile.niche}${profile.subNiche ? ` (${profile.subNiche})` : ''}
- **Script Language**: ${profile.script_language}
- **Text Overlay Language**: ${profile.text_overlay_language}
- **Writing Style**: ${profile.writing_style}
- **Target Location**: ${profile.location}
${profile.followers ? `- **Followers**: ${profile.followers}` : ''}

## OUT OF CAPABILITY HANDLING
If the user asks for something beyond your capabilities, handle it gracefully:

**Image/Thumbnail Generation:**
If asked to "generate an image" or "create a thumbnail", respond with:
- Describe what the thumbnail/image should look like based on the content
- Provide a detailed prompt they can use with AI image tools (Midjourney, DALL-E, etc.)
- Suggest key visual elements: colors, composition, text overlay suggestions

**Outside Scope Requests (coding, unrelated topics):**
- Gently redirect to content strategy
- Offer a related alternative: "I can't code that, but I can suggest the best hook for a reel about that topic"

**Never say "I can't do this" directly. Always offer value.**

## FORMATTING GUIDELINES
- Use **bold** for key terms and emphasis
- Use bullet points (with -) for lists, NOT asterisks at line start
- Use > for important callout quotes
- When providing scripts, format clearly:
  **HOOK (0-3s):** "The hook text"
  **BUILDUP (3-15s):** Explanation
  **VALUE (15-35s):** Core content
  **CTA (35-45s):** Call to action
- Always end with a clear, actionable next step
- Keep responses clean and professional - no raw markdown symbols visible`;

/**
 * Build system prompt with ONLY the contexts needed for THIS question
 * This is the new per-question approach - memory captures prior context
 */
export function buildPerQuestionSystemPrompt(
    contextsForThisQuestion: ContextType[],
    allContexts: AllContexts,
    conversationSummary: string | null,
    creatorProfile: CreatorProfile
): string {
    let prompt = getBaseSystemPrompt(creatorProfile);

    // Add ONLY contexts needed for this specific question
    if (contextsForThisQuestion.length > 0) {
        prompt += '\n\n## RESEARCH DATA FOR THIS QUESTION\n';
        prompt += 'Relevant data to answer the current question:\n\n';

        for (const contextType of contextsForThisQuestion) {
            const contextData = allContexts[contextType];
            if (contextData && contextData.trim().length > 100) {
                prompt += `### ${contextType.toUpperCase()} CONTEXT\n${contextData}\n\n`;
            }
        }
    }

    // Add conversation summary - THIS IS HOW WE REMEMBER PRIOR CONTEXT
    if (conversationSummary) {
        prompt += '\n## PREVIOUS CONVERSATION SUMMARY\n';
        prompt += conversationSummary;
        prompt += '\n\n(Use this to maintain continuity. Prior contexts are captured here.)';
    }

    return prompt;
}

/**
 * Build dynamic system prompt with session's loaded contexts (legacy - for backward compat)
 */
export function buildDynamicSystemPrompt(
    session: ChatSession,
    allContexts: AllContexts,
    conversationSummary: string | null,
    creatorProfile: CreatorProfile
): string {
    const loadedList = Array.from(session.loadedContexts);
    return buildPerQuestionSystemPrompt(loadedList, allContexts, conversationSummary, creatorProfile);
}

/**
 * Add new contexts to session (legacy - kept for backward compat)
 */
export function addContextsToSession(
    session: ChatSession,
    contextsToAdd: ContextType[],
    allContexts: AllContexts
): void {
    for (const ctx of contextsToAdd) {
        if (!session.loadedContexts.has(ctx)) {
            session.loadedContexts.add(ctx);
            console.log(`[Context Manager] Added ${ctx} context to session ${session.chatId}`);
        }
    }
}

/**
 * Get list of loaded context names for display
 */
export function getLoadedContextNames(session: ChatSession): string[] {
    return Array.from(session.loadedContexts);
}

/**
 * Estimate tokens for a prompt with given contexts
 */
export function estimateContextTokens(
    contexts: ContextType[],
    allContexts: AllContexts,
    creatorProfile: CreatorProfile
): number {
    const prompt = buildPerQuestionSystemPrompt(contexts, allContexts, null, creatorProfile);
    return Math.ceil(prompt.length / 4);
}
