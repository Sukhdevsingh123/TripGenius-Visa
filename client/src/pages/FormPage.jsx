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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      destinations: formData.destinations.split(",").map((item) => item.trim()),
      interests: formData.interests.split(",").map((item) => item.trim()),
      group_size: parseInt(formData.group_size),
    };

    // Pass formData to itinerary page via state
    navigate("/agent-itinerary", { state: { formData: payload } });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 font-sans overflow-x-hidden flex items-center justify-center">
        {/* Animated Background decoration */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[120px]" />
          <div
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-2xl">
          {/* User Welcome Section */}
          {userData && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome, <span className="text-blue-400">{userData.username}</span>!
              </h2>
              <p className="text-slate-300">Plan your next adventure</p>
            </div>
          )}
          {/* Decorative top accent */}
          <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-3xl" />

          {/* Form Card with enhanced styling */}
          <div className="relative">
            <TravelForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={false}
            />
          </div>

          {/* Decorative bottom accent */}
          <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormPage;
