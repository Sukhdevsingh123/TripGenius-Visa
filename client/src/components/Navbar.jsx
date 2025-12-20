import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Plane, FileCheck, LayoutDashboard, LogIn, UserPlus, User } from 'lucide-react';
import axios from 'axios';
import '../styles/Navbar.css';

const Navbar = () => {
    const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
    const [userData, setUserData] = useState(null);
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

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/agent-form', label: 'Travel Planner', icon: Plane },
        { path: '/agent-visa', label: 'Visa Assistant', icon: FileCheck },
    ];

    const authNavItems = token
        ? [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
        : [
            { path: '/login', label: 'Login', icon: LogIn },
            { path: '/register', label: 'Sign Up', icon: UserPlus }
        ];

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                {/* Main Navigation */}
                <div className="nav-items">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'nav-item-active' : ''}`
                            }
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Auth Navigation */}
                <div className="nav-auth">
                    {token && userData && (
                        <div className="nav-user-badge">
                            <User className="nav-user-icon" />
                            <span className="nav-user-name">{userData.username}</span>
                        </div>
                    )}
                    {authNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'nav-item-active' : ''}`
                            }
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
