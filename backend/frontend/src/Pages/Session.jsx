import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import './Session.css';

const DEFAULT_SUBJECTS = ['Django', 'Python', 'React', 'MySQL', 'DSA'];

export default function Session() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Session form state
    const [subjectsList, setSubjectsList] = useState(DEFAULT_SUBJECTS);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [customSubject, setCustomSubject] = useState('');
    const [isCustomSubject, setIsCustomSubject] = useState(false);
    const [topic, setTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Timer & Session state
    // 'idle' | 'active' | 'completed'
    const [sessionState, setSessionState] = useState('idle');
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Completed summary state
    const [completedSummary, setCompletedSummary] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [recentSessions, setRecentSessions] = useState([]);

    // Fetch subjects & previous sessions from API
    useEffect(() => {
        fetch('/api/subjects')
            .then(res => res.json())
            .then(data => {
                if (data && data.subjects && data.subjects.length > 0) {
                    const names = data.subjects.map(s => s.name);
                    setSubjectsList(Array.from(new Set([...names, ...DEFAULT_SUBJECTS])));
                }
            })
            .catch(() => {});

        fetchRecentSessions();
    }, []);

    const fetchRecentSessions = () => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                if (data && data.sessions) {
                    setRecentSessions(data.sessions);
                }
            })
            .catch(() => {});
    };

    // Pre-populate from URL query params (e.g. /session?subject=Django&topic=REST%20Framework)
    useEffect(() => {
        const querySub = searchParams.get('subject');
        const queryTopic = searchParams.get('topic');

        if (querySub) {
            setSelectedSubject(querySub);
            if (!DEFAULT_SUBJECTS.includes(querySub)) {
                setSubjectsList(prev => prev.includes(querySub) ? prev : [...prev, querySub]);
            }
        }
        if (queryTopic) {
            setTopic(queryTopic);
        }
    }, [searchParams]);

    // Timer interval effect
    useEffect(() => {
        if (sessionState === 'active') {
            startTimeRef.current = Date.now() - seconds * 1000;
            timerRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTimeRef.current) / 1000);
                setSeconds(elapsed);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [sessionState]);

    // Format seconds into HH:MM:SS
    const formatTime = (totalSecs) => {
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    // Start Session handler
    const handleStartSession = (e) => {
        e?.preventDefault();
        const activeSub = isCustomSubject ? customSubject.trim() : selectedSubject;

        if (!activeSub) {
            setErrorMessage('Please select or enter a subject to start.');
            return;
        }

        setErrorMessage('');
        setSeconds(0);
        setSessionState('active');
    };

    // Stop Session handler
    const handleStopSession = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        const activeSub = isCustomSubject ? customSubject.trim() : selectedSubject;
        const activeTopic = topic.trim() || 'General Focus';
        const finalSecs = seconds;
        const formatted = formatTime(finalSecs);
        const durationHours = (finalSecs / 3600).toFixed(2);

        const summary = {
            subject: activeSub,
            topic: activeTopic,
            seconds: finalSecs,
            formattedDuration: formatted,
            durationHours: durationHours,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setCompletedSummary(summary);
        setSessionState('completed');

        // Save session to backend
        setIsSaving(true);
        try {
            const res = await fetch('/api/sessions/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: activeSub,
                    topic: activeTopic,
                    seconds: finalSecs
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchRecentSessions();
            }
        } catch {
            // Silently continue in offline/guest mode
        } finally {
            setIsSaving(false);
        }
    };

    // Reset to start a new session
    const handleResetSession = () => {
        setSessionState('idle');
        setSeconds(0);
        setCompletedSummary(null);
        setErrorMessage('');
    };

    // Active subject label display
    const currentSubjectName = isCustomSubject ? customSubject.trim() : selectedSubject;

    return (
        <main className="session-page">
            <div className="session-container">
                {/* Header Banner */}
                <section className="session-hero">
                    <div className="session-hero-content">
                        <div className="session-hero-badge">
                            <span className="session-pulse-dot"></span>
                            <span>Focus Mode</span>
                        </div>
                        <h1 className="session-hero-title">Study Session</h1>
                        <p className="session-hero-subtitle">
                            Track deep work intervals, record your topics, and stay accountable.
                        </p>
                    </div>

                    <div className="session-hero-actions">
                        <Link to="/" className="session-nav-back">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span>Dashboard</span>
                        </Link>

                    </div>
                </section>

                {/* Main Interactive Session Card */}
                <div className="session-card-wrapper">
                    <div className={`session-card ${sessionState === 'active' ? 'session-card-active' : ''}`}>
                        {/* Glow effect backdrops */}
                        <div className="session-card-glow"></div>

                        {sessionState !== 'active' ? (
                            /* =========================================================
                               1. START NEW SESSION VIEW
                               ========================================================= */
                            <div className="session-form-view">
                                <div className="session-card-header">
                                    <div className="header-icon-box">
                                        <span className="material-symbols-outlined header-symbol">play_circle</span>
                                    </div>
                                    <h2 className="session-card-title">START NEW SESSION</h2>
                                    <p className="session-card-desc">Configure your study topic and start the timer.</p>
                                </div>

                                {errorMessage && (
                                    <div className="session-alert session-alert-error">
                                        <span className="material-symbols-outlined">error</span>
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="session-field-group">
                                    <label htmlFor="session-subject-select" className="session-field-label">
                                        Subject
                                    </label>
                                    
                                    {!isCustomSubject ? (
                                        <div className="session-select-wrapper">
                                            <select
                                                id="session-subject-select"
                                                className="session-select"
                                                value={selectedSubject}
                                                onChange={(e) => {
                                                    if (e.target.value === '__custom__') {
                                                        setIsCustomSubject(true);
                                                        setSelectedSubject('');
                                                    } else {
                                                        setSelectedSubject(e.target.value);
                                                    }
                                                    setErrorMessage('');
                                                }}
                                            >
                                                <option value="" disabled>Select subject ▼</option>
                                                {subjectsList.map((sub) => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                                <option value="__custom__">+ Add Custom Subject...</option>
                                            </select>
                                            <span className="material-symbols-outlined select-chevron">expand_more</span>
                                        </div>
                                    ) : (
                                        <div className="session-custom-subject-row">
                                            <input
                                                type="text"
                                                className="session-input"
                                                placeholder="Enter new subject name..."
                                                value={customSubject}
                                                onChange={(e) => {
                                                    setCustomSubject(e.target.value);
                                                    setErrorMessage('');
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                className="session-cancel-custom-btn"
                                                onClick={() => {
                                                    setIsCustomSubject(false);
                                                    setCustomSubject('');
                                                }}
                                                title="Back to subject list"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="session-field-group">
                                    <label htmlFor="session-topic-input" className="session-field-label">
                                        Topic
                                    </label>
                                    <div className="session-input-wrapper">
                                        <input
                                            id="session-topic-input"
                                            type="text"
                                            className="session-input"
                                            placeholder="e.g. REST Framework"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Digital Clock Display */}
                                <div className="session-timer-container">
                                    <div className="timer-digital-display idle-timer">
                                        <span className="timer-digits">00:00:00</span>
                                    </div>
                                    <span className="timer-sub-label">Ready to start</span>
                                </div>

                                {/* Start Session Button */}
                                <button
                                    type="button"
                                    id="start-session-btn"
                                    className="session-primary-btn start-btn"
                                    onClick={handleStartSession}
                                >
                                    <span className="material-symbols-outlined btn-icon">play_arrow</span>
                                    <span>Start Session</span>
                                </button>
                            </div>
                        ) : (
                            /* =========================================================
                               2. SESSION ACTIVE VIEW
                               ========================================================= */
                            <div className="session-active-view">
                                <div className="session-card-header active-header">
                                    <div className="live-indicator-pill">
                                        <span className="pulsing-live-dot"></span>
                                        <span>LIVE</span>
                                    </div>
                                    <h2 className="session-card-title active-title">SESSION ACTIVE</h2>
                                    <p className="session-card-desc">Stay focused! Your study session is actively ticking.</p>
                                </div>

                                {/* Subject & Topic Display info */}
                                <div className="session-active-meta-card">
                                    <div className="active-meta-row">
                                        <span className="meta-row-label">Subject:</span>
                                        <span className="meta-row-value subject-highlight">
                                            {currentSubjectName || 'Django'}
                                        </span>
                                    </div>
                                    <div className="active-meta-row">
                                        <span className="meta-row-label">Topic:</span>
                                        <span className="meta-row-value topic-highlight">
                                            {topic.trim() || 'REST Framework'}
                                        </span>
                                    </div>
                                </div>

                                {/* Active Digital Clock Display */}
                                <div className="session-timer-container active-timer-box">
                                    <div className="timer-digital-display active-timer">
                                        <span className="timer-digits">{formatTime(seconds)}</span>
                                    </div>
                                    <span className="timer-sub-label active-sub-label">
                                        Elapsed Study Time
                                    </span>
                                </div>

                                {/* Stop Session Button */}
                                <button
                                    type="button"
                                    id="stop-session-btn"
                                    className="session-primary-btn stop-btn"
                                    onClick={handleStopSession}
                                >
                                    <span className="material-symbols-outlined btn-icon">stop</span>
                                    <span>Stop Session</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal when session complete */}
                {sessionState === 'completed' && completedSummary && (
                    <div className="session-modal-overlay">
                        <div className="session-modal-card">
                            <div className="modal-confetti-header">
                                <div className="modal-icon-badge">
                                    <span className="material-symbols-outlined modal-check-symbol">celebration</span>
                                </div>
                                <h3 className="modal-title">Session Complete!</h3>
                                <p className="modal-desc">Great job on dedicating focused time towards your learning.</p>
                            </div>

                            <div className="modal-summary-box">
                                <div className="summary-item">
                                    <span className="summary-label">Subject</span>
                                    <span className="summary-value summary-subject">{completedSummary.subject}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Topic</span>
                                    <span className="summary-value summary-topic">{completedSummary.topic}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Duration</span>
                                    <span className="summary-value summary-time">{completedSummary.formattedDuration}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Study Log</span>
                                    <span className="summary-value summary-hours">{completedSummary.durationHours} hrs</span>
                                </div>
                            </div>

                            {isSaving && (
                                <div className="modal-saving-state">
                                    <span className="material-symbols-outlined spin-icon">sync</span>
                                    <span>Saving session to tracker...</span>
                                </div>
                            )}

                            <div className="modal-actions-row">
                                <button
                                    type="button"
                                    className="modal-action-btn primary-action"
                                    onClick={handleResetSession}
                                >
                                    <span className="material-symbols-outlined">restart_alt</span>
                                    <span>Start New Session</span>
                                </button>

                                <button
                                    type="button"
                                    className="modal-action-btn secondary-action"
                                    onClick={() => navigate('/')}
                                >
                                    <span className="material-symbols-outlined">home</span>
                                    <span>Go to Dashboard</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
