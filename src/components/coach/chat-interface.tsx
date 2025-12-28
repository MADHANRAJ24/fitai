"use client"

import * as React from "react"
// import { useChat } from "ai/react" // Uncomment for Real AI
import { Send, User as UserIcon, Loader2, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "ai"
    content: string
}

export function ChatInterface() {
    // const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' }) // Uncomment for Real

    // Mock State
    const [messages, setMessages] = React.useState<Message[]>([
        { id: '1', role: 'ai', content: "Hello! I'm your AI fitness coach. I can help with workouts, diet, and recovery." }
    ])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    const handleMockSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        // Simulate AI
        setTimeout(() => {
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: "That's a great goal! I've logged that for you. Anything else?" }
            setMessages(prev => [...prev, aiMsg])
            setIsLoading(false)
        }, 1500)
    }

    return (
        <Card className="glass flex flex-col h-[600px] border-white/5">
            <CardContent className="flex-1 p-0 flex flex-col h-full">
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-50 space-y-2 mt-20">
                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin-slow" />
                                </div>
                                <p>Ask me anything about your fitness...</p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-3 mb-4",
                                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarFallback className={message.role === "user" ? "bg-primary text-black" : "bg-blue-600 text-white"}>
                                        {message.role === "user" ? <UserIcon className="h-4 w-4" /> : "AI"}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-2 max-w-[80%] text-sm",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-white/10 text-white"
                                    )}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-1 bg-white/10 rounded-2xl px-4 py-2 h-9">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <form
                        onSubmit={handleMockSubmit}
                        className="flex items-center gap-2"
                    >
                        <Button type="button" size="icon" variant="ghost" className="text-muted-foreground hover:text-white">
                            <Mic className="h-5 w-5" />
                        </Button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                            placeholder="Type your message... (Real AI requires API Key)"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="neon"
                            disabled={isLoading || !input.trim()}
                            className="rounded-full"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
