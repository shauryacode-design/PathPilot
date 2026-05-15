"use client"
import Image from "next/image";
import "../styles/hero.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'



export default function Home() {
  return (
    <div className="hero-section" id="home">
      <nav>
        <div className="brand">
          <h1>PATHPILOT</h1>
        </div>
        <div className="nav-links">
          <a href="#home">HOME</a>
          <a href="#how-works">HOW IT WORKS</a>
          <a href="#rdmap-preview">ROADMAP PREVIEW</a>
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
      </nav>
      <div className="hero-main">
        <div className="main-text">
          <h1>CONFUSED ABOUT</h1>
          <div className="main-title">
            <h1>CAREER</h1>
            <h1>PATH ?</h1>
          </div>
        </div>
        <img src="/images/main-img-2.png" alt="" />
        <div className="subtext-CTA">
          <p>Get a personalized step-by-step roadmap based on your <span style={{ color: "#7B3FBE", fontWeight: "600" }}>skills</span>, <span style={{ color: "#7B3FBE", fontWeight: "600" }}>interests</span>, and <span style={{ color: "#7B3FBE", fontWeight: "600" }}> goals</span> — no more guesswork.</p>
          <button>Generate My Roadmap</button>
        </div>
      </div>

    </div>
  );
}
