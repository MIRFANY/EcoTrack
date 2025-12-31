import React from "react";
import Dashboard from "./components/Dashboard";
import DailyHabitForm from "./components/DailyHabitForm";
import Leaderboard from "./components/Leaderboard";

function App() {
  // Mock user ID - replace with actual auth in production
  const userId = "mock-user-id";
  const [activePage, setActivePage] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🌍 EcoTrack</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActivePage("dashboard")}
              className={`px-4 py-2 rounded-lg transition ${
                activePage === "dashboard"
                  ? "bg-white text-green-600 font-semibold"
                  : "text-white hover:bg-green-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage("form")}
              className={`px-4 py-2 rounded-lg transition ${
                activePage === "form"
                  ? "bg-white text-green-600 font-semibold"
                  : "text-white hover:bg-green-700"
              }`}
            >
              Log Habits
            </button>
            <button
              onClick={() => setActivePage("leaderboard")}
              className={`px-4 py-2 rounded-lg transition ${
                activePage === "leaderboard"
                  ? "bg-white text-green-600 font-semibold"
                  : "text-white hover:bg-green-700"
              }`}
            >
              The Syndicate
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="py-8">
        {activePage === "dashboard" && <Dashboard userId={userId} />}
        {activePage === "form" && <DailyHabitForm userId={userId} />}
        {activePage === "leaderboard" && <Leaderboard userId={userId} />}
      </div>
    </div>
  );
}

export default App;
