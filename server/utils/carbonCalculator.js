/**
 * Carbon Calculator Utility
 * Calculates CO2 emissions based on daily activities
 * All values are in kilograms of CO2 equivalent (kg CO2e)
 */

// Emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  transportation: {
    walking: 0, // No emissions
    cycling: 0, // No emissions
    bus: 0.089, // kg CO2e per km
    train: 0.041, // kg CO2e per km
    car: 0.21, // kg CO2e per km (average)
    electric_vehicle: 0.05 // kg CO2e per km
  },
  meals: {
    vegan: 1.5, // kg CO2e per meal
    vegetarian: 2.0, // kg CO2e per meal
    meat: 5.0, // kg CO2e per meal (beef/lamb)
    fish: 3.5 // kg CO2e per meal
  },
  digital: {
    email: 0.004, // kg CO2e per email
    streaming: 0.036 // kg CO2e per hour (1080p video)
  }
};

/**
 * Calculate transportation emissions
 * @param {string} type - 'walking', 'cycling', 'bus', 'train', 'car', 'electric_vehicle'
 * @param {number} distance - Distance traveled in kilometers
 * @returns {number} - CO2 emissions in kg
 */
function calculateTransportationEmissions(type, distance) {
  const factor = EMISSION_FACTORS.transportation[type] || 0;
  return Math.round((factor * distance) * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate meal emissions
 * @param {string} mealType - 'vegan', 'vegetarian', 'meat', 'fish'
 * @param {number} count - Number of meals (default 1)
 * @returns {number} - CO2 emissions in kg
 */
function calculateMealEmissions(mealType, count = 1) {
  const factor = EMISSION_FACTORS.meals[mealType] || 0;
  return Math.round((factor * count) * 100) / 100;
}

/**
 * Calculate digital waste emissions
 * @param {number} emailCount - Number of emails sent/received
 * @param {number} streamingHours - Hours of video streaming
 * @returns {number} - CO2 emissions in kg
 */
function calculateDigitalEmissions(emailCount = 0, streamingHours = 0) {
  const emailEmissions = EMISSION_FACTORS.digital.email * emailCount;
  const streamingEmissions = EMISSION_FACTORS.digital.streaming * streamingHours;
  return Math.round((emailEmissions + streamingEmissions) * 100) / 100;
}

/**
 * Calculate total daily carbon footprint
 * @param {object} dailyData - Object containing transportation, meals, digital data
 * @returns {object} - Breakdown of emissions and total
 */
function calculateDailyFootprint(dailyData) {
  let transportationEmissions = 0;
  let mealEmissions = 0;
  let digitalEmissions = 0;

  // Calculate transportation
  if (dailyData.transportation) {
    const { type, distance } = dailyData.transportation;
    transportationEmissions = calculateTransportationEmissions(type, distance);
  }

  // Calculate meals
  if (dailyData.meals && Array.isArray(dailyData.meals)) {
    mealEmissions = dailyData.meals.reduce((total, meal) => {
      return total + calculateMealEmissions(meal.type, meal.count || 1);
    }, 0);
  }

  // Calculate digital waste
  if (dailyData.digitalWaste) {
    const { emails = 0, streamingHours = 0 } = dailyData.digitalWaste;
    digitalEmissions = calculateDigitalEmissions(emails, streamingHours);
  }

  const totalEmissions = transportationEmissions + mealEmissions + digitalEmissions;

  return {
    transportationEmissions: Math.round(transportationEmissions * 100) / 100,
    mealEmissions: Math.round(mealEmissions * 100) / 100,
    digitalEmissions: Math.round(digitalEmissions * 100) / 100,
    totalEmissions: Math.round(totalEmissions * 100) / 100,
    breakdown: {
      transportation: dailyData.transportation,
      meals: dailyData.meals,
      digital: dailyData.digitalWaste
    }
  };
}

/**
 * Get sustainability score (0-100)
 * Lower emissions = higher score
 * @param {number} totalEmissions - Total CO2 emissions in kg
 * @returns {number} - Score from 0-100
 */
function calculateSustainabilityScore(totalEmissions) {
  // Based on EU average daily emissions (~25kg CO2e)
  const baselineEmissions = 25;
  const score = Math.max(0, 100 - (totalEmissions / baselineEmissions) * 100);
  return Math.round(score);
}

module.exports = {
  calculateTransportationEmissions,
  calculateMealEmissions,
  calculateDigitalEmissions,
  calculateDailyFootprint,
  calculateSustainabilityScore,
  EMISSION_FACTORS
};
