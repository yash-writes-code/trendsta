"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Send, Sparkles, TrendingUp, Menu, Zap, BrainCircuit, History, ArrowRight, User, Paperclip } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mobile Header Component
function MobileHeader() {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
                    <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-900">Trendsta</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600">
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

// Chat Message Component
function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
            <div
                className={`max-w-[80%] md:max-w-[70%] px-5 py-3.5 rounded-2xl ${isUser
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
            >
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                            <Sparkles size={12} className="text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Trendsta AI</span>
                    </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
            </div>
        </div>
    );
}

// Main AI Consultant Page
export default function AIConsultantPage() {
    const { isCollapsed } = useSidebar();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [thinkingMode, setThinkingMode] = useState<"flash" | "deep">("flash");
    const [showHistory, setShowHistory] = useState(false);
    const [userTyping, setUserTyping] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Handle user typing
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        setUserTyping(e.target.value.length > 0);
    };

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        setHasStartedChat(true);
        setUserTyping(false);

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: messageText,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI response logic (mocked for now)
        setTimeout(() => {
            const response = "I'm analyzing your request using " + (thinkingMode === 'flash' ? "Fast Thinking" : "Deep Research") + " protocols. Here are the insights...";

            const aiMessage: Message = {
                id: Date.now() + 1,
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            {/* History Sidebar (Right Drawer) */}
            <div className={`fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 z-50 transform transition-transform duration-300 shadow-2xl ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Chat History</h3>
                    <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                        <ArrowRight size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-full">
                    {/* Mock History Items */}
                    <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200">
                        <p className="text-sm font-medium text-slate-700 truncate">Viral Script Analysis</p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                </div>
            </div>

            <main
                className={`transition-all duration-300 ease-in-out md:p-8 flex flex-col items-center relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}
                style={{ height: '100vh', maxHeight: '100vh' }}
            >
                {/* Overlay Dimmer for History */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowHistory(false)} />
                )}

                {/* --- Top Bar --- */}
                <div className="w-full max-w-5xl flex items-center justify-between p-4 z-10 absolute top-0">
                    <div className="flex items-center gap-2 opacity-0 pointer-events-none">
                        {/* Placeholder to balance layout */}
                    </div>

                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View History"
                    >
                        <History size={20} />
                    </button>
                </div>


                {/* --- Main Content Area --- */}
                <div className={`flex-1 w-full max-w-3xl flex flex-col transition-all duration-700 ease-in-out ${hasStartedChat ? 'justify-end pb-40' : 'justify-center items-center pb-20'}`}>

                    {/* Central Hero (Fades out when chat starts) */}
                    <AnimatePresence>
                        {!hasStartedChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                className="text-center mb-12 flex flex-col items-center"
                            >
                                <div className="relative w-48 h-12 mb-6">
                                    <Image
                                        src="/logo3.png"
                                        layout="fill"
                                        objectFit="contain"
                                        alt="Trendsta Logo"
                                        className=""
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Messages List (Visible only after start) */}
                    {hasStartedChat && (
                        <div className="w-full h-full overflow-y-auto px-4 py-6 scrollbar-hide space-y-6">
                            {/* Spacer to push messages down initially if few */}
                            <div className="h-[20vh]" />

                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 text-slate-500 px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-3">
                                        {thinkingMode === 'flash' ? (
                                            <Zap size={16} className="text-amber-500 animate-pulse" />
                                        ) : (
                                            <BrainCircuit size={16} className="text-purple-500 animate-pulse" />
                                        )}
                                        <span className="text-sm font-medium text-slate-500">
                                            {thinkingMode === 'flash' ? 'Speed Thinking...' : 'Deep Researching...'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* --- Input Dock (Blackbox Style) --- */}
                <div className={`w-full max-w-3xl z-20 px-4 transition-all duration-700 ease-in-out ${hasStartedChat ? 'fixed bottom-6' : 'relative'}`}>

                    {/* Search Bar Container */}
                    <div className="relative group">
                        {/* Input Wrapper */}
                        <div className="bg-white p-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 transition-colors hover:border-blue-300">

                            {/* Attachment Button */}
                            <button className="p-3 text-slate-400 hover:text-slate-600 transition-colors ml-1">
                                <Paperclip size={20} />
                            </button>

                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Trendsta..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base md:text-lg p-2 min-h-[48px] max-h-[120px] resize-none text-slate-800 placeholder-slate-400 align-middle leading-[1.5] py-3"
                                rows={1}
                            />

                            {/* Mode Button (Inside Bar? Or Send? Let's put Send here) */}
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className={`p-2 rounded-full transition-all duration-300 mr-1 ${input.trim() ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}
                            >
                                <ArrowRight size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Mode Buttons (Below Input) */}
                    <div className="flex justify-center mt-4 gap-3">
                        <button
                            onClick={() => setThinkingMode('flash')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${thinkingMode === 'flash' ? 'bg-white border-slate-300 text-slate-700 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <Zap size={12} className={thinkingMode === 'flash' ? 'text-amber-500' : 'currentColor'} fill={thinkingMode === 'flash' ? 'currentColor' : 'none'} />
                            Flash Run
                        </button>
                        <button
                            onClick={() => setThinkingMode('deep')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${thinkingMode === 'deep' ? 'bg-white border-slate-300 text-slate-700 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <BrainCircuit size={12} className={thinkingMode === 'deep' ? 'text-purple-500' : 'currentColor'} />
                            Deep Research
                        </button>
                    </div>

                    {/* Footer */}
                    {!hasStartedChat && (
                        <div className="text-center mt-8 space-x-6 text-xs text-slate-400 font-mono">
                            <span className="hover:text-slate-600 cursor-pointer">Agent API</span>
                            <span className="hover:text-slate-600 cursor-pointer">Pricing</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
