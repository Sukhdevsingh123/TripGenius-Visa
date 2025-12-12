import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TravelItinerary from "../Agent/TravelItinerary";
import { planTrip } from "../Api/Api"; // Uses the fixed Api.js
import { Header, Footer } from "../components";
import axios from "axios";

const ItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [logs, setLogs] = useState([]);
  
  const formData = location.state?.formData;
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [userData, setUserData] = useState(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:3000/api/v1/dashboard", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserData({ username: response.data.msg });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (!formData) {
      toast.warning("Please fill the form first");
      navigate("/agent-form");
    }
  }, [formData, navigate]);

  useEffect(() => {
    if (formData && !startedRef.current) {
      startedRef.current = true;
      startTravelPlanning();
    }
  }, [formData]);

  const startTravelPlanning = async () => {
    setLoading(true);
    setResult(null);
    setIsCached(false);
    
    setLogs(["🚀 Initializing AI Travel Agent...", "🔗 Connecting to OpenAI Neural Network..."]);

    let logInterval = null;

    try {
      logInterval = setInterval(() => {
        const messages = ["⏳ Consulting Destination Analyst...", "🌤️ Checking historical weather...", "🗺️ Optimizing routes..."];
        setLogs((prev) => [...prev, messages[Math.floor(Math.random() * messages.length)]]);
      }, 2500);

      // ✅ CALL API
      const response = await planTrip(formData);

      if (logInterval) clearInterval(logInterval);

      setLogs((prev) => [...prev, "✅ Analysis Complete", "📝 Generating Itinerary..."]);

      if (response && response.itinerary) {
        setResult(response.itinerary);
        if (response.cached) setIsCached(true);
        toast.success("Travel plan generated!");
      } else {
        throw new Error("Invalid response");
      }

    } catch (error) {
      console.error("Error:", error);
      if (logInterval) clearInterval(logInterval);
      setLogs((prev) => [...prev, `❌ Error: ${error.message}`]);
      toast.error("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-900 p-4 md:p-8 font-sans overflow-x-hidden">
        <div className="max-w-6xl mx-auto relative z-10 min-h-screen">
          {userData && (
            <div className="mb-6 text-center text-slate-300">
               Planning for <span className="text-blue-400 font-semibold">{userData.username}</span>
            </div>
          )}
          <TravelItinerary result={result} logs={logs} loading={loading} isCached={isCached} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItineraryPage;