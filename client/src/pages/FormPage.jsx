import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TravelForm from "../Agent/TravelForm";
import { Header, Footer } from "../components";
import axios from "axios";

const FormPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    origin: "",
    destinations: "",
    start_date: "",
    end_date: "",
    budget_range: "mid-range",
    travel_style: "cultural",
    interests: "",
    group_size: 1,
  });

  // Fetch user profile data
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIXED: Formatting logic before sending to Python
    const payload = {
      ...formData,
      // Split strings to arrays
      destinations: formData.destinations.split(",").map((item) => item.trim()),
      interests: formData.interests ? formData.interests.split(",").map((item) => item.trim()) : [],
      // Ensure integer
      group_size: parseInt(formData.group_size) || 1,
    };

    // Navigate to itinerary page
    navigate("/agent-itinerary", { state: { formData: payload } });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 font-sans overflow-x-hidden flex items-center justify-center">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {userData && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, <span className="text-blue-400">{userData.username}</span>!
              </h2>
              <p className="text-slate-300">Plan your next adventure</p>
            </div>
          )}
          
          <div className="relative">
            <TravelForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={false}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormPage;