"use client"
import Image from "next/image";
import "../../styles/onboarding.css";
// import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'



export default function Home() {
  return (
    <div className="onboarding-section">
      <div className="onboarding-container">
        <div className="steps-timeline">
          <div className="steps">
            <div className="step">
              <h1>1</h1>
            </div>
            <h3>First</h3>
          </div>
          <div className="timeline-lines"></div>
          <div className="steps">
            <div className="step">
              <h1>2</h1>
            </div>
            <h3>Second</h3>
          </div>
          <div className="timeline-lines"></div>
          <div className="steps">
            <div className="step">
              <h1>3</h1>
            </div>
            <h3>Third</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
