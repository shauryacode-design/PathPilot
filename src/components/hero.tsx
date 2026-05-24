"use client"
import Image from "next/image";
import "../styles/hero.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import MobileNav from "./mobile-nav";



export default function Home() {
  return (
    <div className="hero-section" id="home">
      <nav>
        <div className="brand-links">
          <div className="brand">
            <h1>PathPilot</h1>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#how-works">How It Works</a>
            <a href="#rdmap-preview">Roadmap Preview</a>
          </div>
        </div>
        <div className="nav-login">
          <Show when="signed-out">
            <SignInButton>
              <button>LOGIN</button>
            </SignInButton>

          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

        </div>
        <MobileNav />
      </nav>
      <div className="hero-main">
        <div className="main-text">
          <h1>Know Your Goal.</h1>
          <div className="main-title">
            <h1>Now Find</h1>
            <h1>The Path.</h1>
          </div>
        </div>
        <img
          src="/images/main-img-2.png"
          alt="PathPilot AI career roadmap illustration for students"
        />
        <div className="subtext-CTA">
          <p>Get a personalized step-by-step roadmap based on your <span style={{ color: "#7B3FBE", fontWeight: "600" }}>skills</span>, <span style={{ color: "#7B3FBE", fontWeight: "600" }}>interests</span>, and <span style={{ color: "#7B3FBE", fontWeight: "600" }}> goals</span> — no more guesswork.</p>
          <SignInButton>
            <button>Generate My Roadmap</button>
          </SignInButton>
        </div>
      </div>

    </div>
  );
}
