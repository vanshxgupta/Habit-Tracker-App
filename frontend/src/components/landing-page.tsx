import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { CheckCircle, TrendingUp, Calendar, BarChart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span>HabitTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="shadow-md hover:shadow-lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="container py-16 text-center md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Build better habits, achieve your goals
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Track your daily habits, build consistency, and visualize your progress with our powerful habit tracking app.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto shadow-md">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16 md:py-24 lg:py-32">
          <div className="mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CheckCircle,
                title: "Track Daily Habits",
                description: "Create and track your daily and weekly habits with ease.",
              },
              {
                icon: TrendingUp,
                title: "Build Streaks",
                description: "Stay motivated by tracking your current and longest streaks.",
              },
              {
                icon: Calendar,
                title: "Calendar View",
                description: "Visualize your habit completion with an interactive calendar.",
              },
              {
                icon: BarChart,
                title: "Detailed Analytics",
                description: "Get insights into your habit performance with detailed statistics.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl border p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <Icon className="h-12 w-12 text-primary mb-2" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-16 text-center md:py-24 lg:py-32">
          <div className="container space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to build better habits?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              Join thousands of users who are transforming their lives one habit at a time.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="mt-2 shadow-md hover:shadow-lg">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>HabitTracker</span>
          </div>
          <p>&copy; {new Date().getFullYear()} HabitTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
