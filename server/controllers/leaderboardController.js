const User = require('../models/User');
const Challenge = require('../models/Challenge');

/**
 * Get global leaderboard (The Syndicate)
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const { sortBy = 'points', limit = 50 } = req.query;

    const sortOptions = {};
    sortOptions[sortBy] = -1; // Descending order

    const leaderboard = await User.find()
      .select('name level points dailyScore totalCarbonFootprint university badges')
      .sort(sortOptions)
      .limit(parseInt(limit));

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      level: user.level,
      points: user.points,
      dailyScore: user.dailyScore,
      totalCarbonFootprint: user.totalCarbonFootprint,
      university: user.university,
      badges: user.badges
    }));

    res.json({
      success: true,
      data: leaderboardWithRank
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's rank
 */
exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count users with more points
    const usersAbove = await User.countDocuments({
      points: { $gt: user.points }
    });

    const rank = usersAbove + 1;

    res.json({
      success: true,
      data: {
        name: user.name,
        rank,
        level: user.level,
        points: user.points,
        nextLevelRequirement: (user.level * 100) + 100,
        pointsForNextLevel: Math.max(0, ((user.level * 100) + 100) - user.points)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get active challenges (The Syndicate challenges)
 */
exports.getActiveChallenges = async (req, res) => {
  try {
    const today = new Date();

    const challenges = await Challenge.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).select('name description category difficulty pointsReward targetValue startDate endDate');

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Join a challenge
 */
exports.joinChallenge = async (req, res) => {
  try {
    const { challengeId, userId } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if user already joined
    const alreadyJoined = challenge.participants.some(p => p.userId.toString() === userId);
    if (alreadyJoined) {
      return res.status(400).json({ error: 'User already joined this challenge' });
    }

    challenge.participants.push({
      userId,
      progress: 0,
      completed: false
    });

    await challenge.save();

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      data: challenge
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get university leaderboard
 */
exports.getUniversityLeaderboard = async (req, res) => {
  try {
    const { university, limit = 30 } = req.query;

    const leaderboard = await User.find({ university })
      .select('name level points dailyScore totalCarbonFootprint badges')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      level: user.level,
      points: user.points,
      dailyScore: user.dailyScore,
      totalCarbonFootprint: user.totalCarbonFootprint,
      badges: user.badges
    }));

    res.json({
      success: true,
      university,
      data: leaderboardWithRank
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get department leaderboard
 */
exports.getDepartmentLeaderboard = async (req, res) => {
  try {
    const { department, limit = 30 } = req.query;

    const leaderboard = await User.find({ department })
      .select('name level points dailyScore totalCarbonFootprint badges')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      level: user.level,
      points: user.points,
      dailyScore: user.dailyScore,
      totalCarbonFootprint: user.totalCarbonFootprint,
      badges: user.badges
    }));

    res.json({
      success: true,
      department,
      data: leaderboardWithRank
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
