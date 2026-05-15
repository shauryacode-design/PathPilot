"use client"
import { useState } from "react";
import "../styles/mobile-nav.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="mobile-nav-wrapper">
            {/* Hamburger Button */}
            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                <span className={isOpen ? "active" : ""}></span>
                <span className={isOpen ? "active" : ""}></span>
                <span className={isOpen ? "active" : ""}></span>
            </button>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
                <div className="mobile-menu-content">
                    <a href="#home" onClick={closeMenu}>HOME</a>
                    <a href="#how-works" onClick={closeMenu}>HOW IT WORKS</a>
                    <a href="#rdmap-preview" onClick={closeMenu}>ROADMAP PREVIEW</a>
                    <div className="mobile-nav-login">
                        <Show when="signed-out">
                            <SignInButton>
                                <button>LOGIN</button>
                            </SignInButton>
                        </Show>
                        <Show when="signed-in">
                            <UserButton />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    );
}
