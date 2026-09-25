import { useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        fetch('/api/messages')
            .then(r => r.json())
            .then(data => {
                if (data.messages && data.messages.length > 0) {
                    setToasts(data.messages);
                    // auto-dismiss after 5 s
                    setTimeout(() => setToasts([]), 5000);
                }
            })
            .catch(() => {}); // silently ignore network errors
    }, []);

    const dismissToast = (idx) =>
        setToasts(prev => prev.filter((_, i) => i !== idx));

    const subjects = [
        {
            name: 'Python',
            emoji: '🐍',
            subtitle: 'Backend & Data Structures',
            hours: '8.5 hrs',
            colorTag: 'tag-indigo'
        },
        {
            name: 'Django',
            emoji: '⚡',
            subtitle: 'Web Framework & REST APIs',
            hours: '5.0 hrs',
            colorTag: 'tag-sky'
        },
        {
            name: 'React',
            emoji: '⚛️',
            subtitle: 'Frontend UI & Hooks',
            hours: '3.5 hrs',
            colorTag: 'tag-cyan'
        }
    ];

    return (
        <main className="home-dashboard">
            <div className="home-dashboard-inner">
                {/* DJANGO MESSAGES TOAST */}
                {toasts.length > 0 && (
                    <div className="toast-container">
                        {toasts.map((t, i) => (
                            <div key={i} className={`toast toast-${t.level}`}>
                                <span className="toast-text">{t.text}</span>
                                <button className="toast-close" onClick={() => dismissToast(i)} aria-label="Dismiss">✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 1. GREETING HERO BANNER */}

                <section className="greeting">
                    <div className="greeting-content">
                        <div className="greeting-badge">
                            <span className="greeting-badge-dot"></span>
                            <span>Daily Focus</span>
                        </div>
                        <h1 className="greeting-title">
                            Good Morning, Neev <span className="greeting-emoji">👋</span>
                        </h1>
                        <p className="greeting-subtitle">
                            Keep going! Every hour counts towards your goals.
                        </p>
                    </div>
                    <div className="greeting-meta">
                        <div className="greeting-meta-card">
                            <span className="material-symbols-outlined greeting-meta-icon">local_fire_department</span>
                            <div>
                                <span className="greeting-meta-label">Status</span>
                                <span className="greeting-meta-val">On Track 🔥</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. STATS CARDS */}
                <section className="stats-section">
                    <div className="stats-grid">
                        {/* Stat 1: Today's Study */}
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Today's study</span>
                                <div className="stat-icon-wrapper icon-indigo">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                            </div>
                            <div className="stat-value-row">
                                <span className="stat-value">3.5</span>
                                <span className="stat-unit">Hours</span>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-trend positive">
                                    <span className="material-symbols-outlined">trending_up</span> +45m
                                </span>
                                <span className="stat-foot-note">vs yesterday</span>
                            </div>
                        </div>

                        {/* Stat 2: This Week */}
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">This week</span>
                                <div className="stat-icon-wrapper icon-sky">
                                    <span className="material-symbols-outlined">date_range</span>
                                </div>
                            </div>
                            <div className="stat-value-row">
                                <span className="stat-value">17</span>
                                <span className="stat-unit">Hours</span>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-foot-note">Target: 25 hrs / wk</span>
                            </div>
                        </div>

                        {/* Stat 3: Current Streak */}
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Current streak</span>
                                <div className="stat-icon-wrapper icon-amber">
                                    <span className="stat-emoji-icon">🔥</span>
                                </div>
                            </div>
                            <div className="stat-value-row">
                                <span className="stat-value">5</span>
                                <span className="stat-unit">Days</span>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-badge-pill">Best: 12 days</span>
                            </div>
                        </div>

                        {/* Stat 4: Goal Progress */}
                        <div className="stat-card">
                            <div className="stat-card-header">
                                <span className="stat-label">Goal Progress</span>
                                <div className="stat-icon-wrapper icon-emerald">
                                    <span className="material-symbols-outlined">track_changes</span>
                                </div>
                            </div>
                            <div className="stat-value-row">
                                <span className="stat-value">42%</span>
                            </div>
                            <div className="stat-footer">
                                <div className="stat-progress-bar">
                                    <div className="stat-progress-fill" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SUBJECTS SECTION */}
                <section className="subjects-section">
                    <div className="subjects-header">
                        <div className="subjects-title-group">
                            <span className="material-symbols-outlined subjects-title-icon">menu_book</span>
                            <h2 className="subjects-title">Your Subjects</h2>
                            <span className="subjects-badge">3 Total</span>
                        </div>
                        <a href="#subjects" className="view-all-btn">
                            <span>view all</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>

                    <div className="subjects-grid">
                        {subjects.map((sub) => (
                            <div key={sub.name} className="subject-card">
                                <div className="subject-card-left">
                                    <div className="subject-emoji-badge">
                                        <span>{sub.emoji}</span>
                                    </div>
                                    <div className="subject-info">
                                        <h3 className="subject-name">{sub.name}</h3>
                                        <p className="subject-subtitle">{sub.subtitle}</p>
                                    </div>
                                </div>
                                <div className="subject-card-right">
                                    <span className="subject-hours">{sub.hours}</span>
                                    <span className={`subject-status-tag ${sub.colorTag}`}>Active</span>
                                    <span className="material-symbols-outlined subject-arrow">chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
