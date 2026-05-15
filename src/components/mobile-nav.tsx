'use client'

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/mobile-nav.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-header">
        <div className="mobile-nav-logo">
          <h1>PATHPILOT</h1>
        </div>
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isOpen && (
        <div className="mobile-nav-menu">
          <ul>
            <li><Link href="/" onClick={closeMenu}>FEATURES</Link></li>
            <li><Link href="/" onClick={closeMenu}>HOW IT WORKS</Link></li>
            <li><Link href="/" onClick={closeMenu}>ABOUT</Link></li>
          </ul>
          <button className="mobile-login-btn" onClick={closeMenu}>LOG IN</button>
        </div>
      )}
    </div>
  );
}
