import { CalendarTimeline } from "@/components/calendar-timeline"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 md:py-6 pb-24 md:pb-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-balance">Figure Collection</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Manage your reservations and purchases</p>
        </div>
        <CalendarTimeline />
      </main>
      <BottomNav />
    </div>
  )
}
