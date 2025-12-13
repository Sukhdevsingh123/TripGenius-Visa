import axios from 'axios';

// API URLs
const PYTHON_API_URL = 'http://localhost:8000/api';
const NODE_API_URL = 'http://localhost:3000/api';

// Python API Client (for AI services)
const pythonClient = axios.create({
  baseURL: PYTHON_API_URL,
  timeout: 120000,
});

// Node API Client (for user data & history)
const nodeClient = axios.create({
  baseURL: NODE_API_URL,
  timeout: 30000,
});

// Add auth token to Node requests
nodeClient.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth') || '""');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Travel Planning
export const planTrip = async (tripData) => {
  try {
    console.log("Sending trip request:", tripData);
    const response = await pythonClient.post("/plan-trip", tripData);
    console.log("Trip plan response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// History Management
export const saveHistory = async (historyData) => {
  try {
    const response = await nodeClient.post("/history/save", historyData);
    return response.data;
  } catch (error) {
    console.error("Save history error:", error);
    throw error;
  }
};

export const getUserHistory = async (userId) => {
  try {
    const response = await nodeClient.get(`/history/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get history error:", error);
    throw error;
  }
};

export const getHistoryItem = async (historyId) => {
  try {
    const response = await nodeClient.get(`/history/${historyId}`);
    return response.data;
  } catch (error) {
    console.error("Get history item error:", error);
    throw error;
  }
};

export const deleteHistoryItem = async (historyId) => {
  try {
    const response = await nodeClient.delete(`/history/${historyId}`);
    return response.data;
  } catch (error) {
    console.error("Delete history error:", error);
    throw error;
  }
};