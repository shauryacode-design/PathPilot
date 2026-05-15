"use client";
import Image from "next/image";
import "../styles/rdmap-preview.css";
import { useRef } from 'react';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'




export default function Home() {
    const flipCardRef = useRef<HTMLDivElement>(null);
    const isFlipped = useRef(false);
    const isAnimating = useRef(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = flipCardRef.current;
        if (!card || isAnimating.current) return;  // ✅ stop tilt during flip

        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        if (isFlipped.current) {
            card.style.transform = `rotateY(180deg) rotateX(${y}deg) rotateY(${x}deg)`;
        } else {
            card.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
        }
    };

    const handleMouseLeave = () => {
        const card = flipCardRef.current;
        if (!card) return;
        card.style.transform = '';
    };

    const handleFlip = () => {
        const card = flipCardRef.current;
        if (!card || isAnimating.current) return;

        isAnimating.current = true;      // ✅ lock during animation
        card.style.transform = '';       // ✅ clear tilt before flip
        isFlipped.current = !isFlipped.current;
        card.classList.toggle('flipped');

        // ✅ unlock after animation completes
        setTimeout(() => {
            isAnimating.current = false;
        }, 800);
    };
    return (
        <div className="preview-section" id="rdmap-preview">
            <div className="section-heading">
                <h1>See What Your Roadmap Looks Like</h1>
            </div>
            <div className="section-container preview-container">
                <div className="preview-left">
                    <div className="left-title">
                        <h3>✦ Live Preview</h3>
                        <h1>Your Personalized Roadmap, <br /> Ready in Seconds</h1>
                    </div>
                    <div className="preview-featurepoints">
                        <p>Step-by-step learning milestones</p>
                        <p>Curated resources for every step</p>
                        <p>Tracks your progress automatically</p>
                        <p>Adapts to your pace and goals</p>
                    </div>
                    <div className="preview-CTA">
                        <SignInButton>
                            <button>Generate My Roadmap →</button>
                        </SignInButton>
                    </div>
                </div>

                <div className="preview-right">
                    <div className="card-flip-wrapper">
                        <div className="rdmap-card" id="flipCard" ref={flipCardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}>


                            {/* FRONT FACE — Roadmap Timeline */}
                            <div className="card-face card-front">

                                <div className="ai-badge"><img src="/images/generated.svg" alt="" /> AI Generated</div>

                                <div className="card-header">
                                    <div className="goal-label"><img src="/images/goal.svg" alt="" /> GOAL</div>
                                    <div className="goal-title">Become a UI/UX Designer</div>
                                    <div className="goal-meta">6 month roadmap · 4 milestones</div>
                                </div>

                                <div className="divider"></div>

                                {/* Timeline Map */}
                                <div className="timeline-map">

                                    <div className="timeline-track">
                                        <div className="track-line completed-line"></div>
                                        <div className="track-line upcoming-line"></div>
                                    </div>

                                    <div className="timeline-nodes">

                                        <div className="timeline-node">
                                            <div className="node-circle done-node">✓</div>
                                            <div className="node-label">Learn Design Basics</div>
                                            <div className="node-meta">3 weeks</div>
                                        </div>

                                        <div className="timeline-node">
                                            <div className="node-circle active-node pulse">2</div>
                                            <div className="node-label">Master Figma</div>
                                            <div className="node-meta">4 weeks</div>
                                        </div>

                                        <div className="timeline-node">
                                            <div className="node-circle upcoming-node">3</div>
                                            <div className="node-label">Build Portfolio</div>
                                            <div className="node-meta">5 weeks</div>
                                        </div>

                                        <div className="timeline-node">
                                            <div className="node-circle upcoming-node">4</div>
                                            <div className="node-label">Apply Internships</div>
                                            <div className="node-meta">3 weeks</div>
                                        </div>

                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="overall-progress">
                                    <div className="progress-top">
                                        <span className="progress-label">Overall Progress</span>
                                        <span className="progress-percent">25%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: '25%' }}></div>
                                    </div>
                                </div>

                                <button className="flip-btn" onClick={handleFlip}>
                                    View Progress →
                                </button>

                            </div>

                            {/* BACK FACE — Progress Dashboard */}
                            <div className="card-face card-back" >

                                <div className="ai-badge"><img src="/images/progress.svg" alt="" /> Progress</div>

                                <div className="card-header">
                                    <div className="goal-label"><img src="/images/goal.svg" alt="" /> GOAL</div>
                                    <div className="goal-title">Become a UI/UX Designer</div>
                                    <div className="goal-meta">6 month roadmap · 4 milestones</div>
                                </div>

                                <div className="divider"></div>

                                <div className="steps-list">

                                    <div className="step-item completed">
                                        <div className="step-icon-wrap done">✓</div>
                                        <div className="step-content">
                                            <div className="step-name">Learn Design Basics</div>
                                            <div className="step-meta">⏱ 3 weeks · <img src="/images/resources.svg" alt="" /> 2 resources</div>
                                        </div>
                                        <div className="step-badge done-badge">Done</div>
                                    </div>

                                    <div className="step-item current">
                                        <div className="step-icon-wrap active">2</div>
                                        <div className="step-content">
                                            <div className="step-name">Master Figma</div>
                                            <div className="step-meta">⏱ 4 weeks · <img src="/images/resources.svg" alt="" /> 3 resources</div>
                                            <div className="mini-progress-wrap">
                                                <div className="mini-progress-bar">
                                                    <div className="mini-progress-fill" style={{ width: '60%' }}></div>
                                                </div>
                                                <span className="mini-progress-label">60%</span>
                                            </div>
                                        </div>
                                        <div className="step-badge current-badge">In Progress</div>
                                    </div>

                                    <div className="step-item upcoming">
                                        <div className="step-icon-wrap upcoming-icon">3</div>
                                        <div className="step-content">
                                            <div className="step-name">Build Portfolio</div>
                                            <div className="step-meta">⏱ 5 weeks · <img src="/images/resources.svg" alt="" /> 4 resources</div>
                                        </div>
                                        <div className="step-badge upcoming-badge">Upcoming</div>
                                    </div>

                                    <div className="step-item upcoming">
                                        <div className="step-icon-wrap upcoming-icon">4</div>
                                        <div className="step-content">
                                            <div className="step-name">Apply for Internships</div>
                                            <div className="step-meta">⏱ 3 weeks · <img src="/images/resources.svg" alt="" /> 5 resources</div>
                                        </div>
                                        <div className="step-badge upcoming-badge">Upcoming</div>
                                    </div>

                                </div>

                                <div className="divider"></div>

                                <div className="overall-progress">
                                    <div className="progress-top">
                                        <span className="progress-label">Overall Progress</span>
                                        <span className="progress-percent">25%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: '25%' }}></div>
                                    </div>
                                </div>

                                <button className="flip-btn" onClick={handleFlip}>
                                    ← View Roadmap
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}