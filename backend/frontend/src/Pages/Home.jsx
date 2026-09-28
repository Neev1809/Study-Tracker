import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ResponsiveContainer,
    LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell
} from 'recharts';
import './Home.css';

/* ── Color Palette ── */
const COLORS = {
    green:  '#10b981',
    blue:   '#3b82f6',
    purple: '#8b5cf6',
    amber:  '#f59e0b',
    indigo: '#6366f1',
    cyan:   '#06b6d4',
};

/* ── Subject Progress Data ── */
const subjects = [
    {
        name: 'Django',
        badgeType: 'text',
        badgeText: 'dj',
        studied: 18,
        target: 40,
        color: 'green',
        colorHex: COLORS.green,
        subtitle: 'Web Framework & REST APIs'
    },
    {
        name: 'MySQL',
        badgeType: 'icon',
        badgeIcon: 'database',
        studied: 12,
        target: 30,
        color: 'blue',
        colorHex: COLORS.blue,
        subtitle: 'Relational Database & SQL'
    },
    {
        name: 'DSA',
        badgeType: 'icon',
        badgeIcon: 'psychology',
        studied: 8,
        target: 50,
        color: 'purple',
        colorHex: COLORS.purple,
        subtitle: 'Algorithms & Problem Solving'
    },
    {
        name: 'Python',
        badgeType: 'emoji',
        badgeIcon: '🐍',
        studied: 20,
        target: 40,
        color: 'amber',
        colorHex: COLORS.amber,
        subtitle: 'Data Structures & Core Lang'
    },
];

/* ── Weekly Study Hours Line Chart Data ── */
const weeklyData = [
    { day: 'Mon', date: '14 Apr', hours: 1.5 },
    { day: 'Tue', date: '15 Apr', hours: 2.0 },
    { day: 'Wed', date: '16 Apr', hours: 3.5 },
    { day: 'Thu', date: '17 Apr', hours: 6.5 },
    { day: 'Fri', date: '18 Apr', hours: 2.5 },
    { day: 'Sat', date: '19 Apr', hours: 4.0 },
    { day: 'Sun', date: '20 Apr', hours: 1.0 },
];

/* ── Subject Breakdown Distribution Data ── */
const breakdownData = [
    { name: 'Django', hours: 5.5, percent: 31, colorHex: COLORS.green },
    { name: 'MySQL',  hours: 4.0, percent: 23, colorHex: COLORS.blue },
    { name: 'DSA',    hours: 3.5, percent: 20, colorHex: COLORS.purple },
    { name: 'Python', hours: 4.5, percent: 26, colorHex: COLORS.amber },
];

/* ── Recent Achievements ── */
const achievements = [
    {
        icon: '🔥',
        title: '5 Day Streak',
        desc: "You've studied for 5 days in a row!",
        date: 'Apr 19, 2026',
        iconClass: 'ach-icon-fire',
        achColor: '#f59e0b'
    },
    {
        icon: '🎯',
        title: 'Goal Progress',
        desc: 'Reached 50% of Python goal',
        date: 'Apr 18, 2026',
        iconClass: 'ach-icon-goal',
        achColor: '#10b981'
    },
    {
        icon: '📅',
        title: 'Weekly Goal',
        desc: 'Completed 5/7 study days',
        date: 'Apr 18, 2026',
        iconClass: 'ach-icon-weekly',
        achColor: '#6366f1'
    },
    {
        icon: '⭐',
        title: 'First Session',
        desc: 'Logged your first study session',
        date: 'Apr 14, 2026',
        iconClass: 'ach-icon-star',
        achColor: '#eab308'
    },
];

const studyDays = [true, true, true, true, true, false, false]; // M–S (5 days)
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* ── Custom Chart Tooltip ── */
function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return (
        <div className="home-chart-tooltip">
            <div className="chart-tooltip-header">{point.day}, {point.date}</div>
            <div className="chart-tooltip-val">
                <strong>{point.hours}</strong><span> hrs</span>
            </div>
        </div>
    );
}

