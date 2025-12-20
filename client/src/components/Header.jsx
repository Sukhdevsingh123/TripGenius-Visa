import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import axios from 'axios';
import '../styles/Header.css';

const Header = () => {
    const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
    const [userData, setUserData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

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
                const response = await axios.get("https://tripgenius-visa-iltf.onrender.com/api/v1/dashboard", axiosConfig);
                setUserData({ username: response.data.msg });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        setToken("");
        navigate("/login");
    };

    return (
        <header className="header-container">
            <div className="header-content">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <span className="logo-gradient">✈️</span>
                    </div>
                    <span className="logo-text">TripGenius</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    <Link to="/agent-form" className="nav-link">
                        Travel Planner
                    </Link>
                    <Link to="/agent-visa" className="nav-link">
                        Visa Assistant
                    </Link>
                    {token && (
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* User Profile Section */}
                <div className="header-actions">
                    {token && userData ? (
                        <div className="user-profile-section">
                            <div className="user-avatar">
                                <User className="user-icon" />
                            </div>
                            <div className="user-info">
                                <span className="user-name">{userData.username}</span>
                                <span className="user-status">Active</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn" title="Logout">
                                <LogOut className="logout-icon" />
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">
                                Login
                            </Link>
                            <Link to="/register" className="btn-register">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/agent-form" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Travel Planner
                    </Link>
                    <Link to="/agent-visa" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Visa Assistant
                    </Link>
                    {token && (
                        <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            Dashboard
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
