import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import './Header.css';

export default function Header({ children }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signup');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const searchInputRef = useRef(null);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                if (data && data.isAuthenticated) {
                    setCurrentUser(data);
                } else {
                    setCurrentUser(null);
                }
            })
            .catch(() => {});
    }, []);


    const navLinks = [
        {
            name: 'Home',
            href: '/',
            badge: null,
            icon: 'home'
        },
        {
            name: 'Progress',
            href: '/progress',
            badge: 'Live',
            icon: 'insights'
        },
        {
            name: 'History',
            href: '#history',
            badge: null,
            icon: 'history'
        },
        {
            name: 'Subjects',
            href: '#subjects',
            badge: '6',
            icon: 'menu_book'
        },
        {
            name: 'Calendar',
            href: '#calendar',
            badge: null,
            icon: 'calendar_month'
        }
    ];

    const bottomLinks = [
        {
            name: 'Settings',
            href: '#settings',
            icon: 'settings'
        }
    ];

    // Global keyboard shortcut: Ctrl+K / Cmd+K to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
                setIsSearchFocused(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle window resize for mobile menu
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavSelect = (name) => {
        setActiveTab(name);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="unified-navigation">
            {/* ==================================================================
                1. SIDEBAR (Main navigation & options)
                ================================================================== */}
            <aside className={`app-sidebar ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''}`} aria-label="Sidebar Navigation">
                {/* Brand / Logo */}
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-brand" style={{ textDecoration: 'none' }}>
                        <div className="brand-logo-icon">
                            <span className="material-symbols-outlined brand-logo-symbol">school</span>
                        </div>
                        <div className="brand-title">
                            <span className="brand-main">Study</span>
                            <span className="brand-accent">Tracker</span>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        className="mobile-close-btn"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close navigation sidebar"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Quick Action Button */}
                <div className="sidebar-action-container">
                    <button className="sidebar-new-session-btn" title="Start a new study session">
                        <span className="material-symbols-outlined btn-plus-icon">add</span>
                        <span>Start Session</span>
                    </button>
                </div>

                {/* Main Navigation Links */}
                <nav className="sidebar-nav">
                    <span className="nav-section-label">MAIN MENU</span>
                    <ul className="nav-list">
                        {navLinks.map((item) => {
                            const isRoute = item.href.startsWith('/');
                            const isActive = isRoute ? location.pathname === item.href : activeTab === item.name;
                            return (
                                <li key={item.name} className="nav-list-item">
                                    {isRoute ? (
                                        <Link
                                            to={item.href}
                                            className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                            onClick={() => handleNavSelect(item.name)}
                                        >
                                            <span className="material-symbols-outlined sidebar-nav-icon">{item.icon}</span>
                                            <span className="sidebar-nav-text">{item.name}</span>
                                            {item.badge && (
                                                <span className={`nav-badge ${item.badge === 'Live' ? 'badge-live' : ''}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && <span className="active-glow-pill"></span>}
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavSelect(item.name);
                                            }}
                                        >
                                            <span className="material-symbols-outlined sidebar-nav-icon">{item.icon}</span>
                                            <span className="sidebar-nav-text">{item.name}</span>
                                            {item.badge && (
                                                <span className={`nav-badge ${item.badge === 'Live' ? 'badge-live' : ''}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && <span className="active-glow-pill"></span>}
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Bottom Nav / Preferences */}
                    <span className="nav-section-label second-label">PREFERENCES</span>
                    <ul className="nav-list">
                        {bottomLinks.map((item) => {
                            const isActive = activeTab === item.name;
                            return (
                                <li key={item.name} className="nav-list-item">
                                    <a
                                        href={item.href}
                                        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavSelect(item.name);
                                        }}
                                    >
                                        <span className="material-symbols-outlined sidebar-nav-icon">{item.icon}</span>
                                        <span className="sidebar-nav-text">{item.name}</span>
                                        {isActive && <span className="active-glow-pill"></span>}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Sidebar Footer: Streak Widget */}
                <div className="sidebar-footer">
                    <div className="streak-card">
                        <div className="streak-header">
                            <span className="streak-emoji">🔥</span>
                            <div className="streak-meta">
                                <span className="streak-title">5-Day Streak!</span>
                                <span className="streak-subtitle">Daily goal: 3.5h / 4h</span>
                            </div>
                        </div>
                        <div className="streak-progress-bar">
                            <div className="streak-fill" style={{ width: '87%' }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ==================================================================
                2. TOP NAVBAR (Search bar, quick actions & profile)
                ================================================================== */}
            <header className="app-topbar">
                <div className="topbar-inner">
                    {/* Left: Mobile Toggle & Page Indicator */}
                    <div className="topbar-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open sidebar menu"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                        <div className="page-breadcrumb">
                            <span className="breadcrumb-category">Workspace</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-current">
                                {location.pathname === '/progress' ? 'Progress' : (location.pathname === '/' ? 'Home' : activeTab)}
                            </span>
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className={`topbar-search ${isSearchFocused ? 'search-focused' : ''}`}>
                        <div className="search-input-wrapper">
                            <span className="material-symbols-outlined search-icon">search</span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="search-input"
                                placeholder="Search subjects, notes, sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            {searchQuery ? (
                                <button
                                    className="search-clear-btn"
                                    onClick={() => setSearchQuery('')}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            ) : (
                                <div className="search-shortcut-badge" title="Press Ctrl+K to search">
                                    <span>Ctrl</span>
                                    <span>K</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Notifications & Profile Option */}
                    <div className="topbar-right">
                        {/* Notification Bell */}
                        <button className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="notification-indicator"></span>
                        </button>

                        {/* Auth Navigation Action */}
                        <div className="navbar-auth-group">
                            {currentUser ? (
                                <div className="navbar-user-info">
                                    <span className="navbar-welcome-text">
                                        Welcome, <strong className="navbar-username">{currentUser.username}</strong>
                                    </span>
                                    <a href="/logout" className="navbar-logout-btn" title="Log out">
                                        <span className="material-symbols-outlined navbar-auth-icon">logout</span>
                                        <span>Logout</span>
                                    </a>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="navbar-signup-btn"
                                    onClick={() => {
                                        setAuthMode('signup');
                                        setAuthModalOpen(true);
                                    }}
                                >
                                    <span className="material-symbols-outlined navbar-auth-icon">person_add</span>
                                    <span>Sign Up</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Basic Auth Form Modal (Sign Up & Log In) */}
            <AuthModal
                isOpen={authModalOpen}
                initialMode={authMode}
                onClose={() => setAuthModalOpen(false)}
            />

            {/* Optional wrap of children if passed */}
            {children && (
                <div className="unified-content-slot">
                    {children}
                </div>
            )}
        </div>
    );
}