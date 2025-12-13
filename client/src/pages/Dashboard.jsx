import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserHistory, deleteHistoryItem } from '../Api/Api';
import { Header, Footer } from '../components';
import {
  Plane,
  FileText,
  Calendar,
  MapPin,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:3000/api/v1/dashboard", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setUserData({ username: response.data.msg });

      // Extract user ID from token (JWT decode)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserId(payload.id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to load user data");
    }
  };

  // Fetch user history
  const fetchHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await getUserHistory(userId);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Don't show error if it's just empty history
      if (error.response?.status !== 404) {
        toast.error("Failed to load activity history");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete history item
  const handleDelete = async (historyId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    try {
      await deleteHistoryItem(historyId);
      setHistory(prev => prev.filter(item => item._id !== historyId));
      toast.success("Activity deleted");
    } catch (error) {
      console.error('Error deleting history:', error);
      toast.error("Failed to delete activity");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Generated': { icon: CheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20', text: 'Generated' },
      'Approved': { icon: CheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20', text: 'Approved' },
      'Rejected': { icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20', text: 'Rejected' },
      'Review Required': { icon: AlertCircle, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', text: 'Review' },
      'Analysis Ready': { icon: Sparkles, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', text: 'Ready' },
      'Recommended': { icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', text: 'Recommended' },
      'Not Recommended': { icon: AlertTriangle, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', text: 'Not Recommended' }
    };

    const badge = badges[status] || badges['Generated'];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    } else {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">

        {/* Background decoration */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-blue-400" />
              Welcome back, {userData?.username || 'Traveler'}!
            </h1>
            <p className="text-slate-300 text-lg">Your AI-powered travel companion dashboard</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/agent-form"
              className="group bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Plane className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Plan New Trip</h3>
                  <p className="text-slate-300 text-sm">Let AI create your perfect itinerary</p>
                </div>
              </div>
            </Link>

            <Link
              to="/visa-agent"
              className="group bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 p-6 rounded-2xl hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Check Visa Status</h3>
                  <p className="text-slate-300 text-sm">AI-powered visa Approval</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Activity History Section */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-cyan-400" />
                Recent Activities
              </h2>
              <span className="text-slate-400 text-sm">{history.length} total</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg mb-2">No activities yet</p>
                <p className="text-slate-500 text-sm">Start planning your first trip or check visa requirements!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 hover:bg-slate-800/60 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">

                      {/* Left: Icon & Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${item.type === 'TRIP_PLAN'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                          }`}>
                          {item.type === 'TRIP_PLAN' ? (
                            <Plane className="w-6 h-6" />
                          ) : (
                            <FileText className="w-6 h-6" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {item.type === 'TRIP_PLAN' ? (
                                `Trip to ${item.details.destinations?.join(', ') || 'Unknown'}`
                              ) : (
                                `Visa Check: ${item.details.destination || 'Unknown'}`
                              )}
                            </h3>
                            {getStatusBadge(item.status)}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              {formatDate(item.createdAt)}
                            </span>

                            {item.type === 'TRIP_PLAN' && item.details.origin && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                From {item.details.origin}
                              </span>
                            )}

                            {item.type === 'TRIP_PLAN' && item.details.duration && (
                              <span>{item.details.duration} days</span>
                            )}

                            {item.details.cached && (
                              <span className="text-green-400 text-xs">⚡ Cached</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(item.type === 'TRIP_PLAN' ? '/agent-itinerary' : '/visa-agent', {
                            state: { historyItem: item }
                          })}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;