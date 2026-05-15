"use client"
import Image from "next/image";
// import "../styles/hero.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'



export default function Home() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Onboarding</h1>
        {/* The user button will display here after successful login */}
        <UserButton />
      </header>
      <main>
        <p>Welcome to your application Onboarding!</p>
      </main>
    </div>
  );
}