export default function Home() {
    const [toasts, setToasts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [animatedBars, setAnimatedBars] = useState(false);
    const [dateRange, setDateRange] = useState('Apr 14, 2026 – Apr 20, 2026');

    // Trigger bar animations on mount
    useEffect(() => {
        const timer = setTimeout(() => setAnimatedBars(true), 150);
        return () => clearTimeout(timer);
    }, []);

    // Fetch messages & current user
    useEffect(() => {
        fetch('/api/messages')
            .then(r => r.json())
            .then(data => {
                if (data.messages && data.messages.length > 0) {
                    setToasts(data.messages);
                    setTimeout(() => setToasts([]), 5000);
                }
            })
            .catch(() => {});

        fetch('/api/user')
            .then(r => r.json())
            .then(data => {
                if (data && data.isAuthenticated) {
                    setCurrentUser(data);
                }
            })
            .catch(() => {});
    }, []);

    const dismissToast = (idx) =>
        setToasts(prev => prev.filter((_, i) => i !== idx));

    /* Computed Metrics */
    const totalStudyHours = 17.5;
    const totalGoals = 3;
    const currentStreak = 5;
    const studyDaysCount = studyDays.filter(Boolean).length;

    // Overall completion donut chart data
    const overallDonutData = useMemo(() => subjects.map(s => ({
        name: s.name,
        value: Math.round((s.studied / s.target) * 100),
        color: s.colorHex,
    })), []);

    const overallPercentage = 34; // matches reference 34% completed

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

                {/* 1. DASHBOARD HEADER BANNER */}
                <section className="dashboard-hero">
                    <div className="dashboard-hero-left">
                        <div className="dashboard-hero-badge">
                            <span className="hero-pulse-dot"></span>
                            <span>Dashboard Overview</span>
                        </div>
                        <h1 className="dashboard-hero-title">
                            Good Morning, {currentUser?.firstName || currentUser?.username || 'Neev'} <span className="hero-wave-emoji">👋</span>
                        </h1>
                        <p className="dashboard-hero-subtitle">
                            Track your learning journey and see how far you've come!
                        </p>
                    </div>

                    <div className="dashboard-hero-right">
                        {/* Date Range Filter Selector */}
                        <div className="dashboard-date-filter" title="Current Study Week">
                            <span className="material-symbols-outlined filter-cal-icon">calendar_month</span>
                            <span className="filter-date-text">{dateRange}</span>
                            <span className="material-symbols-outlined filter-chevron">expand_more</span>
                        </div>

                        {/* Start Session CTA */}
                        <Link to="/session" className="dashboard-start-btn" title="Launch new focus session">
                            <span className="material-symbols-outlined">play_arrow</span>
                            <span>Start Session</span>
                        </Link>
                    </div>
                </section>

                {/* 2. TOP METRIC SUMMARY CARDS (4 Cards) */}
                <section className="metrics-grid">
                    {/* Card 1: Total Study Hours */}
                    <div className="metric-card">
                        <div className="metric-card-top">
                            <div className="metric-icon-circle icon-green-ring">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <span className="metric-label">Total Study Hours</span>
                        </div>
                        <div className="metric-value-row">
                            <span className="metric-number">{totalStudyHours}</span>
                            <span className="metric-unit">hrs</span>
                        </div>
                        <div className="metric-footer">
                            <span className="metric-trend positive">
                                <span className="material-symbols-outlined">trending_up</span>
                                +6.5 hrs
                            </span>
                            <span className="metric-subtext">vs last week</span>
                        </div>
                    </div>

                    {/* Card 2: Total Goals */}
                    <div className="metric-card">
                        <div className="metric-card-top">
                            <div className="metric-icon-circle icon-blue-ring">
                                <span className="material-symbols-outlined">track_changes</span>
                            </div>
                            <span className="metric-label">Total Goals</span>
                        </div>
                        <div className="metric-value-row">
                            <span className="metric-number">{totalGoals}</span>
                        </div>
                        <div className="metric-footer">
                            <span className="metric-status-text">
                                <span className="status-highlight">2 on track</span> · <span className="status-warn">1 behind</span>
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Current Streak */}
                    <div className="metric-card">
                        <div className="metric-card-top">
                            <div className="metric-icon-circle icon-amber-ring">
                                <span className="streak-fire-symbol">🔥</span>
                            </div>
                            <span className="metric-label">Current Streak</span>
                        </div>
                        <div className="metric-value-row">
                            <span className="metric-number">{currentStreak}</span>
                            <span className="metric-unit">days</span>
                        </div>
                        <div className="metric-footer">
                            <span className="metric-subtext streak-subtext">Keep it going!</span>
                        </div>
                    </div>

                    {/* Card 4: Study Days This Week */}
                    <div className="metric-card">
                        <div className="metric-card-top">
                            <div className="metric-icon-circle icon-purple-ring">
                                <span className="material-symbols-outlined">date_range</span>
                            </div>
                            <span className="metric-label">Study Days This Week</span>
                        </div>
                        <div className="metric-value-row">
                            <span className="metric-number">{studyDaysCount} / 7</span>
                        </div>
                        <div className="metric-footer days-footer">
                            <div className="metric-days-dots">
                                {studyDays.map((active, idx) => (
                                    <span
                                        key={idx}
                                        className={`day-dot ${active ? 'day-active' : 'day-inactive'}`}
                                        title={`${dayLabels[idx]}: ${active ? 'Studied' : 'Rest'}`}
                                    ></span>
                                ))}
                            </div>
                            <div className="metric-days-labels">
                                {dayLabels.map((label, idx) => (
                                    <span key={idx}>{label}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. ROW 1: SUBJECT PROGRESS + OVERALL PROGRESS */}
                <div className="dashboard-dual-grid">
                    {/* Subject Progress */}
                    <div className="dashboard-panel">
                        <div className="panel-header">
                            <div className="panel-title-wrapper">
                                <span className="material-symbols-outlined panel-icon-blue">menu_book</span>
                                <h2 className="panel-title-text">Subject Progress</h2>
                            </div>

                        </div>

                        <div className="subject-progress-stack">
                            {subjects.map((sub) => {
                                const percent = Math.round((sub.studied / sub.target) * 100);
                                return (
                                    <div key={sub.name} className="subject-progress-row">
                                        {/* Left: Brand Badge & Info */}
                                        <div className="subject-row-left">
                                            <div className={`subject-custom-badge badge-${sub.color}`}>
                                                {sub.badgeType === 'text' && <span className="badge-text-tag">{sub.badgeText}</span>}
                                                {sub.badgeType === 'icon' && <span className="material-symbols-outlined badge-sym">{sub.badgeIcon}</span>}
                                                {sub.badgeType === 'emoji' && <span className="badge-emoji-tag">{sub.badgeIcon}</span>}
                                            </div>
                                            <div className="subject-row-meta">
                                                <div className="subject-meta-name">{sub.name}</div>
                                                <div className="subject-meta-hours">{sub.studied} / {sub.target} hrs</div>
                                            </div>
                                        </div>

                                        {/* Center: Bar Track & Fill */}
                                        <div className="subject-row-center">
                                            <div className="progress-bar-track">
                                                <div
                                                    className={`progress-bar-fill fill-${sub.color}`}
                                                    style={{ width: animatedBars ? `${percent}%` : '0%' }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Right: Percent & Quick Study Action */}
                                        <div className="subject-row-right">
                                            <span className="subject-percent-tag">{percent}%</span>
                                            <Link
                                                to={`/session?subject=${encodeURIComponent(sub.name)}`}
                                                className="subject-quick-study-btn"
                                                title={`Start session on ${sub.name}`}
                                            >
                                                <span className="material-symbols-outlined">play_arrow</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Overall Progress (Donut Chart) */}
                    <div className="dashboard-panel">
                        <div className="panel-header">
                            <div className="panel-title-wrapper">
                                <span className="material-symbols-outlined panel-icon-blue">donut_large</span>
                                <h2 className="panel-title-text">Overall Progress</h2>
                            </div>
                        </div>

                        <div className="overall-donut-container">
                            <div className="donut-chart-box">
                                <ResponsiveContainer width="100%" height={175}>
                                    <PieChart>
                                        <Pie
                                            data={overallDonutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="65%"
                                            outerRadius="92%"
                                            paddingAngle={4}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {overallDonutData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="donut-center-content">
                                    <span className="donut-big-number">{overallPercentage}%</span>
                                    <span className="donut-small-sub">Completed</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="donut-legend-list">
                                {subjects.map((sub) => {
                                    const percent = Math.round((sub.studied / sub.target) * 100);
                                    return (
                                        <div key={sub.name} className="donut-legend-item">
                                            <span className="donut-dot" style={{ backgroundColor: sub.colorHex }}></span>
                                            <span className="donut-legend-name">{sub.name}</span>
                                            <span className="donut-legend-val">{percent}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Motivational Note */}
                        <div className="panel-motivational-banner">
                            <span className="material-symbols-outlined note-icon">track_changes</span>
                            <p className="note-text">
                                You're doing great! Keep going and try to hit your weekly goal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. ROW 2: WEEKLY STUDY HOURS + SUBJECT BREAKDOWN */}
                <div className="dashboard-dual-grid">
                    {/* Weekly Study Hours Line Chart */}
                    <div className="dashboard-panel">
                        <div className="panel-header">
                            <div className="panel-title-wrapper">
                                <span className="material-symbols-outlined panel-icon-blue">show_chart</span>
                                <h2 className="panel-title-text">Weekly Study Hours</h2>
                            </div>
                        </div>

                        <div className="weekly-chart-wrapper">
                            <ResponsiveContainer width="100%" height={230}>
                                <AreaChart data={weeklyData} margin={{ top: 15, right: 15, bottom: 5, left: -20 }}>
                                    <defs>
                                        <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={[0, 8]}
                                        tickFormatter={(v) => `${v}h`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.3)', strokeWidth: 1.5 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="hours"
                                        stroke="#818cf8"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#hourGradient)"
                                        dot={{ r: 4, fill: '#0f172a', stroke: '#818cf8', strokeWidth: 2.5 }}
                                        activeDot={{ r: 7, fill: '#818cf8', stroke: '#0f172a', strokeWidth: 2, filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.8))' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subject Breakdown Donut */}
                    <div className="dashboard-panel">
                        <div className="panel-header">
                            <div className="panel-title-wrapper">
                                <span className="material-symbols-outlined panel-icon-blue">pie_chart</span>
                                <h2 className="panel-title-text">Subject Breakdown</h2>
                            </div>

                        </div>

                        <div className="breakdown-dual-layout">
                            <div className="breakdown-chart-box">
                                <ResponsiveContainer width="100%" height={175}>
                                    <PieChart>
                                        <Pie
                                            data={breakdownData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="62%"
                                            outerRadius="90%"
                                            paddingAngle={3}
                                            dataKey="hours"
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {breakdownData.map((entry, index) => (
                                                <Cell key={index} fill={entry.colorHex} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="breakdown-center-content">
                                    <span className="breakdown-center-val">{totalStudyHours} hrs</span>
                                    <span className="breakdown-center-sub">Total</span>
                                </div>
                            </div>

                            <div className="breakdown-legend-list">
                                {breakdownData.map((item) => (
                                    <div key={item.name} className="breakdown-legend-row">
                                        <div className="breakdown-row-left">
                                            <span className="breakdown-dot" style={{ backgroundColor: item.colorHex }}></span>
                                            <span className="breakdown-name">{item.name}</span>
                                        </div>
                                        <span className="breakdown-row-right">
                                            {item.hours} hrs ({item.percent}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ROW 3: RECENT ACHIEVEMENTS */}
                <section className="achievements-panel">
                    <div className="panel-header">
                        <div className="panel-title-wrapper">
                            <span className="material-symbols-outlined panel-icon-gold">emoji_events</span>
                            <h2 className="panel-title-text">Recent Achievements</h2>
                        </div>
                        <a href="#achievements" className="panel-action-link">
                            <span>View All</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>

                    <div className="achievements-grid">
                        {achievements.map((ach) => (
                            <div
                                key={ach.title}
                                className="achievement-card"
                                style={{ '--ach-accent': ach.achColor }}
                            >
                                <div className={`achievement-icon-box ${ach.iconClass}`}>
                                    <span>{ach.icon}</span>
                                </div>
                                <div className="achievement-info">
                                    <h3 className="achievement-card-title">{ach.title}</h3>
                                    <p className="achievement-card-desc">{ach.desc}</p>
                                    <span className="achievement-card-date">{ach.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
