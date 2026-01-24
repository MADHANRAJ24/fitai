"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { ActivityService } from "@/services/activity-service"

export function OverviewChart() {
    const [data, setData] = useState<{ name: string; total: number }[]>([])

    useEffect(() => {
        const loadData = () => {
            const activities = ActivityService.getActivities()

            // Initialize last 6 months
            const months: string[] = []
            for (let i = 5; i >= 0; i--) {
                const d = new Date()
                d.setMonth(d.getMonth() - i)
                months.push(d.toLocaleString("default", { month: "short" }))
            }

            // Aggregate Data
            const chartData = months.map(month => {
                const total = activities
                    .filter(a => {
                        const activityDate = new Date(a.timestamp || a.date)
                        return activityDate.toLocaleString("default", { month: "short" }) === month
                    })
                    .reduce((sum, curr) => sum + curr.calories, 0)

                return { name: month, total }
            })

            setData(chartData)
        }

        loadData()
        window.addEventListener("activity_logged", loadData)
        window.addEventListener("storage_restored", loadData) // Also listen for sync
        return () => {
            window.removeEventListener("activity_logged", loadData)
            window.removeEventListener("storage_restored", loadData)
        }
    }, [])

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={1} />
                            <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}
                    />
                    <Bar
                        dataKey="total"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
