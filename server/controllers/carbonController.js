const DailyLog = require('../models/DailyLog');
const User = require('../models/User');
const { calculateDailyFootprint, calculateSustainabilityScore } = require('../utils/carbonCalculator');

/**
 * Log daily activities and calculate carbon footprint
 */
exports.logDailyActivity = async (req, res) => {
  try {
    const { userId, transportation, meals, digitalWaste } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate carbon footprint
    const footprintData = calculateDailyFootprint({
      transportation,
      meals,
      digitalWaste
    });

    // Create daily log
    const dailyLog = new DailyLog({
      userId,
      transportation,
      meals,
      digitalWaste,
      totalCarbonForDay: footprintData.totalEmissions
    });

    await dailyLog.save();

    // Update user's total carbon footprint and daily score
    user.totalCarbonFootprint += footprintData.totalEmissions;
    user.dailyScore = calculateSustainabilityScore(footprintData.totalEmissions);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Daily activity logged successfully',
      data: {
        dailyLog,
        footprint: footprintData,
        sustainabilityScore: user.dailyScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's carbon footprint history
 */
exports.getUserFootprintHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query; // Default last 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await DailyLog.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: logs,
      summary: {
        totalLogs: logs.length,
        averageDailyEmissions: logs.length > 0 
          ? (logs.reduce((sum, log) => sum + log.totalCarbonForDay, 0) / logs.length).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get today's carbon footprint
 */
exports.getTodayFootprint = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLog = await DailyLog.findOne({
      userId,
      createdAt: { $gte: today }
    });

    if (!todayLog) {
      return res.json({
        success: true,
        data: null,
        message: 'No activity logged today'
      });
    }

    res.json({
      success: true,
      data: todayLog
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user statistics
 */
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const logs = await DailyLog.find({ userId });

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          level: user.level,
          points: user.points,
          dailyScore: user.dailyScore
        },
        statistics: {
          totalCarbonFootprint: user.totalCarbonFootprint,
          totalDaysLogged: logs.length,
          averageDailyEmissions: logs.length > 0 
            ? (logs.reduce((sum, log) => sum + log.totalCarbonForDay, 0) / logs.length).toFixed(2)
            : 0,
          lowestEmissionDay: logs.length > 0 
            ? Math.min(...logs.map(log => log.totalCarbonForDay)).toFixed(2)
            : 0,
          highestEmissionDay: logs.length > 0 
            ? Math.max(...logs.map(log => log.totalCarbonForDay)).toFixed(2)
            : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
