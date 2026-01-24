"use client"

import * as React from "react"
import { Send, User as UserIcon, Loader2, Sparkles, Trash2, Bot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIService, Persona, AIChatMessage } from "@/services/ai-service"
import { STORAGE_KEYS } from "@/services/user-storage-service"
import { useSensory } from "@/hooks/use-sensory"
import { motion, AnimatePresence } from "framer-motion"

export function ChatInterface() {
    const [messages, setMessages] = React.useState<AIChatMessage[]>([])
    const [input, setInput] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [persona, setPersona] = React.useState<Persona>('supportive')
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    // Load History on Mount
    React.useEffect(() => {
        const savedChat = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
        if (savedChat) {
            try {
                setMessages(JSON.parse(savedChat))
            } catch (e) {
                console.error("Failed to parse chat history")
            }
        } else {
            setMessages([{
                id: 'init',
                role: 'assistant',
                content: "System Online. I am FitAI. Select your preferred coaching protocol below.",
                timestamp: Date.now()
            }])
        }
    }, [])

    const { triggerFeedback } = useSensory()

    // Save History on Update
    React.useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages))
        }
    }, [messages])

    // Auto-scroll
    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages])

    const handleClearChat = () => {
        if (confirm("Purge mission logs?")) {
            setMessages([{
                id: Date.now().toString(),
                role: 'assistant',
                content: "Memory purged. Ready for new instructions.",
                timestamp: Date.now()
            }])
            localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY)
            triggerFeedback("error")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        triggerFeedback("click")

        const userMsg: AIChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        // Artificial delay for "thinking" feel if response is too fast
        const startTime = Date.now()

        const aiResponseText = await AIService.generateResponse(userMsg.content, persona)

        // Ensure at least 600ms delay for UI feel
        const elapsed = Date.now() - startTime
        if (elapsed < 600) await new Promise(r => setTimeout(r, 600 - elapsed))

        const aiMsg: AIChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponseText,
            timestamp: Date.now()
        }
        setMessages(prev => [...prev, aiMsg])
        setIsLoading(false)
        triggerFeedback("success")
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1 }
    }

    return (
        <Card className="glass-panel flex flex-col h-[650px] border-white/5 overflow-hidden shadow-2xl relative">
            {/* Header / Persona Selector */}
            <div className="p-4 border-b border-white/10 bg-black/60 backdrop-blur-xl flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
                    </div>
                    <div>
                        <span className="font-heading text-lg font-black text-white tracking-widest uppercase block leading-none">NEURAL.LINK</span>
                        <span className="text-[10px] text-primary font-mono uppercase tracking-[0.2em] opacity-70">Status: Active</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select value={persona} onValueChange={(v: Persona) => setPersona(v)}>
                        <SelectTrigger className="w-[140px] h-9 text-[10px] bg-white/5 border-white/10 text-white font-black uppercase tracking-wider rounded-xl">
                            <SelectValue placeholder="Protocol" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
                            <SelectItem value="supportive">Supportive</SelectItem>
                            <SelectItem value="drill-sergeant">Drill Sergeant</SelectItem>
                            <SelectItem value="analytical">Analytical</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all" onClick={handleClearChat}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardContent className="flex-1 p-0 flex flex-col h-full overflow-hidden relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 relative z-10">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-auto text-center text-muted-foreground opacity-50 space-y-4 mt-32">
                                <div className="h-16 w-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center animate-spin-slow">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase">Initializing secure channel...</p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                variants={item}
                                layout
                                className={cn(
                                    "flex gap-4 group",
                                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <Avatar className={cn(
                                    "h-10 w-10 border-2 transition-transform group-hover:scale-110",
                                    message.role === "assistant" ? "border-primary/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-white/10"
                                )}>
                                    <AvatarFallback className={cn("text-xs font-black", message.role === "assistant" ? "bg-black text-primary font-heading" : "bg-white text-black")}>
                                        {message.role === "user" ? <UserIcon className="h-5 w-5" /> : "AI"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    "rounded-[1.5rem] px-5 py-4 max-w-[85%] text-sm leading-relaxed shadow-2xl relative backdrop-blur-xl overflow-hidden",
                                    message.role === "user"
                                        ? "bg-primary/20 text-white border border-primary/30 rounded-tr-none"
                                        : "bg-white/[0.03] text-gray-100 border border-white/10 rounded-tl-none font-medium"
                                )}>
                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                    {/* Tech corner accents */}
                                    <div className={cn("absolute w-3 h-3 border-t-2 border-l-2 opacity-50", message.role === "user" ? "border-primary top-0 right-0" : "border-primary top-0 left-0")} />

                                    {message.content}

                                    <div className="text-[9px] text-white/30 mt-3 font-mono text-right font-black tracking-widest uppercase">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • MISSION LOG
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <Avatar className="h-10 w-10 border-2 border-primary/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <AvatarFallback className="bg-black text-primary text-xs font-black font-heading">AI</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-2 bg-white/[0.03] rounded-[1.5rem] px-6 py-4 h-12 border border-white/10 backdrop-blur-xl">
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-primary" />
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </ScrollArea>

                <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-3xl relative z-20">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[8px] font-mono text-primary/50 uppercase tracking-[0.3em] font-black">Secure Link: Active</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">Channel_ID: 0x7F4A</span>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-3 relative"
                    >
                        <div className="flex-1 relative group">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-mono"
                                placeholder="TRANSMIT COORDINATES..."
                            />
                            <div className="absolute top-0 left-0 w-full h-full rounded-2xl border border-primary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity animate-pulse-slow" />
                        </div>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1.5 top-1.5 bottom-1.5 h-auto w-12 bg-primary text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                    <div className="mt-3 flex gap-4 overflow-x-auto no-scrollbar pb-1">
                        {["Protocol: Morning Ritual", "Core Status", "Dietary Scan"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => { setInput(tag); triggerFeedback("click"); }}
                                className="whitespace-nowrap text-[9px] font-mono text-white/30 hover:text-primary hover:bg-primary/5 border border-white/5 px-3 py-1.5 rounded-lg transition-all"
                            >
                                {">"} {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
