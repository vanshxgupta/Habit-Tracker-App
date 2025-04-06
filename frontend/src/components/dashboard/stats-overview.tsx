"use client"

import { useHabits } from "@/src/contexts/habit-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle, Calendar, Award, TrendingUp } from "lucide-react"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

export default function StatsOverview() {
  const { habits, loading, getCompletionStats } = useHabits()

  const stats = getCompletionStats()

  // Prepare data for charts
  const habitsByStreak = [...habits].sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 5)

  const streakData = habitsByStreak.map((habit) => ({
    name: habit.title.length > 15 ? habit.title.substring(0, 15) + "..." : habit.title,
    streak: habit.currentStreak,
    best: habit.longestStreak,
  }))

  const categoryData = habits.reduce(
    (acc, habit) => {
      const category = habit.category || "Uncategorized"
      const existing = acc.find((item) => item.name === category)

      if (existing) {
        existing.count += 1
      } else {
        acc.push({ name: category, count: 1 })
      }

      return acc
    },
    [] as { name: string; count: number }[],
  )

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h3 className="mb-2 text-xl font-semibold">No statistics available</h3>
          <p className="text-center text-muted-foreground">Add habits to see your statistics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.dailyHabits} daily, {stats.weeklyHabits} weekly
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.completed} completions this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak)) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Longest consecutive completions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.filter((h) => h.currentStreak > 0).length}</div>
            <p className="text-xs text-muted-foreground">Habits with ongoing streaks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="streaks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="streaks">Top Streaks</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="streaks">
          <Card>
            <CardHeader>
              <CardTitle>Top Habit Streaks</CardTitle>
              <CardDescription>Your habits with the longest current streaks</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={streakData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="streak" name="Current Streak" fill="hsl(var(--primary))" />
                  <Bar dataKey="best" name="Best Streak" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Habits by Category</CardTitle>
              <CardDescription>Distribution of your habits across categories</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Number of Habits" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

