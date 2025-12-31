import React, { useState, useEffect } from "react";
import { carbonAPI } from "../utils/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7); // 7, 30, 90 days

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const statsResponse = await carbonAPI.getStats(userId);
      setStats(statsResponse.data.data);

      // Fetch history
      const historyResponse = await carbonAPI.getHistory(
        userId,
        selectedPeriod
      );
      const formattedHistory = historyResponse.data.data
        .map((log) => ({
          date: new Date(log.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          emissions: log.totalCarbonForDay,
          transportation: log.transportation?.carbonEmission || 0,
          meals:
            log.meals?.reduce((sum, m) => sum + (m.carbonEmission || 0), 0) ||
            0,
          digital: log.digitalWaste?.carbonEmission || 0,
        }))
        .reverse();
      setHistory(formattedHistory);

      // Fetch today's data
      const todayResponse = await carbonAPI.getTodayFootprint(userId);
      setTodayData(todayResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-2xl">
          ⏳ Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 m-6">
        ❌ {error}
      </div>
    );
  }

  const user = stats?.user || {};
  const stat = stats?.statistics || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            👋 Welcome back, {user.name || "Student"}!
          </h1>
          <p className="text-gray-600">
            Track your daily carbon footprint and compete in The Syndicate
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Daily Score */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-2">🎯 Daily Score</p>
            <p className="text-4xl font-bold text-blue-600">
              {user.dailyScore || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">Today's sustainability</p>
          </div>

          {/* Level & Points */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm mb-2">⭐ Level</p>
            <p className="text-4xl font-bold text-purple-600">
              {user.level || 1}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {user.points || 0} points
            </p>
          </div>

          {/* Total Carbon */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-2">♻️ Total Carbon</p>
            <p className="text-4xl font-bold text-green-600">
              {stat.totalCarbonFootprint?.toFixed(1) || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">kg CO₂e</p>
          </div>

          {/* Days Logged */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm mb-2">📅 Days Logged</p>
            <p className="text-4xl font-bold text-yellow-600">
              {stat.totalDaysLogged || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">consecutive days</p>
          </div>
        </div>

        {/* Today's Activity */}
        {todayData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              📊 Today's Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayData.transportation && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 text-sm">🚗 Transportation</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {todayData.transportation.carbonEmission?.toFixed(2) || 0}{" "}
                    kg
                  </p>
                  <p className="text-gray-500 text-xs">
                    {todayData.transportation.distance} km
                  </p>
                </div>
              )}
              {todayData.meals && todayData.meals.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-gray-600 text-sm">🍽️ Meals</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {todayData.meals
                      .reduce((sum, m) => sum + (m.carbonEmission || 0), 0)
                      .toFixed(2)}{" "}
                    kg
                  </p>
                  <p className="text-gray-500 text-xs">
                    {todayData.meals.length} meals
                  </p>
                </div>
              )}
              {todayData.digitalWaste && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-gray-600 text-sm">📱 Digital Waste</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {todayData.digitalWaste.carbonEmission?.toFixed(2) || 0} kg
                  </p>
                </div>
              )}
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                <p className="text-gray-600 text-sm">📈 Total Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {todayData.totalCarbonForDay?.toFixed(2) || 0} kg
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emissions Trend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📈 Emissions Trend
            </h3>
            <div className="flex gap-2 mb-4">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedPeriod === days
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data yet. Start logging your daily activities!
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🎨 Category Breakdown
            </h3>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={history.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="transportation" fill="#3b82f6" />
                  <Bar dataKey="meals" fill="#f59e0b" />
                  <Bar dataKey="digital" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data yet. Start logging your daily activities!
              </div>
            )}
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            📊 Your Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm">Average Daily Emissions</p>
              <p className="text-3xl font-bold text-blue-600">
                {stat.averageDailyEmissions || 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">kg CO₂e/day</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">Lowest Emission Day</p>
              <p className="text-3xl font-bold text-green-600">
                {stat.lowestEmissionDay || 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">kg CO₂e</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-gray-600 text-sm">Highest Emission Day</p>
              <p className="text-3xl font-bold text-red-600">
                {stat.highestEmissionDay || 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">kg CO₂e</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
