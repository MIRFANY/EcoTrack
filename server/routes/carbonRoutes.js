const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbonController');

/**
 * POST /api/carbon/log
 * Log daily activities and calculate carbon footprint
 */
router.post('/log', carbonController.logDailyActivity);

/**
 * GET /api/carbon/history/:userId
 * Get user's carbon footprint history
 */
router.get('/history/:userId', carbonController.getUserFootprintHistory);

/**
 * GET /api/carbon/today/:userId
 * Get today's carbon footprint
 */
router.get('/today/:userId', carbonController.getTodayFootprint);

/**
 * GET /api/carbon/stats/:userId
 * Get user statistics
 */
router.get('/stats/:userId', carbonController.getUserStats);

module.exports = router;
