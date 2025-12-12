import axios from 'axios';

// ✅ FIXED: Pointing to FastAPI Server
const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes timeout
});

export const planTrip = async (tripData) => {
  try {
    console.log("Sending trip request:", tripData);

    // ✅ FIXED: Sending direct POST request
    const response = await apiClient.post("/plan-trip", tripData);

    console.log("Trip plan response:", response.data);
    return response.data;

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};