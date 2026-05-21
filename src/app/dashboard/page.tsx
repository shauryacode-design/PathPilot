"use client"
import { useEffect, useState } from "react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
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
  id?: string;
  createdAt?: string;
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

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const savedSingle = localStorage.getItem('roadmap');
    const savedMultiple = localStorage.getItem('roadmaps');
    let roadmapsList: Roadmap[] = [];

    if (savedMultiple) {
      try {
        roadmapsList = JSON.parse(savedMultiple);
      } catch (e) {
        roadmapsList = [];
      }
    } else if (savedSingle) {
      try {
        const parsedLegacy = JSON.parse(savedSingle);
        if (!parsedLegacy.id) {
          parsedLegacy.id = 'legacy';
        }
        roadmapsList = [parsedLegacy];
        localStorage.setItem('roadmaps', JSON.stringify(roadmapsList));
      } catch (e) { }
    }

    setRoadmaps(roadmapsList);

    if (roadmapsList.length > 0) {
      let activeId = localStorage.getItem('activeRoadmapId');
      let currentActive = roadmapsList.find(r => r.id === activeId);

      if (!currentActive) {
        currentActive = roadmapsList[0];
        activeId = currentActive.id || 'legacy';
        localStorage.setItem('activeRoadmapId', activeId);
      }

      setRoadmap(currentActive);
      setActiveRoadmapId(activeId);

      // Sync cookie
      document.cookie = "has_roadmap=true; path=/; max-age=31536000";

      // Load completed tasks for active roadmap
      let savedTasks = localStorage.getItem(`completedTasks_${activeId}`);
      if (!savedTasks && activeId === 'legacy') {
        savedTasks = localStorage.getItem('completedTasks');
      }

      if (savedTasks) {
        setCompletedTasks(JSON.parse(savedTasks));
      } else {
        setCompletedTasks([]);
      }
    } else {
      setRoadmap(null);
      setCompletedTasks([]);
      document.cookie = "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

    const savedXp = localStorage.getItem('xp');
    if (savedXp) setXp(parseInt(savedXp));

    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) setStreak(parseInt(savedStreak));

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
    document.cookie = "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('completedTasks_') || key === 'roadmap' || key === 'roadmaps' || key === 'activeRoadmapId' || key === 'completedTasks' || key === 'xp' || key === 'streak' || key === 'lastVisit')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    router.push('/');
  };

  const switchRoadmap = (targetId: string) => {
    const target = roadmaps.find(r => r.id === targetId);
    if (!target) return;

    setRoadmap(target);
    setActiveRoadmapId(targetId);
    setActiveStep(0);
    localStorage.setItem('activeRoadmapId', targetId);
    localStorage.setItem('roadmap', JSON.stringify(target));

    let savedTasks = localStorage.getItem(`completedTasks_${targetId}`);
    if (!savedTasks && targetId === 'legacy') {
      savedTasks = localStorage.getItem('completedTasks');
    }

    if (savedTasks) {
      setCompletedTasks(JSON.parse(savedTasks));
    } else {
      setCompletedTasks([]);
    }
  };

  const getRoadmapProgress = (r: Roadmap) => {
    const rId = r.id || 'legacy';
    let rCompletedTasks: string[] = [];

    if (rId === activeRoadmapId) {
      rCompletedTasks = completedTasks;
    } else {
      let savedTasks = localStorage.getItem(`completedTasks_${rId}`);
      if (!savedTasks && rId === 'legacy') {
        savedTasks = localStorage.getItem('completedTasks');
      }
      rCompletedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    const rTotalTasks = r.steps.reduce((acc, step) => acc + step.tasks.length, 0) || 0;
    const completedCount = rCompletedTasks.filter(t =>
      r.steps.some(step => step.tasks.includes(t))
    ).length;

    return rTotalTasks > 0 ? Math.round((completedCount / rTotalTasks) * 100) : 0;
  };

  const toggleTask = (task: string) => {
    if (!roadmap) return;
    const isCompleting = !completedTasks.includes(task);
    const newTasks = isCompleting
      ? [...completedTasks, task]
      : completedTasks.filter(t => t !== task);

    setCompletedTasks(newTasks);

    const rId = activeRoadmapId || 'legacy';
    localStorage.setItem(`completedTasks_${rId}`, JSON.stringify(newTasks));
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
        <div className="dashboard-logo">
          <img src="/images/PathPilot-logos.png" alt="" />
        </div>
        <div className="dashboard-nav-right">
          <span className="welcome-text">Hi, {user?.firstName}</span>

          <div className="streak-badge" title={`${streak} day streak`}>
            <img src="/images/streak.svg" alt="" /> {streak} <span className="badge-text">day streak</span>
          </div>
          <div className="xp-badge" title={`${xp} XP`}>
            <img src="/images/level.svg" alt="" /> {xp} <span className="badge-text">XP</span>
          </div>
          <div className="level-badge" title={`Level ${level}`}>
            Lv.{level}
          </div>
          <button className="new-roadmap-btn" onClick={() => router.push('/onboarding?new=true')} title="Create New Roadmap">
            <span className="btn-icon">+</span> <span className="btn-text">New Roadmap</span>
          </button>
          <div className="clerk-profile-avatar">
            <UserButton />
          </div>
        </div>
      </nav>

      {/* Empty state */}
      {roadmaps.length === 0 && (
        <div className="empty-dashboard">
          <div className="empty-icon">🗺️</div>
          <h2>No Roadmap Yet</h2>
          <p>Generate your first personalized roadmap to get started</p>
          <button className="btn-generate" onClick={() => router.push('/onboarding')}>
            🚀 Generate My Roadmap
          </button>
        </div>
      )}

      {/* Dashboard Layout with Sidebar */}
      {roadmaps.length > 0 && (
        <div className="dashboard-layout-container">

          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-header-row">
              <h4 className="sidebar-title">My Paths</h4>
              <span className="ai-active-status">● Live</span>
            </div>
            <div className="roadmaps-list">
              {roadmaps.map((r) => {
                const rId = r.id || 'legacy';
                const isActive = rId === activeRoadmapId;
                const progressVal = getRoadmapProgress(r);
                return (
                  <button
                    key={rId}
                    className={`roadmap-menu-item ${isActive ? 'roadmap-menu-item-active' : ''}`}
                    onClick={() => switchRoadmap(rId)}
                  >
                    <span className="roadmap-item-icon"><img src="/images/goal.svg" alt="" /></span>
                    <div className="roadmap-item-info">
                      <span className="roadmap-item-title">{r.title || extractGoal(r.goal)}</span>
                      <span className="roadmap-item-progress-text">{progressVal}% done</span>
                      <div className="roadmap-item-progress-bar-container">
                        <div
                          className="roadmap-item-progress-bar-fill"
                          style={{ width: `${progressVal}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              className="sidebar-add-btn"
              onClick={() => router.push('/onboarding?new=true')}
            >
              ➕ Create New Path
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-main-area">
            {roadmap && (
              <div className="dashboard-content">

                {/* Hero strip */}
                <div className="hero-strip">
                  <div className="hero-strip-left">
                    <div className="hero-strip-badges">
                      <div className="goal-badge"><img src="/images/goal.svg" alt="" /> {extractGoal(roadmap.goal)}</div>
                    </div>
                    <h2>{roadmap.title || `Keep going, ${user?.firstName}!`}</h2>
                    <p>Welcome back! You have completed {completedTasks.length} of {totalTasks} tasks on this path · {roadmap.duration}</p>
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
                    <span><img src="/images/level.svg" alt="" /> Level {level}</span>
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
                      <h3><img src="/images/tasks-list.svg" alt="" /> Today&apos;s Tasks</h3>
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
                          <span className="tasks-text">{task}</span>
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
                        <h3>{roadmap.steps[activeStep]?.title}</h3>
                        <span className="duration-pill">⏱ {roadmap.steps[activeStep]?.duration}</span>
                      </div>
                    </div>

                    <p className="step-desc">{roadmap.steps[activeStep]?.description}</p>

                    <div className="resources-section">
                      <h4><img src="/images/resources.svg" alt="" /> Resources</h4>
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
          </main>
        </div>
      )}

      {/* Floating Action Button for Mobile View */}
      {roadmaps.length > 0 && (
        <button
          className="mobile-fab-add"
          onClick={() => router.push('/onboarding?new=true')}
          title="Create New Career Goal"
        >
          <span>➕</span>
        </button>
      )}

    </div >
  );
}