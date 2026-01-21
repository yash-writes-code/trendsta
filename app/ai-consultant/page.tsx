"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { AI_CHAT_HISTORY } from "../data/mockData";
import { Send, Sparkles, RefreshCw, TrendingUp, Menu } from "lucide-react";

// Mobile Header Component
function MobileHeader() {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-blue-100 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                    <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-900">Trendsta</span>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-900">
                <Menu size={24} />
            </button>
        </div>
    );
}

type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

const SUGGESTED_PROMPTS = [
    "Analyze my Scripts",
    "Find Competitors",
    "Rewrite Hook",
    "Content Strategy",
];

// Chat Message Component
function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] md:max-w-[70%] px-5 py-3.5 rounded-2xl ${isUser
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
            >
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-500">Trendsta AI</span>
                    </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}

// Main AI Consultant Page
export default function AIConsultantPage() {
    const [messages, setMessages] = useState<Message[]>(AI_CHAT_HISTORY);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: messageText,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponses: Record<string, string> = {
                "Analyze my Scripts": `I've analyzed your scripts from the Dashboard. Here's what I found:

📊 **Overall Quality**: Excellent (Average score: 91.7)

**Top Performing Elements:**
• Strong contrarian hooks that challenge assumptions
• Specific numbers (₹5000, ₹800) add credibility
• Hinglish tone builds authentic connection

**Suggestions for Improvement:**
1. Add more cliffhangers to increase episode-to-episode retention
2. Consider adding "proof shots" - screenshots of revenue, analytics
3. The CTA could be stronger - try asking a direct question`,

                "Find Competitors": `Based on your niche (Build in Public / Startup Journey), here are your top competitors:

🎯 **Direct Competitors:**
1. **@desserthousepimpri** - 48K views, velocity 5.31, focuses on physical product journey
2. **@startupstealth** - 53K views, velocity 7.84, startup memes & relatability
3. **@atlasberry008** - 23K views, business systems & frameworks

📈 **Content Gaps You Can Exploit:**
• None of them focus on digital/service businesses
• No one is doing "micro-budget" content well
• Twitter/X integration stories are untapped

**Recommended Action:** Create a series on building a SaaS for under ₹10,000`,

                "Rewrite Hook": `Here are 3 rewrites of your top-performing hook:

**Original:** "Log kehte hain startup ke liye ek technical cofounder chahiye. Yeh sabse bada jhoot hai."

**Rewrite 1 (More Confrontational):**
"Har koi galat hai. Aapko technical cofounder ki zaroorat nahi hai."

**Rewrite 2 (Story-based):**
"Maine apni company banayi bina ek line code likhe. 6 mahine mein ₹3 lakh revenue."

**Rewrite 3 (Question Hook):**
"Kya aapko lagta hai startup ke liye coder hona zaroori hai? Bilkul galat."

💡 **Recommendation:** Use Rewrite 2 - specific numbers perform 40% better in your niche.`,

                "Content Strategy": `Based on your research data, here's your optimized content strategy:

📅 **Posting Schedule:** 3-4 times per week, 6-9 PM IST

🎯 **Content Pillars:**
1. **Build in Public** (40%) - Day-by-day journey updates
2. **No-Code Tips** (30%) - Tool tutorials & hacks
3. **Micro-Budget Stories** (20%) - Cost breakdowns
4. **Motivation/Mindset** (10%) - Contrarian takes

📊 **Format Mix:**
• 60% talking head with text overlays
• 25% screen recordings / tutorials
• 15% behind-the-scenes vlogs

🔥 **This Week's Priority:**
Create a "₹5000 to MVP" series - your data shows this gap is massive!`,
            };

            const response = aiResponses[messageText] || `Thanks for your message! I'm analyzing your request about "${messageText}". 

Based on your Dashboard data, I can help you with:
• Script optimization and hook analysis
• Competitor research and gap identification  
• Content strategy recommendations

Would you like me to dive deeper into any of these areas?`;

            const aiMessage: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: response,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 flex flex-col h-screen">
                {/* Chat Header */}
                <div className="p-4 md:p-6">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                <Sparkles size={20} className="text-white" />
                            </div> */}
                            <div>
                                <h1 className="font-semibold text-slate-900 text-2xl">AI Consultant</h1>
                                <p className="text-sm text-slate-500">Your content strategy advisor</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMessages(AI_CHAT_HISTORY)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Reset conversation"
                        >
                            {/* <RefreshCw size={18} /> */}
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 ">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 text-slate-700 px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={14} className="text-blue-500 animate-pulse" />
                                        <span className="text-sm text-slate-500">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-blue-100 bg-white">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {/* Suggested Prompts */}
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleSend(prompt)}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-sm font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        {/* Input Field */}
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about your content strategy..."
                                    rows={1}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-400"
                                    style={{ minHeight: "48px", maxHeight: "120px" }}
                                />
                            </div>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
