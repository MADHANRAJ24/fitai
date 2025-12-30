import { AdBanner } from "@/components/features/ad-banner"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none fixed" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none fixed" />

            <div className="ml-0 lg:ml-64 p-8">
                {children}
                <AdBanner />
            </div>
        </div>
    )
}
