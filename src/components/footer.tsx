"use client";
import Image from "next/image";
import "../styles/footer.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'


export default function Footer() {
    return (
        <div className="footer-section">
            <div className="footer-content">
                {/* Brand & Description */}
                <div className="footer-brand">
                    <h2>PATHPILOT</h2>
                    <p>Your AI-powered career compass. Discover your path, master your skills, and achieve your dreams.</p>
                    <div className="social-links">
                        <a href="#" title="LinkedIn"><img src="/images/linkedin.svg" alt="" /></a>
                        <a href="https://www.instagram.com/_shauryaojha/" title="Instagram"><img src="/images/instagram.svg" alt="" /></a>
                        <a href="https://github.com/shauryacode-design" title="GitHub"><img src="/images/github.svg" alt="" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-column">
                    <h4>PRODUCT</h4>
                    <ul>
                        <li><SignInButton><a href="#">Generate Roadmap</a></SignInButton></li>
                        <li><a href="#how-works">How It Works</a></li>
                        <li><a href="#rdmap-preview">Preview</a></li>
                        <li><a href="/login">Login</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="footer-column">
                    <h4>LEGAL</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>

                    </ul>
                </div>
            </div>

            

            {/* Divider */}
            <div className="footer-divider"></div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <p>&copy; 2024 PathPilot. All rights reserved. | Crafted with passion for your career journey.</p>
                
            </div>
        </div>
    );
}