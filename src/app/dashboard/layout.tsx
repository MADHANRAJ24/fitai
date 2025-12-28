import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import DashboardShell from "@/components/layout/dashboard-shell"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen bg-black">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block fixed left-0 top-0 bottom-0 z-50">
                <Sidebar />
            </div>

            {/* Mobile Bottom Nav (Hidden on Desktop) */}
            <MobileNav />

            {/* Main Content Area */}
            <div className="md:pl-64 pb-20 md:pb-0">
                <DashboardShell>{children}</DashboardShell>
            </div>
        </div>
    )
}
