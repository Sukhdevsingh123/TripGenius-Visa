import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TravelItinerary from "../Agent/TravelItinerary";
import { planTrip } from "../Api/Api";
import { Header, Footer } from "../components";
import axios from "axios";

const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const formData = location.state?.formData;
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [userData, setUserData] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      let axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const response = await axios.get("http://localhost:3000/api/v1/dashboard", axiosConfig);
        setUserData({ username: response.data.msg });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Redirect to form if no formData
  useEffect(() => {
    if (!formData) {
      toast.warning("Please fill the form first");
      navigate("/agent-form");
    }
  }, [formData, navigate]);

  useEffect(() => {
    if (formData) {
      startTravelPlanning();
    }
  }, [formData]);

  const startTravelPlanning = async () => {
    setLoading(true);
    setResult(null);
    setLogs([
      "🚀 Initializing AI Travel Agent...",
      "🔗 Authenticating travel agents...",
      "📍 Processing your travel preferences...",
    ]);

    try {
      // Add simulated logs to show progress
      const logInterval = setInterval(() => {
        setLogs((prev) => [
          ...prev,
          `⏳ Processing... (${Math.random() > 0.5
            ? "Analyzing destinations"
            : "Calculating routes"
          })`,
        ]);
      }, 2000);

      // Call the API endpoint
      const response = await planTrip(formData);

      clearInterval(logInterval);

      // Add completion logs
      setLogs((prev) => [
        ...prev,
        "✅ AI Analysis Complete",
        "📝 Generating your personalized itinerary...",
      ]);

      // Set the result
      if (response.itinerary) {
        setResult(response.itinerary);
        setLogs((prev) => [...prev, "🎉 Itinerary ready!"]);
      } else {
        throw new Error("No itinerary received from server");
      }

      setLoading(false);
      toast.success("✅ Travel plan generated successfully!");
    } catch (error) {
      setLoading(false);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Unknown error occurred";
      const userFriendlyError = `❌ Error: ${errorMessage}`;

      setLogs((prev) => [
        ...prev,
        userFriendlyError,
        "💡 Ensure:",
        "  • Backend server (main.py) is running on http://localhost:8000",
        "  • All AI models are properly configured",
        "  • Check browser console for more details",
      ]);

      console.error("Travel planning error:", error);
      toast.error(`Failed to generate travel plan: ${errorMessage}`);
    }
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black p-4 md:p-8 font-sans overflow-x-hidden">
        {/* Background decoration */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 min-h-screen">
          {/* User Welcome Section */}
          {userData && (
            <div className="mb-6 text-center">
              <p className="text-slate-300">
                Planning your journey, <span className="text-blue-400 font-semibold text-lg">{userData.username}</span>
              </p>
            </div>
          )}
          <TravelItinerary result={result} logs={logs} loading={loading} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItineraryPage;

