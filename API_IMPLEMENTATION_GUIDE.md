# API Implementation Guide

## Overview

This document explains how the backend FastAPI endpoints are integrated with the React frontend for the AI Travel Agent application.

---

## Backend API Structure

### Endpoint: `POST /api/plan-trip`

**Base URL:** `http://localhost:8000`

**Request Schema:**

```json
{
  "origin": "string", // e.g., "Mumbai"
  "destinations": ["string"], // e.g., ["Vrindavan", "Kyoto"]
  "start_date": "YYYY-MM-DD", // e.g., "2025-12-20"
  "end_date": "YYYY-MM-DD", // e.g., "2025-12-27"
  "budget_range": "string", // "budget" | "mid-range" | "luxury"
  "travel_style": "string", // e.g., "cultural", "adventure"
  "interests": ["string"], // e.g., ["Temples", "Photography"]
  "group_size": "integer" // e.g., 1, 2, 4
}
```

**Response Schema:**

```json
{
  "itinerary": "string" // Markdown formatted travel plan
}
```

**Error Response:**

```json
{
  "detail": "string" // Error message
}
```

---

## Frontend Implementation

### 1. API Service (`src/Api/Api.js`)

The API service provides a configured Axios client with:

- **Base URL:** `http://localhost:8000/api`
- **Timeout:** 120 seconds (for long-running AI processing)
- **Error Handling:** Comprehensive error handling with fallback messages

**Functions:**

#### `planTrip(tripData)`

- **Purpose:** Send form data to backend and receive travel itinerary
- **Parameter:** Trip data object matching the schema above
- **Returns:** Promise resolving to `{ itinerary: string }`
- **Throws:** Axios error with response data

#### `getHealthStatus()`

- **Purpose:** Check if API server is running
- **Returns:** Promise resolving to health status
- **Throws:** Axios error if server is down

### 2. Pages

#### `FormPage.jsx` (`/agent-form`)

- Displays the travel form
- Collects user input
- Navigates to `/agent-itinerary` with form data

**Form Data Structure:**

```javascript
{
  origin: "Mumbai",
  destinations: "Vrindavan, Kyoto",  // Comma-separated string
  start_date: "2025-12-20",
  end_date: "2025-12-27",
  budget_range: "mid-range",
  travel_style: "cultural",
  interests: "Temples, History",     // Comma-separated string
  group_size: 1
}
```

#### `ItineraryPage.jsx` (`/agent-itinerary`)

- Receives form data from FormPage
- Transforms data (splits comma-separated strings into arrays)
- Calls `planTrip()` API
- Displays streaming logs and final itinerary
- Auto-redirects to FormPage if no data is provided

**Data Transformation:**

```javascript
const payload = {
  ...formData,
  destinations: formData.destinations.split(",").map((item) => item.trim()),
  interests: formData.interests.split(",").map((item) => item.trim()),
  group_size: parseInt(formData.group_size),
};
```

### 3. Component: `TravelItinerary.jsx`

Displays three states:

**State 1: IDLE** (No activity)

- Shows welcome message
- Prompts user to fill form

**State 2: LOADING** (Processing)

- Displays terminal-style log output
- Shows real-time progress messages
- Auto-scrolls to latest log

**State 3: RESULT** (Complete)

- Displays formatted travel itinerary (Markdown)
- Shows success header with badge
- Scrollable content area

---

## Data Flow

```
FormPage
   ↓
User fills form & clicks "Launch AI Agent"
   ↓
Navigate to /agent-itinerary with formData
   ↓
ItineraryPage receives formData
   ↓
Transform data (strings → arrays)
   ↓
Call planTrip(transformedData)
   ↓
Backend receives request
   ↓
AI agents process request
   ↓
Return itinerary as markdown
   ↓
Display result in TravelItinerary component
   ↓
Show final formatted itinerary
```

---

## Running the Application

### 1. Start Backend Server

```bash
cd AI-Travel-Agent-Advanced
python3 main.py
```

- Server runs on `http://localhost:8000`
- CORS configured for `http://localhost:5173`

### 2. Start Frontend Server

```bash
cd client
npm run dev
```

- React app runs on `http://localhost:5173`

### 3. Test the Flow

1. Go to `http://localhost:5173/login`
2. Login with credentials
3. You'll be redirected to `/agent-form`
4. Fill the form with travel details
5. Click "Launch AI Agent"
6. Watch the logs and get your personalized itinerary

---

## Error Handling

### Common Errors

**Backend Server Not Running:**

- Message: "Connection Error: Ensure backend is running"
- Solution: Start backend with `python3 main.py`

**API Response Error:**

- Shows detailed error from backend
- Check backend logs for more information

**No Form Data:**

- Automatically redirects to form page
- Shows warning toast

---

## Configuration

### API Timeout

Edit `src/Api/Api.js`:

```javascript
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // milliseconds
});
```

### API Base URL

To change backend URL, edit `src/Api/Api.js`:

```javascript
const API_URL = "http://localhost:8000/api"; // Change this
```

---

## Logging

### Frontend Logs

- Check browser console (F12 → Console)
- API requests and responses are logged
- Error stack traces are displayed

### Backend Logs

- Check terminal running `python3 main.py`
- Incoming requests are logged
- Processing steps are tracked

---

## Testing

### Test with cURL

```bash
curl -X POST http://localhost:8000/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Mumbai",
    "destinations": ["Vrindavan"],
    "start_date": "2025-12-20",
    "end_date": "2025-12-27",
    "budget_range": "mid-range",
    "travel_style": "cultural",
    "interests": ["Temples"],
    "group_size": 1
  }'
```

---

## Notes

- Ensure backend AI models are properly configured
- Frontend expects specific JSON response structure from backend
- Markdown is parsed and rendered using `react-markdown`
- Form data is passed via React Router state (not URL parameters)
- Error messages are user-friendly and guide troubleshooting
