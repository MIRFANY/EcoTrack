import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const carbonAPI = {
  logActivity: (data) => axios.post(`${API_BASE_URL}/carbon/log`, data),
  getHistory: (userId, days = 30) => axios.get(`${API_BASE_URL}/carbon/history/${userId}?days=${days}`),
  getTodayFootprint: (userId) => axios.get(`${API_BASE_URL}/carbon/today/${userId}`),
  getStats: (userId) => axios.get(`${API_BASE_URL}/carbon/stats/${userId}`)
};

export const leaderboardAPI = {
  getGlobalLeaderboard: (sortBy = 'points', limit = 50) => 
    axios.get(`${API_BASE_URL}/leaderboard?sortBy=${sortBy}&limit=${limit}`),
  getUserRank: (userId) => axios.get(`${API_BASE_URL}/leaderboard/rank/${userId}`),
  getUniversityLeaderboard: (university, limit = 30) => 
    axios.get(`${API_BASE_URL}/leaderboard/university?university=${university}&limit=${limit}`),
  getDepartmentLeaderboard: (department, limit = 30) => 
    axios.get(`${API_BASE_URL}/leaderboard/department?department=${department}&limit=${limit}`),
  getActiveChallenges: () => axios.get(`${API_BASE_URL}/leaderboard/challenges/active`),
  joinChallenge: (challengeId, userId) => 
    axios.post(`${API_BASE_URL}/leaderboard/challenges/join`, { challengeId, userId })
};
