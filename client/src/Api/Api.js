import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configure axios with timeout
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes timeout for long-running requests
});

/**
 * Plan a trip with the AI Travel Agent
 * @param {Object} tripData - Trip details including origin, destinations, dates, budget, etc.
 * @returns {Promise<Object>} - Travel itinerary from the AI agent
 */
export const planTrip = async (tripData) => {
  try {
    console.log('Sending trip request:', tripData);
    const response = await apiClient.post('/plan-trip', tripData);
    console.log('Trip plan response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get health status of the API
 * @returns {Promise<Object>} - Health status
 */
export const getHealthStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error.message);
    throw error;
  }
};