import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Company Info */}
                <div className="footer-section">
                    <h3 className="footer-title">
                        <span className="footer-logo">✈️</span> TripGenius
                    </h3>
                    <p className="footer-description">
                        Your AI-powered travel companion for seamless visa assistance and personalized travel itineraries.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="social-icon" aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="social-icon" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/agent-form">Travel Planner</Link></li>
                        <li><Link to="/agent-visa">Visa Assistant</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Services</h4>
                    <ul className="footer-links">
                        <li><a href="#">AI Travel Planning</a></li>
                        <li><a href="#">Visa Consultation</a></li>
                        <li><a href="#">IELTS Analysis</a></li>
                        <li><a href="#">Document Verification</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h4 className="footer-section-title">Contact Us</h4>
                    <ul className="contact-info">
                        <li>
                            <Mail size={16} />
                            <span>support@tripgenius.com</span>
                        </li>
                        <li>
                            <Phone size={16} />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li>
                            <MapPin size={16} />
                            <span>123 Travel Street, NY 10001</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p className="copyright">
                    © {currentYear} TripGenius. All rights reserved.
                </p>
                <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <span className="separator">•</span>
                    <a href="#">Terms of Service</a>
                    <span className="separator">•</span>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
