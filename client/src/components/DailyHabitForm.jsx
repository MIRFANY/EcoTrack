import React, { useState } from "react";
import { carbonAPI } from "../utils/api";
import {
  calculateTransportationEmissions,
  calculateMealEmissions,
  calculateDigitalEmissions,
  calculateSustainabilityScore,
} from "../utils/carbonCalculator";

const DailyHabitForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    transportation: { type: "walking", distance: 0 },
    meals: [{ type: "vegan", count: 1 }],
    digitalWaste: { emails: 0, streamingHours: 0 },
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateEmissions = () => {
    const transportEmission = calculateTransportationEmissions(
      formData.transportation.type,
      formData.transportation.distance
    );

    const mealsEmission = formData.meals.reduce((total, meal) => {
      return total + calculateMealEmissions(meal.type, meal.count);
    }, 0);

    const digitalEmission = calculateDigitalEmissions(
      formData.digitalWaste.emails,
      formData.digitalWaste.streamingHours
    );

    const total = transportEmission + mealsEmission + digitalEmission;
    return {
      transportation: transportEmission,
      meals: mealsEmission,
      digital: digitalEmission,
      total,
      score: calculateSustainabilityScore(total),
    };
  };

  const handleTransportationChange = (field, value) => {
    setFormData({
      ...formData,
      transportation: {
        ...formData.transportation,
        [field]: field === "distance" ? parseFloat(value) : value,
      },
    });
    updatePreview();
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...formData.meals];
    newMeals[index] = {
      ...newMeals[index],
      [field]: field === "count" ? parseInt(value) : value,
    };
    setFormData({ ...formData, meals: newMeals });
    updatePreview();
  };

  const handleDigitalChange = (field, value) => {
    setFormData({
      ...formData,
      digitalWaste: {
        ...formData.digitalWaste,
        [field]: parseInt(value),
      },
    });
    updatePreview();
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      meals: [...formData.meals, { type: "vegan", count: 1 }],
    });
  };

  const removeMeal = (index) => {
    const newMeals = formData.meals.filter((_, i) => i !== index);
    setFormData({ ...formData, meals: newMeals });
    updatePreview();
  };

  const updatePreview = () => {
    setPreview(calculateEmissions());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await carbonAPI.logActivity({
        userId,
        transportation: formData.transportation,
        meals: formData.meals,
        digitalWaste: formData.digitalWaste,
      });

      if (response.data.success) {
        alert("✓ Daily activity logged successfully!");
        // Reset form
        setFormData({
          transportation: { type: "walking", distance: 0 },
          meals: [{ type: "vegan", count: 1 }],
          digitalWaste: { emails: 0, streamingHours: 0 },
        });
        setPreview(null);
        if (onSuccess) onSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to log activity");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    updatePreview();
  }, []);

  const emissions = preview || calculateEmissions();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        📋 Log Your Daily Habits
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Transportation Section */}
        <div className="border-l-4 border-green-500 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🚗 Transportation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode of Transport
              </label>
              <select
                value={formData.transportation.type}
                onChange={(e) =>
                  handleTransportationChange("type", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="walking">🚶 Walking</option>
                <option value="cycling">🚴 Cycling</option>
                <option value="bus">🚌 Bus</option>
                <option value="train">🚂 Train</option>
                <option value="car">🚗 Car</option>
                <option value="electric_vehicle">⚡ Electric Vehicle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.transportation.distance}
                onChange={(e) =>
                  handleTransportationChange("distance", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 5.5"
              />
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              CO₂ Emissions:{" "}
              <span className="font-bold text-green-700">
                {emissions.transportation.toFixed(2)} kg
              </span>
            </p>
          </div>
        </div>

        {/* Meals Section */}
        <div className="border-l-4 border-yellow-500 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🍽️ Meals</h3>
          {formData.meals.map((meal, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={meal.type}
                  onChange={(e) =>
                    handleMealChange(index, "type", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="vegan">🥗 Vegan</option>
                  <option value="vegetarian">🥬 Vegetarian</option>
                  <option value="fish">🐟 Fish</option>
                  <option value="meat">🥩 Meat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={meal.count}
                  onChange={(e) =>
                    handleMealChange(index, "count", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                {formData.meals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeal(index)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMeal}
            className="mb-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            + Add Meal
          </button>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">
              CO₂ Emissions:{" "}
              <span className="font-bold text-yellow-700">
                {emissions.meals.toFixed(2)} kg
              </span>
            </p>
          </div>
        </div>

        {/* Digital Waste Section */}
        <div className="border-l-4 border-blue-500 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📱 Digital Waste
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails Sent/Received
              </label>
              <input
                type="number"
                min="0"
                value={formData.digitalWaste.emails}
                onChange={(e) => handleDigitalChange("emails", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Streaming (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.digitalWaste.streamingHours}
                onChange={(e) =>
                  handleDigitalChange("streamingHours", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2"
              />
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              CO₂ Emissions:{" "}
              <span className="font-bold text-blue-700">
                {emissions.digital.toFixed(2)} kg
              </span>
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-300">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Total Daily Emissions</p>
              <p className="text-4xl font-bold text-green-700">
                {emissions.total.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">kg CO₂e</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Sustainability Score</p>
              <p className="text-4xl font-bold text-blue-700">
                {emissions.score}
              </p>
              <p className="text-gray-500 text-sm">out of 100</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                emissions.score >= 75
                  ? "bg-green-500"
                  : emissions.score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(emissions.score, 100)}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? "⏳ Logging..." : "✓ Log Daily Habits"}
        </button>
      </form>
    </div>
  );
};

export default DailyHabitForm;
