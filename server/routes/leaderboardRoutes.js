const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

/**
 * GET /api/leaderboard
 * Get global leaderboard (The Syndicate)
 */
router.get('/', leaderboardController.getLeaderboard);

/**
 * GET /api/leaderboard/rank/:userId
 * Get user's rank
 */
router.get('/rank/:userId', leaderboardController.getUserRank);

/**
 * GET /api/leaderboard/university
 * Get university leaderboard
 */
router.get('/university', leaderboardController.getUniversityLeaderboard);

/**
 * GET /api/leaderboard/department
 * Get department leaderboard
 */
router.get('/department', leaderboardController.getDepartmentLeaderboard);

/**
 * GET /api/leaderboard/challenges/active
 * Get active challenges
 */
router.get('/challenges/active', leaderboardController.getActiveChallenges);

/**
 * POST /api/leaderboard/challenges/join
 * Join a challenge
 */
router.post('/challenges/join', leaderboardController.joinChallenge);

module.exports = router;
