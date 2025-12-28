"use client"

import { useState } from "react" // Removed unused imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Removed unused CardDescription
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Dumbbell, Award, Flame } from "lucide-react"

const initialPosts = [
    {
        id: 1,
        user: "Sarah Connor",
        avatar: "SC",
        action: "crushed a 5k Run",
        time: "2m ago",
        likes: 12,
        comments: 3,
        type: "workout",
        detail: "24:30 time • 5:00 min/km pace"
    },
    {
        id: 2,
        user: "John Wick",
        avatar: "JW",
        action: "finished 'High Intensity Interval'",
        time: "15m ago",
        likes: 24,
        comments: 5,
        type: "workout",
        detail: "450 kcals burned • 160bpm max HR"
    },
    {
        id: 3,
        user: "Diana Prince",
        avatar: "DP",
        action: "earned 'Early Bird' badge",
        time: "1h ago",
        likes: 8,
        comments: 0,
        type: "achievement",
        detail: "Completed 5 workouts before 7AM"
    },
]

export function SocialFeed() {
    const [posts, setPosts] = useState(initialPosts)
    const [likedPosts, setLikedPosts] = useState<number[]>([])

    const handleLike = (id: number) => {
        if (likedPosts.includes(id)) {
            setLikedPosts(prev => prev.filter(postId => postId !== id))
            setPosts(prev => prev.map(post => post.id === id ? { ...post, likes: post.likes - 1 } : post))
        } else {
            setLikedPosts(prev => [...prev, id])
            setPosts(prev => prev.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post))
        }
    }

    return (
        <Card className="glass border-white/5 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    Live Activity Feed
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {posts.map((post) => (
                    <div key={post.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarFallback className="bg-white/10 text-white">{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white text-sm">{post.user}</h4>
                                <span className="text-xs text-muted-foreground">{post.time}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">
                                {post.action}
                            </p>

                            {post.detail && (
                                <div className="mt-2 text-xs bg-black/20 rounded-lg p-2 text-primary/80 font-mono inline-block">
                                    {post.type === "workout" ? <Dumbbell className="h-3 w-3 inline mr-1" /> : <Award className="h-3 w-3 inline mr-1" />}
                                    {post.detail}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 gap-1.5 ${likedPosts.includes(post.id) ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-white"}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                                    <span className="text-xs">{post.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-white">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-xs">{post.comments}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-white ml-auto">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
