"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { Send, Sparkles, TrendingUp, Menu, Zap, BrainCircuit, History, ArrowRight, User, Paperclip, Mic, MicOff, Volume2, VolumeX, Target, ScrollText, Copy, Check, Lightbulb, BarChart3, Users, Hash, PenTool, Calendar, HelpCircle, FileText, Instagram, Plus } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import InlineChart, { InlineChartError } from "../components/InlineChart";
import { parseGraphBlocks, ContentPart } from "@/lib/consultant/graphParser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUsage } from "@/hooks/useUsage";
import { useResearch } from "@/hooks/useResearch";

// ============================================================
// TYPES
// ============================================================
type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
};

// ============================================================
// PROMPT SUGGESTIONS
// ============================================================
const PROMPT_SUGGESTIONS = [
    { icon: TrendingUp, label: "Trending Analysis", prompt: "Analyze trending topics in my niche and give me content ideas", color: "from-blue-500 to-cyan-500" },
    { icon: Lightbulb, label: "Viral Ideas", prompt: "Generate 3 viral reel ideas with hooks for AI/Tech niche", color: "from-amber-500 to-orange-500" },
    { icon: Users, label: "Competitor Intel", prompt: "Analyze my competitors' strategies and what's working for them", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, label: "My Performance", prompt: "How are my recent reels performing? What should I improve?", color: "from-green-500 to-emerald-500" },
    { icon: Hash, label: "Hashtag Strategy", prompt: "Suggest the best performing hashtags for my next post", color: "from-rose-500 to-red-500" },
    { icon: PenTool, label: "Script Writing", prompt: "Write a viral reel script about AI tools with a strong hook", color: "from-indigo-500 to-violet-500" },
];

