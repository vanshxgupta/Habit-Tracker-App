const mongoose = require("mongoose")

const HabitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily",
  },
  category: {
    type: String,
    trim: true,
  },
  completions: [
    {
      date: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: true,
      },
    },
  ],
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Calculate streaks before saving
HabitSchema.pre("save", function (next) {
  if (this.isModified("completions")) {
    this.calculateStreaks()
  }
  next()
})

// Method to calculate current and longest streaks
HabitSchema.methods.calculateStreaks = function () {
  const sortedCompletions = this.completions
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()

  if (sortedCompletions.length === 0) {
    this.currentStreak = 0
    return
  }

  let currentStreak = 1
  let maxStreak = 1
  let streakDates = [sortedCompletions[0]]

  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = new Date(sortedCompletions[i - 1])
    const currDate = new Date(sortedCompletions[i])

    // For daily habits
    if (this.frequency === "daily") {
      const diffTime = Math.abs(currDate - prevDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
        streakDates.push(sortedCompletions[i])
      } else if (diffDays > 1) {
        // Check if the current date is today or yesterday
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const isRecentCompletion = currDate.getTime() === today.getTime() || currDate.getTime() === yesterday.getTime()

        if (isRecentCompletion) {
          currentStreak = 1
          streakDates = [sortedCompletions[i]]
        } else {
          currentStreak = 0
          streakDates = []
        }
      }
    }
    // For weekly habits
    else if (this.frequency === "weekly") {
      const prevWeek = getWeekNumber(prevDate)
      const currWeek = getWeekNumber(currDate)

      if (
        (currWeek[0] === prevWeek[0] && currWeek[1] === prevWeek[1] + 1) ||
        (currWeek[0] === prevWeek[0] + 1 && prevWeek[1] === 52 && currWeek[1] === 1)
      ) {
        currentStreak++
        streakDates.push(sortedCompletions[i])
      } else if (currWeek[1] !== prevWeek[1] || currWeek[0] !== prevWeek[0]) {
        // Check if the current week is this week or last week
        const today = new Date()
        const thisWeek = getWeekNumber(today)

        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastWeekNum = getWeekNumber(lastWeek)

        const isRecentCompletion =
          (currWeek[0] === thisWeek[0] && currWeek[1] === thisWeek[1]) ||
          (currWeek[0] === lastWeekNum[0] && currWeek[1] === lastWeekNum[1])

        if (isRecentCompletion) {
          currentStreak = 1
          streakDates = [sortedCompletions[i]]
        } else {
          currentStreak = 0
          streakDates = []
        }
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak)
  }

  // Check if the streak is still active
  const lastCompletionDate = new Date(sortedCompletions[sortedCompletions.length - 1])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (this.frequency === "daily") {
    const isActive =
      lastCompletionDate.getTime() === today.getTime() || lastCompletionDate.getTime() === yesterday.getTime()

    if (!isActive) {
      currentStreak = 0
    }
  } else if (this.frequency === "weekly") {
    const lastCompletionWeek = getWeekNumber(lastCompletionDate)
    const thisWeek = getWeekNumber(today)
    const lastWeek = getWeekNumber(new Date(today.setDate(today.getDate() - 7)))

    const isActive =
      (lastCompletionWeek[0] === thisWeek[0] && lastCompletionWeek[1] === thisWeek[1]) ||
      (lastCompletionWeek[0] === lastWeek[0] && lastCompletionWeek[1] === lastWeek[1])

    if (!isActive) {
      currentStreak = 0
    }
  }

  this.currentStreak = currentStreak
  this.longestStreak = maxStreak
}

// Helper function to get week number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return [d.getUTCFullYear(), weekNo]
}

module.exports = mongoose.model("Habit", HabitSchema)

