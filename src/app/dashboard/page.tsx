"use client"
import { useEffect, useState, type MouseEvent } from "react";
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

const JOB_PLATFORMS = [
  {
    name: "LinkedIn Jobs",
    description: "Internships, entry-level roles, and professional networking",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    name: "Indeed",
    description: "Large job board with internships and graduate roles worldwide",
    url: "https://www.indeed.com/",
  },
  {
    name: "Handshake",
    description: "Student-focused platform used by universities for campus hiring",
    url: "https://joinhandshake.com/",
  },
  {
    name: "Glassdoor",
    description: "Job listings with company reviews and salary insights",
    url: "https://www.glassdoor.com/Job/index.htm",
  },
  {
    name: "Wellfound",
    description: "Startup and tech jobs, including junior and internship roles",
    url: "https://wellfound.com/jobs",
  },
  {
    name: "Internshala",
    description: "Internships and entry-level opportunities for students",
    url: "https://internshala.com/",
  },
  {
    name: "Naukri Campus",
    description: "Campus placements and fresher jobs (India)",
    url: "https://www.naukri.com/campus",
  },
] as const;

const getCelebratedRoadmapIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("celebratedRoadmaps") || "[]");
  } catch {
    return [];
  }
};

const isRoadmapComplete = (r: Roadmap, tasks: string[]) => {
  const allTasks = r.steps.flatMap((step) => step.tasks);
  if (allTasks.length === 0) return false;
  const completedCount = tasks.filter((t) =>
    r.steps.some((step) => step.tasks.includes(t))
  ).length;
  return completedCount >= allTasks.length;
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoadmapCompleteModal, setShowRoadmapCompleteModal] = useState(false);
  const isStepUnlocked = (stepIndex: number) => {
    if (stepIndex === 0) return true; // first step always unlocked

    // Check if ALL tasks of previous step are completed
    const previousStep = roadmap?.steps[stepIndex - 1];
    if (!previousStep) return false;

    return previousStep.tasks.every(task => completedTasks.includes(task));
  };
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

  useEffect(() => {
    if (sidebarOpen || showRoadmapCompleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, showRoadmapCompleteModal]);

  useEffect(() => {
    if (!roadmap || !activeRoadmapId) return;
    if (!isRoadmapComplete(roadmap, completedTasks)) return;
    if (!getCelebratedRoadmapIds().includes(activeRoadmapId)) {
      setShowRoadmapCompleteModal(true);
    }
  }, [roadmap, completedTasks, activeRoadmapId]);

  const dismissRoadmapCompleteModal = () => {
    if (activeRoadmapId) {
      const ids = getCelebratedRoadmapIds();
      if (!ids.includes(activeRoadmapId)) {
        localStorage.setItem(
          "celebratedRoadmaps",
          JSON.stringify([...ids, activeRoadmapId])
        );
      }
    }
    setShowRoadmapCompleteModal(false);
  };

  const handleSignOut = async () => {
    await signOut();
    document.cookie = "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('completedTasks_') || key === 'roadmap' || key === 'roadmaps' || key === 'activeRoadmapId' || key === 'completedTasks' || key === 'celebratedRoadmaps' || key === 'xp' || key === 'streak' || key === 'lastVisit')) {
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
    setSidebarOpen(false);
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

  const deleteRoadmap = (targetId: string, e: MouseEvent) => {
    e.stopPropagation();

    const target = roadmaps.find((r) => (r.id || "legacy") === targetId);
    if (!target) return;

    const goalLabel = extractGoal(target.goal);
    if (
      !window.confirm(
        `Delete "Roadmap to become ${goalLabel}"? This cannot be undone.`
      )
    ) {
      return;
    }

    const updatedRoadmaps = roadmaps.filter(
      (r) => (r.id || "legacy") !== targetId
    );

    localStorage.removeItem(`completedTasks_${targetId}`);
    if (targetId === "legacy") {
      localStorage.removeItem("completedTasks");
    }
    localStorage.setItem("roadmaps", JSON.stringify(updatedRoadmaps));
    setRoadmaps(updatedRoadmaps);

    if (updatedRoadmaps.length === 0) {
      setRoadmap(null);
      setActiveRoadmapId(null);
      setCompletedTasks([]);
      setActiveStep(0);
      localStorage.removeItem("activeRoadmapId");
      localStorage.removeItem("roadmap");
      document.cookie =
        "has_roadmap=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      setSidebarOpen(false);
      return;
    }

    if (targetId === activeRoadmapId) {
      const next = updatedRoadmaps[0];
      const nextId = next.id || "legacy";
      setRoadmap(next);
      setActiveRoadmapId(nextId);
      setActiveStep(0);
      localStorage.setItem("activeRoadmapId", nextId);
      localStorage.setItem("roadmap", JSON.stringify(next));

      let savedTasks = localStorage.getItem(`completedTasks_${nextId}`);
      if (!savedTasks && nextId === "legacy") {
        savedTasks = localStorage.getItem("completedTasks");
      }
      setCompletedTasks(savedTasks ? JSON.parse(savedTasks) : []);
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

      const rId = activeRoadmapId || "legacy";
      if (
        isRoadmapComplete(roadmap, newTasks) &&
        !getCelebratedRoadmapIds().includes(rId)
      ) {
        setShowRoadmapCompleteModal(true);
      }
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
  const isCurrentRoadmapComplete =
    !!roadmap && isRoadmapComplete(roadmap, completedTasks);

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

      {/* Roadmap completion congratulations */}
      {showRoadmapCompleteModal && roadmap && (
        <div
          className="roadmap-complete-overlay"
          onClick={dismissRoadmapCompleteModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-complete-title"
        >
          <div
            className="roadmap-complete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="roadmap-complete-badge">🎉</div>
            <h2 id="roadmap-complete-title" className="roadmap-complete-title">
              Congratulations, {user?.firstName || "there"}!
            </h2>
            <p className="roadmap-complete-message">
              You&apos;ve completed your entire roadmap to become a{" "}
              <strong>{extractGoal(roadmap.goal)}</strong>. Every step is done —
              that&apos;s a huge achievement!
            </p>
            <div className="roadmap-complete-next">
              <h3>What&apos;s next?</h3>
              <p>
                Put your skills into practice — start applying for internships
                and entry-level roles in your field. Also check{" "}
                <strong>official company career pages</strong> for brands you
                want to work with; many post openings there first.
              </p>
            </div>
            <div className="roadmap-complete-platforms">
              <h4>Trusted places to find opportunities</h4>
              <ul>
                {JOB_PLATFORMS.map((platform) => (
                  <li key={platform.name}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="platform-name">{platform.name}</span>
                      <span className="platform-desc">{platform.description}</span>
                      <span className="platform-arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="roadmap-complete-dismiss"
              onClick={dismissRoadmapCompleteModal}
            >
              Continue my journey
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}

      <nav className="dashboard-nav">
        <div className="dashboard-nav-left">
          <button
            type="button"
            className="dashboard-hamburger"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle paths menu"
            aria-expanded={sidebarOpen}
          >
            <span className={sidebarOpen ? "active" : ""}></span>
            <span className={sidebarOpen ? "active" : ""}></span>
            <span className={sidebarOpen ? "active" : ""}></span>
          </button>
          <div className="dashboard-logo">
            <h1>PathPilot</h1>
          </div>
        </div>
        <div className="dashboard-nav-right">
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
        <div className="clerk-mobile-profileavatar">
          <UserButton />
        </div>
      </nav>

      {/* Empty state */}
      {roadmaps.length === 0 && (
        <div className="empty-dashboard">
          <div className="empty-icon">🗺️</div>
          <h2>No Roadmap Yet</h2>
          <p>Generate your first personalized roadmap to get started</p>
          <button className="btn-generate" onClick={() => router.push('/onboarding')}>
            Generate My Roadmap
          </button>
        </div>
      )}

      {/* Dashboard Layout with Sidebar */}
      {roadmaps.length > 0 && (
        <div className="dashboard-layout-container">

          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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
                  <div
                    key={rId}
                    className={`roadmap-menu-item ${isActive ? "roadmap-menu-item-active" : ""}`}
                  >
                    <button
                      type="button"
                      className="roadmap-item-body"
                      onClick={() => switchRoadmap(rId)}
                    >
                      <span className="roadmap-item-icon">
                        <img src="/images/goal.svg" alt="" />
                      </span>
                      <div className="roadmap-item-info">
                        <span className="roadmap-item-title">
                          Roadmap to become {extractGoal(r.goal)}
                        </span>
                        <span className="roadmap-item-progress-text">
                          {progressVal}% done
                        </span>
                        <div className="roadmap-item-progress-bar-container">
                          <div
                            className="roadmap-item-progress-bar-fill"
                            style={{ width: `${progressVal}%` }}
                          ></div>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="roadmap-delete-btn"
                      onClick={(e) => deleteRoadmap(rId, e)}
                      aria-label={`Delete path: ${extractGoal(r.goal)}`}
                      title="Delete path"
                    >
                      <img src="/images/trash.svg" alt="" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              className="sidebar-add-btn"
              onClick={() => {
                setSidebarOpen(false);
                router.push('/onboarding?new=true');
              }}
            >
              ➕ Create New Path
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-main-area">
            {roadmap && (
              <div className="dashboard-content">
                <div className="user-details">
                  <div className="streak-badge" title={`${streak} day streak`}>
                    <img src="/images/streak.svg" alt="" /> {streak} <span className="badge-text">day streak</span>
                  </div>
                  <div className="xp-badge" title={`${xp} XP`}>
                    <img src="/images/level.svg" alt="" /> {xp} <span className="badge-text">XP</span>
                  </div>
                  <div className="level-badge" title={`Level ${level}`}>
                    Lv.{level}
                  </div>
                </div>
                {/* Hero strip */}
                <div className="hero-strip">
                  <div className="hero-strip-left">
                    <div className="hero-strip-badges">
                      <div className="goal-badge"><img src="/images/goal.svg" alt="" /> {extractGoal(roadmap.goal)}</div>
                    </div>
                    <span className="welcome-text">Hi, {user?.firstName}</span>
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

                {isCurrentRoadmapComplete && (
                  <div className="career-resources-card">
                    <div className="career-resources-content">
                      <span className="career-resources-icon" aria-hidden="true">
                        🎯
                      </span>
                      <div className="career-resources-text">
                        <h3>Path complete — ready to apply!</h3>
                        <p>
                          You finished your roadmap to become a{" "}
                          <strong>{extractGoal(roadmap.goal)}</strong>. Open your
                          career resources anytime to find internships and jobs on
                          trusted platforms.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="career-resources-btn"
                      onClick={() => setShowRoadmapCompleteModal(true)}
                    >
                      View job &amp; internship platforms
                    </button>
                  </div>
                )}

                {/* Roadmap Timeline */}
                <div className="timeline-section">
                  <h3>Your Roadmap</h3>
                  <div className="timeline-nodes">
                    {roadmap.steps.map((step, index) => {
                      const stepTasks = step.tasks;
                      const stepCompleted = stepTasks.every(t => completedTasks.includes(t));
                      const stepInProgress = stepTasks.some(t => completedTasks.includes(t)) && !stepCompleted;
                      const unlocked = isStepUnlocked(index);

                      return (
                        <div key={step.id} className="timeline-item">
                          <div
                            className={`timeline-node 
                    ${!unlocked ? 'node-locked' : ''}
                    ${unlocked && stepCompleted ? 'node-done' : ''}
                    ${unlocked && stepInProgress ? 'node-progress' : ''}
                    ${unlocked && activeStep === index ? 'node-active' : ''}
                `}
                            onClick={() => {
                              if (!unlocked) {
                                alert(`Complete all tasks in Step ${index} first!`);
                                return;
                              }
                              setActiveStep(index);
                            }}
                          >
                            {!unlocked ? <img src="/images/lock.svg" className="lock-img" alt="" /> : stepCompleted ? '✓' : index + 1}
                          </div>
                          {index < roadmap.steps.length - 1 && (
                            <div className={`timeline-connector ${stepCompleted ? 'connector-done' : ''}`}></div>
                          )}
                          <div className={`timeline-label ${!unlocked ? 'label-locked' : ''}`}>
                            {step.title}
                          </div>
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
                      {roadmap.steps.map((step, index) => {
                        const unlocked = isStepUnlocked(index);
                        return (
                          <button
                            key={step.id}
                            className={`step-pill 
                    ${activeStep === index ? 'step-pill-active' : ''}
                    ${!unlocked ? 'step-pill-locked' : ''}
                 `}
                            onClick={() => {
                              if (!unlocked) {
                                alert(`Complete all tasks in Step ${index} first!`);
                                return;
                              }
                              setActiveStep(index);
                            }}
                            title={!unlocked ? `Complete Step ${index} first` : step.title}
                          >
                            {!unlocked ? <img src="/images/lock.svg" className="lock-img" alt="" /> : index + 1}
                          </button>
                        );
                      })}
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
          <span><img src="/images/plus.svg" alt="" /></span>
        </button>
      )}
    </div>
  );
}