// ============================================================
// MARKDOWN RENDERER WITH STYLED COMPONENTS
// ============================================================
function MarkdownContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Headers
                h1: ({ children }) => <h1 className="text-xl font-bold text-theme-primary mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-theme-primary mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-theme-primary mt-3 mb-1.5">{children}</h3>,
                h4: ({ children }) => <h4 className="text-sm font-bold text-theme-secondary mt-2 mb-1">{children}</h4>,
                // Paragraphs — use primary for max contrast
                p: ({ children }) => <p className="text-sm md:text-base leading-relaxed mb-3 last:mb-0 text-theme-primary break-words whitespace-pre-wrap">{children}</p>,
                // Strong/Bold
                strong: ({ children }) => <strong className="font-bold text-theme-primary break-words">{children}</strong>,
                // Italic/Emphasis
                em: ({ children }) => <em className="italic text-theme-secondary break-words">{children}</em>,
                // Lists — primary color for readability
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2 ml-2 text-theme-primary break-words">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2 ml-2 text-theme-primary break-words">{children}</ol>,
                li: ({ children }) => <li className="text-sm md:text-base leading-relaxed text-theme-primary break-words">{children}</li>,
                // Blockquotes
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 glass-inset pl-4 py-2 my-3 italic text-theme-secondary rounded-r-lg">
                        {children}
                    </blockquote>
                ),
                code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                        return <code className="bg-white/10 text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono break-words whitespace-pre-wrap">{children}</code>;
                    }
                    return (
                        <code className="block bg-black/40 text-slate-200 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3 border border-white/5 whitespace-pre-wrap word-break shrink">
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => <pre className="my-0 w-full overflow-hidden shrink">{children}</pre>,
                // Links
                a: ({ href, children }) => (
                    <Link href={href || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        {children}
                    </Link>
                ),
                // Horizontal Rule
                hr: () => <hr className="my-4 border-white/10" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}


// ============================================================
// CHAT MESSAGE WITH STREAMING, MARKDOWN, AND TTS
// ============================================================
function ChatMessage({
    message,
    displayedContent,
    onSpeak,
    isSpeaking
}: {
    message: Message;
    displayedContent: string;
    onSpeak: (text: string) => void;
    isSpeaking: boolean;
}) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);

    // Parse content for GRAPH blocks (only for assistant messages)
    // Skip incomplete graph blocks during streaming
    const contentParts: ContentPart[] = isUser
        ? [{ type: 'text', content: displayedContent }]
        : parseGraphBlocks(displayedContent).filter(part => {
            // Filter out graph errors during streaming (incomplete blocks)
            if (part.type === 'graph' && part.error && message.isStreaming) {
                return false;
            }
            return true;
        });

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
        >
            <div className={`relative group max-w-[85%] md:max-w-[75%]`}>
                {/* Avatar for AI */}
                {!isUser && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                            <Image src="/T_logo.png" alt="Trendsta" width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-bold text-theme-muted">Trendsta AI</span>
                                {message.isStreaming && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                )}
                            </div>
                            <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                                {/* Render content parts (text with markdown and graphs) */}
                                {contentParts.map((part, index) => (
                                    <div key={index}>
                                        {part.type === 'text' && part.content && (
                                            <MarkdownContent content={part.content} />
                                        )}
                                        {part.type === 'graph' && part.spec && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <InlineChart spec={part.spec} />
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                                {/* Streaming cursor */}
                                {message.isStreaming && (
                                    <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5"></span>
                                )}
                            </div>
                            {/* Action buttons */}
                            {!message.isStreaming && (
                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                    <button
                                        onClick={() => onSpeak(message.content)}
                                        className={`p-1.5 rounded-lg transition-colors ${isSpeaking ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                        title={isSpeaking ? "Stop speaking" : "Read aloud"}
                                    >
                                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User message */}
                {isUser && (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg">
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{displayedContent}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ============================================================
// MAIN AI CONSULTANT PAGE
// ============================================================
export default function AIConsultantPage() {
    const { isCollapsed } = useSidebar();
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [displayedContents, setDisplayedContents] = useState<Record<number, string>>({});
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [thinkingMode, setThinkingMode] = useState<"fast" | "thinking" | "deep">("fast");
    const [showHistory, setShowHistory] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);

    // Voice states
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

    // Initial Data & Hooks
    const { planTier } = useUsage();
    const { data: researchData } = useResearch();

    // Fetch conversation history
    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/consultant/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Refresh history when chat starts (to show new chat)
    useEffect(() => {
        if (hasStartedChat && !chatId) {
            // We can't fetch immediately as ID isn't known until first message return usually.
            // But actually, handleSend sets chatId.
            const timer = setTimeout(fetchHistory, 2000);
            return () => clearTimeout(timer);
        }
    }, [hasStartedChat, chatId, fetchHistory]);

    // Load a specific conversation
    const loadConversation = async (id: string) => {
        if (id === chatId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/consultant/conversations/${id}`);
            if (res.ok) {
                const data = await res.json();

                // Transform backend messages to frontend format
                if (data.messages) {
                    const loadedMessages: Message[] = data.messages.map((m: any) => ({
                        id: new Date(m.createdAt).getTime(), // or use m.id if string is ok
                        role: m.role.toLowerCase(),
                        content: m.content
                    }));

                    setMessages(loadedMessages);
                    setChatId(id);
                    setHasStartedChat(true);

                    // Pre-fill displayed contents
                    const contents: Record<number, string> = {};
                    loadedMessages.forEach(m => {
                        contents[m.id] = m.content;
                    });
                    setDisplayedContents(contents);
                }
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        } finally {
            setIsLoading(false);
            if (window.innerWidth < 768) setShowHistory(false); // Close sidebar on mobile
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setDisplayedContents({});
        setChatId(null);
        setHasStartedChat(false);
        setInput("");
        if (window.innerWidth < 768) setShowHistory(false);
    };

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
    const userScrolledUpRef = useRef(false);

    // Smart scroll - only auto-scroll if user is at bottom
    const scrollToBottom = useCallback(() => {
        if (!userScrolledUpRef.current && chatContainerRef.current) {
            // Use scrollTop instead of scrollIntoView for more control
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    // Track user scroll to allow them to read while streaming
    const handleScroll = useCallback(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            // More sensitive threshold so if they scroll up even slightly, auto-scroll stops
            userScrolledUpRef.current = distanceFromBottom > 50;
        }
    }, []);

    // Auto-scroll when a new USER message is sent, but DO NOT force
    // scroll to bottom on every content tick, as it prevents reading from the top.
    useEffect(() => {
        // We only want to scroll to bottom automatically when we are not scrolling up
        // AND when it's a small update OR just before starting reading.
        // Actually, to keep user at top of the message to read down, we just remove the continuous auto-scroll 
        // to bottom that was happening on every chunk.
    }, [displayedContents]);

    // Force scroll to bottom only when user explicitly sends a message
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                userScrolledUpRef.current = false;
                scrollToBottom();
            }
        }
    }, [messages.length, scrollToBottom]);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Toggle speech recognition
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Text-to-speech
    const speak = useCallback((text: string, messageId?: number) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        if (isSpeaking && speakingMessageId === messageId) {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
            return;
        }

        // Strip markdown for cleaner speech
        const cleanText = text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/`{1,3}/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/```[\s\S]*?```/g, 'code block')
            .replace(/```GRAPH[\s\S]*?```/g, 'chart visualization');


        const utterance = new SpeechSynthesisUtterance(cleanText);
        //SPEAKING PACE HERE---------------------------------------------
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
        };

        synthRef.current = utterance;
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
        window.speechSynthesis.speak(utterance);
    }, [isSpeaking, speakingMessageId]);

    // Improved streaming effect - smooth word by word like Gemini
    const streamContent = useCallback((messageId: number, fullContent: string) => {
        // Parse content into segments that respect GRAPH blocks
        const segments: string[] = [];

        // Case-insensitive regex to find all graph blocks (```graph, ```GRAPH, or ```\nGRAPH)
        const graphRegex = /```[\r\n]*[Gg][Rr][Aa][Pp][Hh][\s\S]*?```/g;
        let lastIndex = 0;
        let match;

        while ((match = graphRegex.exec(fullContent)) !== null) {
            // Add text before graph as words
            if (match.index > lastIndex) {
                const textBefore = fullContent.substring(lastIndex, match.index);
                // Split by words but keep the spaces attached
                const words = textBefore.split(/(?<=\s)/).filter(w => w);
                segments.push(...words);
            }
            // Add entire graph block as single segment (marked for special handling)
            segments.push('__GRAPH_BLOCK__' + match[0]);
            lastIndex = match.index + match[0].length;
        }

        // Add remaining text as words
        if (lastIndex < fullContent.length) {
            const remainingText = fullContent.substring(lastIndex);
            const words = remainingText.split(/(?<=\s)/).filter(w => w);
            segments.push(...words);
        }

        let segmentIndex = 0;
        let currentContent = '';

        const stream = () => {
            if (segmentIndex < segments.length) {
                const currentSegment = segments[segmentIndex];

                // Check if this is a graph block (skip incomplete ones)
                if (currentSegment.startsWith('__GRAPH_BLOCK__')) {
                    // Add the graph block content (remove the marker)
                    currentContent += currentSegment.replace('__GRAPH_BLOCK__', '');
                    segmentIndex++;
                } else {
                    // Add 1 word per tick for a slower, ChatGPT-like reading speed
                    const wordsPerTick = 1;
                    for (let i = 0; i < wordsPerTick && segmentIndex < segments.length; i++) {
                        const seg = segments[segmentIndex];
                        if (seg.startsWith('__GRAPH_BLOCK__')) break;
                        currentContent += seg;
                        segmentIndex++;
                    }
                }

                setDisplayedContents(prev => ({
                    ...prev,
                    [messageId]: currentContent
                }));

                if (segmentIndex < segments.length) {
                    // ~20ms interval combined with 1 word per tick aligns closely with typical reading/generation speed
                    setTimeout(stream, 20);
                } else {
                    // Streaming complete
                    setMessages(prev => prev.map(m =>
                        m.id === messageId ? { ...m, isStreaming: false } : m
                    ));
                }
            }
        };

        stream();
    }, []);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        setHasStartedChat(true);

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: messageText,
        };
        setMessages((prev) => [...prev, userMessage]);
        setDisplayedContents(prev => ({ ...prev, [userMessage.id]: messageText }));
        setInput("");
        setIsLoading(true);

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        try {
            // Map UI mode to backend ModelMode
            const modelMode: 'fast' | 'thinking' | 'deep' =
                thinkingMode === 'fast' ? 'fast' :
                    thinkingMode === 'thinking' ? 'thinking' :
                        'deep';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    conversationId: chatId,
                    modelMode: modelMode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to get response');
            }

            const data = await response.json();

            if (data.conversationId && !chatId) {
                setChatId(data.conversationId);
            }

            const aiMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.message,
                isStreaming: true,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setDisplayedContents(prev => ({ ...prev, [aiMessage.id]: '' }));

            // Start streaming effect
            setTimeout(() => streamContent(aiMessage.id, data.message), 100);

        } catch (error) {
            console.error('Chat API error:', error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: `⚠️ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
            };
            setMessages((prev) => [...prev, errorMessage]);
            setDisplayedContents(prev => ({ ...prev, [errorMessage.id]: errorMessage.content }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSpeakMessage = (messageId: number) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            speak(message.content, messageId);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            {/* History Sidebar */}
            <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[var(--bg-primary)] border-l border-[var(--glass-border)] z-50 transform transition-transform duration-300 shadow-2xl ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <h3 className="font-bold text-theme-primary tracking-tight">Chat History</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={startNewChat}
                            className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="New Chat"
                        >
                            <Plus size={20} />
                        </button>
                        <button onClick={() => setShowHistory(false)} className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-65px)]">
                    <button
                        onClick={startNewChat}
                        className="w-full p-3 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg rounded-xl transition-all text-white group mb-4"
                    >
                        <Plus size={18} />
                        <span className="font-medium text-sm">New Chat</span>
                    </button>

                    {conversations.length === 0 ? (
                        <div className="text-center py-8 opacity-50">
                            <History size={32} className="mx-auto mb-2" />
                            <p className="text-sm">No history yet</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => loadConversation(conv.id)}
                                className={`p-3 rounded-xl cursor-pointer transition-all border group text-left ${chatId === conv.id
                                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                    : 'bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-hover)] border-[var(--glass-border)]'
                                    }`}
                            >
                                <p className={`text-sm font-semibold truncate ${chatId === conv.id ? 'text-blue-700 dark:text-blue-300' : 'text-theme-primary group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                    }`}>
                                    {conv.title || "Untitled Conversation"}
                                </p>
                                <p className="text-[10px] uppercase font-bold text-theme-muted tracking-wider mt-1">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <main
                className={`transition-all duration-300 ease-in-out flex flex-col relative h-[100dvh] ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}
            >
                {showHistory && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setShowHistory(false)}
                    />
                )}

                {/* Top Bar */}
                <div className="w-full max-w-4xl mx-auto flex flex-row-reverse items-center justify-between px-6 py-4 z-10 shrink-0">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View History"
                    >
                        <History size={20} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto flex flex-col">

                    {/* Landing State */}
                    <AnimatePresence>
                        {!hasStartedChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="flex flex-col items-center justify-center text-center px-4 w-full flex-1"
                            >
                                {/* Logo */}
                                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                                    <Image
                                        src="/T_logo.png"
                                        fill
                                        className="object-contain drop-shadow-xl"
                                        alt="Trendsta Logo"
                                    />
                                </div>

                                <p className="text-theme-secondary text-lg mb-2 max-w-md mx-auto">
                                    Your AI-powered content strategist. Ask me anything about reels, trends, and growth.
                                </p>

                                {researchData?.createdAt && (
                                    <div className="mb-8 max-w-md mx-auto">
                                        <p className="text-xs text-theme-muted bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10">
                                            📊 Results based on data from {new Date(researchData.createdAt).toLocaleDateString()}.
                                            <span className="opacity-70 ml-1">Analyse again for fresh results.</span>
                                        </p>
                                    </div>
                                )}

                                {/* Suggestions */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                                    {PROMPT_SUGGESTIONS.map((item, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            onClick={() => handleSend(item.prompt)}
                                            className="group glass-panel hover:bg-white/10 border-transparent hover:border-white/20 p-4 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                                                <item.icon size={16} className="text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-theme-secondary">{item.label}</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat */}
                    {hasStartedChat && (
                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 pb-32 overscroll-contain"
                        >
                            <div className="h-2" />

                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    displayedContent={displayedContents[message.id] || message.content}
                                    onSpeak={() => handleSpeakMessage(message.id)}
                                    isSpeaking={speakingMessageId === message.id}
                                />
                            ))}

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Image src="/T_logo.png" alt="Trendsta" width={24} height={24} />
                                        </div>
                                        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-2">
                                            <span className="text-sm text-theme-muted">
                                                {thinkingMode === 'fast'
                                                    ? 'Thinking...'
                                                    : thinkingMode === 'thinking'
                                                        ? 'Reasoning...'
                                                        : 'Deep researching...'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="w-full max-w-4xl mx-auto z-20 px-4 md:px-6 shrink-0 pb-4 pt-2">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 p-2 rounded-2xl flex items-center gap-2">

                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Trendsta anything..."
                            className="flex-1 bg-transparent outline-none text-base p-3 min-h-[48px] max-h-[120px] resize-none"
                        />

                        <button
                            onClick={toggleListening}
                            className={`p-2.5 rounded-xl ${isListening ? 'bg-red-500 text-white' : 'text-theme-muted'}`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="p-2.5 rounded-xl bg-blue-600 text-white"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex justify-center mt-3 gap-1.5">
                        {/* Fast */}
                        <button
                            onClick={() => setThinkingMode('fast')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${thinkingMode === 'fast'
                                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-sm'
                                : 'text-theme-muted hover:text-theme-primary hover:bg-white/5'
                                }`}
                            title="Fast — 1 Stella per message"
                        >
                            <Zap size={13} className={thinkingMode === 'fast' ? 'text-amber-400' : ''} />
                            Fast
                            <span className={`text-[10px] px-1 py-0.5 rounded-md font-mono ${thinkingMode === 'fast' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-theme-muted'}`}>1✦</span>
                        </button>

                        <div className="w-px bg-white/10 self-stretch my-1" />

                        {/* Thinking */}
                        <button
                            onClick={() => setThinkingMode('thinking')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${thinkingMode === 'thinking'
                                ? 'bg-violet-500/15 border border-violet-500/40 text-violet-400 shadow-sm'
                                : 'text-theme-muted hover:text-theme-primary hover:bg-white/5'
                                }`}
                            title="Thinking — 2 Stellas per message"
                        >
                            <BrainCircuit size={13} className={thinkingMode === 'thinking' ? 'text-violet-400' : ''} />
                            Thinking
                            <span className={`text-[10px] px-1 py-0.5 rounded-md font-mono ${thinkingMode === 'thinking' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-theme-muted'}`}>2✦</span>
                        </button>

                        <div className="w-px bg-white/10 self-stretch my-1" />

                        {/* Deep Research */}
                        <div className="relative group/deep">
                            <button
                                onClick={() => { if (planTier >= 3) setThinkingMode('deep'); }}
                                disabled={planTier < 3}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${planTier < 3
                                    ? 'opacity-40 cursor-not-allowed text-theme-muted'
                                    : thinkingMode === 'deep'
                                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-sm'
                                        : 'text-theme-muted hover:text-theme-primary hover:bg-white/5'
                                    }`}
                                title={planTier < 3 ? 'Requires Platinum Plan' : 'Deep Research — 4 Stellas per message'}
                            >
                                <Sparkles size={13} className={thinkingMode === 'deep' && planTier >= 3 ? 'text-cyan-400' : ''} />
                                Deep Research
                                {planTier >= 3 ? (
                                    <span className={`text-[10px] px-1 py-0.5 rounded-md font-mono ${thinkingMode === 'deep' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-theme-muted'}`}>4✦</span>
                                ) : (
                                    <span className="text-[10px] px-1 py-0.5 rounded-md bg-white/5 text-theme-muted">🔒</span>
                                )}
                            </button>
                            {planTier < 3 && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/90 text-white text-[10px] rounded-lg opacity-0 group-hover/deep:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                    🔒 Requires Platinum Plan
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

