import "../styles/testimonials.css";
import Image from "next/image";


export default function Home() {
    return (
        <div className="testimonials-section">
            <div className="section-heading testimonial-heading">
                <h3>✦ Real Stories</h3>
                <h1>Students Who Found Their Path</h1>
            </div>
            <div className="section-container">
                <div className="testimonial-container">
                    <div className="stats-bar">
                        <h1>500+ Students</h1>
                        <h1>95% Satisfaction</h1>
                        <h1>4.9/5 Rating</h1>
                    </div>
                    <div className="testi-cards">
                        <div className="testi-card">
                            <div className="avatar">
                                <h1>PS</h1>
                            </div>
                            <div className="testi-card-content">
                                <h1>Priya Sharma</h1>
                                <h3>Delhi University, 3rd Year</h3>
                                <h4>⭐⭐⭐⭐⭐</h4>
                                <p>I had no idea where to start with ML.
                                    PathPilot gave me a clear roadmap and
                                    I landed my first internship in 4 months.</p>
                                <h3><img src="/images/goal.svg" alt="" /> Now pursuing: ML Engineer</h3>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="avatar">
                                <h1>AR</h1>
                            </div>
                            <div className="testi-card-content">
                                <h1>Arjun Rawat</h1>
                                <h3>VIT Vellore, 2nd Year</h3>
                                <h4>⭐⭐⭐⭐⭐</h4>
                                <p>As a CS student confused between
                                    web dev and app dev, PathPilot helped
                                    me pick a direction and stick to it.</p>
                                <h3><img src="/images/goal.svg" alt="" />  Now pursuing: Full Stack Developer</h3>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="avatar">
                                <h1>SK</h1>
                            </div>
                            <div className="testi-card-content">
                                <h1>Sneha Kapoor</h1>
                                <h3>Pune University, 4th Year
                                </h3>
                                <h4>⭐⭐⭐⭐⭐</h4>
                                <p>The roadmap it generated was so
                                    specific to my goals. I completed it
                                    in 5 months and got placed at a startup.</p>
                                <h3><img src="/images/goal.svg" alt="" />  Now pursuing: UI/UX Designer</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}