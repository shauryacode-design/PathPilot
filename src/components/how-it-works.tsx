"use client";
import Image from "next/image";
import "../styles/how-it-works.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'


export default function Home() {
    return (
        <div className="how-works-section" id="how-works">
            <div className="section-heading">
                <h1>HOW IT WORKS ?</h1>
            </div>
            <div className="section-container">
                <div className="steps-container">

                    <div className="step-card">
                        <div className="step-number">01</div>
                        <div className="step-icon"><img src="/images/about-icon.svg" alt="" /></div>
                        <h3 className="step-title">Tell Us About Yourself</h3>
                        <p className="step-description">Enter your interests, skills, and career goals. No experience needed — just be honest about where you are.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>
                        <div className="step-icon"><img src="/images/ai-icon.svg" alt="" /></div>
                        <h3 className="step-title">AI Builds Your Roadmap</h3>
                        <p className="step-description">Our AI generates a personalized step-by-step learning path tailored specifically to your goals — in seconds.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>
                        <div className="step-icon"><img src="/images/journey-icon.svg" alt="" /></div>
                        <h3 className="step-title">Start Your Journey</h3>
                        <p className="step-description">Follow the roadmap, track your progress, and move confidently toward your dream career. No more guesswork.</p>
                    </div>

                </div>
                <div className="section-cta">
                    <p>Ready to find your path?</p>
                    <SignInButton>
                    <button>Generate My Roadmap →</button>
                    </SignInButton>
                </div>
            </div>
        </div>
    );
}