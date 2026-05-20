"use client"
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "../../styles/dashboard.css";

interface Resource {
  name: string;
  link: string;
  type: string;
}

interface Step {
  id: number;
  title: string;
  duration: string;
  description: string;
  resources: Resource[];
  tasks: string[];
}

interface Roadmap {
  title: string;
  duration: string;
  goal: string;
  steps: Step[];
  totalTasks: number;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('roadmap');
    if (saved) {
      setRoadmap(JSON.parse(saved));
      // Sync cookie in case user cleared their cookies but has localStorage
      document.cookie = "has_roadmap=true; path=/; max-age=31536000";
    } else {
      // Clear cookie if no roadmap in localStorage
      document.cookie = "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

    const savedTasks = localStorage.getItem('completedTasks');
    if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));

    const savedXp = localStorage.getItem('xp');
    if (savedXp) setXp(parseInt(savedXp));

    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) setStreak(parseInt(savedStreak));

    // Update streak
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (parseInt(localStorage.getItem('streak') || '0')) + 1;
        setStreak(newStreak);
        localStorage.setItem('streak', newStreak.toString());
      } else if (!lastVisit) {
        setStreak(1);
        localStorage.setItem('streak', '1');
      }
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  useEffect(() => {
    setLevel(Math.floor(xp / 100) + 1);
  }, [xp]);

  const handleSignOut = async () => {
    await signOut();
    // Clear cookies
    document.cookie = "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    // Clear localStorage
    localStorage.removeItem('roadmap');
    localStorage.removeItem('completedTasks');
    localStorage.removeItem('xp');
    localStorage.removeItem('streak');
    localStorage.removeItem('lastVisit');
    router.push('/');
  };

  const toggleTask = (task: string) => {
    const isCompleting = !completedTasks.includes(task);
    const newTasks = isCompleting
      ? [...completedTasks, task]
      : completedTasks.filter(t => t !== task);

    setCompletedTasks(newTasks);
    localStorage.setItem('completedTasks', JSON.stringify(newTasks));

    if (isCompleting) {
      const newXp = xp + 10;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    } else {
      const newXp = Math.max(0, xp - 10);
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
    }
  };

  const extractGoal = (goalText: string) => {
    const patterns = [
      /become\s+(?:a\s+|an\s+)?(.+?)(?:\s+at\s+|\s+in\s+|$)/i,
      /be\s+(?:a\s+|an\s+)?(.+?)(?:\s+at\s+|\s+in\s+|$)/i,
      /work\s+as\s+(?:a\s+|an\s+)?(.+?)(?:\s+at\s+|\s+in\s+|$)/i,
    ];
    for (const pattern of patterns) {
      const match = goalText.match(pattern);
      if (match) return match[1].trim();
    }
    return goalText.length > 20 ? goalText.slice(0, 20) + '...' : goalText;
  };

  const totalTasks = roadmap?.steps.reduce((acc, step) => acc + step.tasks.length, 0) || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const xpForNextLevel = level * 100;
  const currentLevelXp = xp % 100;

  if (!isLoaded) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="dashboard-page">

      {/* Celebration popup */}
      {showCelebration && (
        <div className="celebration">
          <span>⭐ +10 XP!</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="dashboard-logo" onClick={() => router.push('/')}>
          PATHPILOT
        </div>
        <div className="dashboard-nav-right">
          <div className="streak-badge">
            🔥 {streak} day streak
          </div>
          <div className="xp-badge">
            ⭐ {xp} XP
          </div>
          <div className="level-badge">
            Lv.{level}
          </div>
          <span className="welcome-text">Hi, {user?.firstName} 👋</span>
          <button className="new-roadmap-btn" onClick={() => router.push('/onboarding?new=true')}>
            + New Roadmap
          </button>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Empty state */}
      {!roadmap && (
        <div className="empty-dashboard">
          <div className="empty-icon">🗺️</div>
          <h2>No Roadmap Yet</h2>
          <p>Generate your first personalized roadmap to get started</p>
          <button className="btn-generate" onClick={() => router.push('/onboarding')}>
            🚀 Generate My Roadmap
          </button>
        </div>
      )}

      {/* Dashboard with roadmap */}
      {roadmap && (
        <div className="dashboard-content">

          {/* Hero strip */}
          <div className="hero-strip">
            <div className="hero-strip-left">
              <div className="goal-badge">🎯 {extractGoal(roadmap.goal)}</div>
              <h2>Keep going, {user?.firstName}!</h2>
              <p>{completedTasks.length} of {totalTasks} tasks done · {roadmap.duration}</p>
            </div>
            <div className="hero-strip-right">
              <div className="big-progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="white" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="progress-circle-text">
                  <span className="progress-num">{progress}%</span>
                  <span className="progress-label-small">done</span>
                </div>
              </div>
            </div>
          </div>

          {/* XP Level bar */}
          <div className="xp-section">
            <div className="xp-info">
              <span>⭐ Level {level}</span>
              <span>{currentLevelXp}/{xpForNextLevel} XP to next level</span>
            </div>
            <div className="xp-track">
              <div
                className="xp-fill"
                style={{ width: `${(currentLevelXp / xpForNextLevel) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="timeline-section">
            <h3>Your Roadmap</h3>
            <div className="timeline-nodes">
              {roadmap.steps.map((step, index) => {
                const stepTasks = step.tasks;
                const stepCompleted = stepTasks.every(t => completedTasks.includes(t));
                const stepInProgress = stepTasks.some(t => completedTasks.includes(t)) && !stepCompleted;

                return (
                  <div key={step.id} className="timeline-item">
                    <div
                      className={`timeline-node 
                        ${stepCompleted ? 'node-done' : ''}
                        ${stepInProgress ? 'node-progress' : ''}
                        ${activeStep === index ? 'node-active' : ''}
                      `}
                      onClick={() => setActiveStep(index)}
                    >
                      {stepCompleted ? '✓' : index + 1}
                    </div>
                    {index < roadmap.steps.length - 1 && (
                      <div className={`timeline-connector ${stepCompleted ? 'connector-done' : ''}`}></div>
                    )}
                    <div className="timeline-label">{step.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main grid */}
          <div className="dashboard-grid">

            {/* Today's tasks */}
            <div className="tasks-card">
              <div className="card-header-row">
                <h3>📋 Today&apos;s Tasks</h3>
                <span className="tasks-count">{completedTasks.filter(t =>
                  roadmap.steps[activeStep]?.tasks.includes(t)
                ).length}/{roadmap.steps[activeStep]?.tasks.length || 0}</span>
              </div>

              <div className="step-selector">
                {roadmap.steps.map((step, index) => (
                  <button
                    key={step.id}
                    className={`step-pill ${activeStep === index ? 'step-pill-active' : ''}`}
                    onClick={() => setActiveStep(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="tasks-list">
                {roadmap.steps[activeStep]?.tasks.map((task, i) => (
                  <div
                    key={i}
                    className={`task-item ${completedTasks.includes(task) ? 'task-completed' : ''}`}
                    onClick={() => toggleTask(task)}
                  >
                    <div className={`task-checkbox ${completedTasks.includes(task) ? 'checked' : ''}`}>
                      {completedTasks.includes(task) ? '✓' : ''}
                    </div>
                    <span>{task}</span>
                    {!completedTasks.includes(task) && (
                      <span className="task-xp">+10 XP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current step detail */}
            <div className="step-card">
              <div className="step-card-header">
                <div className="step-num-big">{activeStep + 1}</div>
                <div>
                  <h2>{roadmap.steps[activeStep]?.title}</h2>
                  <span className="duration-pill">⏱ {roadmap.steps[activeStep]?.duration}</span>
                </div>
              </div>

              <p className="step-desc">{roadmap.steps[activeStep]?.description}</p>

              <div className="resources-section">
                <h4>📚 Resources</h4>
                {roadmap.steps[activeStep]?.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                  >
                    <div className="resource-type">{resource.type}</div>
                    <div className="resource-name">{resource.name}</div>
                    <div className="resource-arrow">→</div>
                  </a>
                ))}
            </div>
          </div>

        </div>
      </div>
  )}

    </div >
  );
}