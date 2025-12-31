/**
 * Carbon Calculator Logic (Client-side)
 * Mirrors backend calculations for instant feedback
 */

export const EMISSION_FACTORS = {
  transportation: {
    walking: 0,
    cycling: 0,
    bus: 0.089,
    train: 0.041,
    car: 0.21,
    electric_vehicle: 0.05
  },
  meals: {
    vegan: 1.5,
    vegetarian: 2.0,
    meat: 5.0,
    fish: 3.5
  },
  digital: {
    email: 0.004,
    streaming: 0.036
  }
};

export const calculateTransportationEmissions = (type, distance) => {
  const factor = EMISSION_FACTORS.transportation[type] || 0;
  return Math.round((factor * distance) * 100) / 100;
};

export const calculateMealEmissions = (mealType, count = 1) => {
  const factor = EMISSION_FACTORS.meals[mealType] || 0;
  return Math.round((factor * count) * 100) / 100;
};

export const calculateDigitalEmissions = (emailCount = 0, streamingHours = 0) => {
  const emailEmissions = EMISSION_FACTORS.digital.email * emailCount;
  const streamingEmissions = EMISSION_FACTORS.digital.streaming * streamingHours;
  return Math.round((emailEmissions + streamingEmissions) * 100) / 100;
};

export const calculateSustainabilityScore = (totalEmissions) => {
  const baselineEmissions = 25; // EU average daily emissions
  const score = Math.max(0, 100 - (totalEmissions / baselineEmissions) * 100);
  return Math.round(score);
};

export const getLevelFromPoints = (points) => {
  return Math.floor(points / 100) + 1;
};
