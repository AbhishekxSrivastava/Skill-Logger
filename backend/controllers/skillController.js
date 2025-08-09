// controllers/skillController.js
import Skill from "../models/Skill.js";

// @desc    Log a new skill
// @route   POST /api/skills/log
// @access  Private
export const logSkill = async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ error: "Title and duration are required" });
  }

  try {
    const skill = await Skill.create({
      user: req.user._id,
      title,
      description,
      duration,
    });

    res.status(201).json({
      message: "Skill logged successfully",
      skill,
    });
  } catch (error) {
    console.error("Log Skill Error:", error.message);
    res.status(500).json({ error: "Failed to log skill" });
  }
};

// @desc    Get all skills for logged-in user
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(skills);
  } catch (error) {
    console.error("Get Skills Error:", error.message);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
};


// Update Skill Log
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });

    if (!skill) return res.status(404).json({ error: 'Skill not found' });

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ message: 'Skill updated', skill: updatedSkill });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Skill Log
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!skill) return res.status(404).json({ error: 'Skill not found' });

    res.status(200).json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Get Stats (Weekly & Monthly)
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const weeklyLogs = await Skill.find({
      user: userId,
      createdAt: { $gte: lastWeek },
    });

    const monthlyLogs = await Skill.find({
      user: userId,
      createdAt: { $gte: lastMonth },
    });

    res.status(200).json({
      weeklyCount: weeklyLogs.length,
      monthlyCount: monthlyLogs.length,
      weeklyTopics: [...new Set(weeklyLogs.map((log) => log.title))],
      monthlyTopics: [...new Set(monthlyLogs.map((log) => log.title))],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
