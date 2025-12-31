import React, { useState, useEffect } from "react";
import { leaderboardAPI } from "../utils/api";

const Leaderboard = ({ userId, filterType = "global", filterValue = null }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("points");

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType, filterValue, sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let response;

      switch (filterType) {
        case "university":
          response = await leaderboardAPI.getUniversityLeaderboard(filterValue);
          break;
        case "department":
          response = await leaderboardAPI.getDepartmentLeaderboard(filterValue);
          break;
        default:
          response = await leaderboardAPI.getGlobalLeaderboard(sortBy);
      }

      setLeaderboard(response.data.data);

      // Fetch user's rank
      if (userId) {
        const rankResponse = await leaderboardAPI.getUserRank(userId);
        setUserRank(rankResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">⏳ Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-700">
          🏆 The Syndicate Leaderboard
        </h2>
        {filterType === "global" && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="points">Sort by Points</option>
            <option value="level">Sort by Level</option>
            <option value="dailyScore">Sort by Daily Score</option>
          </select>
        )}
      </div>

      {/* User's Current Rank */}
      {userRank && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Your Rank</p>
              <p className="text-4xl font-bold text-green-700">
                #{userRank.rank}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Level</p>
              <p className="text-4xl font-bold text-blue-700">
                {userRank.level}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Points</p>
              <p className="text-3xl font-bold text-purple-700">
                {userRank.points}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Next Level</p>
              <p className="text-lg font-semibold text-gray-700">
                {userRank.pointsForNextLevel} points away
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Rank</th>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-center font-semibold">Level</th>
              <th className="px-6 py-4 text-center font-semibold">Points</th>
              <th className="px-6 py-4 text-center font-semibold">
                Daily Score
              </th>
              <th className="px-6 py-4 text-center font-semibold">
                Total Carbon
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={index}
                className={`border-b transition ${
                  user.rank === userRank?.rank
                    ? "bg-green-50"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                } hover:bg-yellow-50`}
              >
                <td className="px-6 py-4 font-bold text-lg">
                  {user.rank === 1 && "🥇"}
                  {user.rank === 2 && "🥈"}
                  {user.rank === 3 && "🥉"}
                  {user.rank > 3 && "  "}#{user.rank}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.badges.slice(0, 3).map((badge, i) => (
                          <span key={i} className="text-xs" title={badge.name}>
                            {badge.name === "eco-warrior" && "♻️"}
                            {badge.name === "vegan-champion" && "🥗"}
                            {badge.name === "digital-minimalist" && "📵"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    Lvl {user.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-green-600">
                    {user.points}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-lg font-semibold ${
                      user.dailyScore >= 75
                        ? "text-green-600"
                        : user.dailyScore >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.dailyScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-700">
                    {user.totalCarbonFootprint.toFixed(1)} kg
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found for this filter.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
