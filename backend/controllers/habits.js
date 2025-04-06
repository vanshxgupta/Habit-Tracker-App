const Habit = require("../models/Habit")

exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id })
    res.status(200).json(habits)
  } catch (error) {
    next(error)
  }
}

exports.getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id)

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" })
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this habit" })
    }

    res.status(200).json(habit)
  } catch (error) {
    next(error)
  }
}

exports.createHabit = async (req, res, next) => {
  try {
    req.body.user = req.user.id

    const habit = await Habit.create(req.body)
    res.status(201).json(habit)
  } catch (error) {
    next(error)
  }
}

exports.updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id)

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" })
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this habit" })
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(habit)
  } catch (error) {
    next(error)
  }
}

exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id)

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" })
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this habit" })
    }

    await habit.deleteOne() // ✅ Proper deletion
    res.status(200).json({ message: "Habit deleted successfully" })
  } catch (error) {
    next(error)
  }
}

exports.markHabitCompletion = async (req, res, next) => {
  try {
    const { date, completed } = req.body

    if (!date) {
      return res.status(400).json({ message: "Please provide a date" })
    }

    const habit = await Habit.findById(req.params.id)

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" })
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this habit" })
    }

    const existingCompletion = habit.completions.find((c) => c.date === date)

    if (existingCompletion) {
      existingCompletion.completed = completed
    } else {
      habit.completions.push({ date, completed })
    }

    await habit.save()
    res.status(200).json(habit)
  } catch (error) {
    next(error)
  }
}
