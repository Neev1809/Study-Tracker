import { useState, useEffect } from 'react';
import './AuthModal.css';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        for (const cookie of document.cookie.split(';')) {
            const c = cookie.trim();
            if (c.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(c.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default function AuthModal({ isOpen, initialMode = 'signup', onClose }) {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        setMode(initialMode);
        setStatusMessage(null);
    }, [initialMode, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setStatusMessage(null);
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div
                className="auth-modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
            >
                <div className="auth-modal-header">
                    <h2 id="auth-modal-title" className="auth-modal-title">
                        {mode === 'signup' ? 'Create an Account' : 'Log In'}
                    </h2>
                    <button
                        type="button"
                        className="auth-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {statusMessage && (
                    <div className={`auth-message ${statusMessage.type}`}>
                        {statusMessage.text}
                    </div>
                )}

                <form
                    action={mode === 'signup' ? '/signup' : '/login'}
                    method="post"
                    className="auth-form"
                >
                    <input type="hidden" name="csrfmiddlewaretoken" value={getCookie('csrftoken')} />
                    {mode === 'signup' && (
                        <>
                            <div className="auth-form-group">
                                <label htmlFor="fname" className="auth-label">First Name</label>
                                <input
                                    id="fname"
                                    type="text"
                                    name="fname"
                                    className="auth-input"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="auth-form-group">
                                <label htmlFor="lname" className="auth-label">Last Name</label>
                                <input
                                    id="lname"
                                    type="text"
                                    name="lname"
                                    className="auth-input"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="auth-form-group">
                        <label htmlFor="auth-username" className="auth-label">Username</label>
                        <input
                            id="auth-username"
                            type="text"
                            name="auth-username"
                            className="auth-input"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleInputChange('username')}
                            required
                            autoFocus={mode === 'login'}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="auth-form-group">
                            <label htmlFor="auth-email" className="auth-label">Email Address</label>
                            <input
                                id="auth-email"
                                type="email"
                                name="auth-email"
                                className="auth-input"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                required
                            />
                        </div>
                    )}

                    <div className="auth-form-group">
                        <label htmlFor="auth-password" className="auth-label">Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            name="auth-password"
                            className="auth-input"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            required
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="auth-form-group">
                            <label htmlFor="auth-confirm-password" className="auth-label">Confirm Password</label>
                            <input
                                id="auth-confirm-password"
                                type="password"
                                name="auth-confirm-password"
                                className="auth-input"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange('confirmPassword')}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn">
                        {mode === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="auth-modal-footer">
                    {mode === 'signup' ? (
                        <p className="auth-switch-text">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="auth-switch-link"
                                onClick={() => switchMode('login')}
                            >
                                Log In
                            </button>
                        </p>
                    ) : (
                        <p className="auth-switch-text">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                className="auth-switch-link"
                                onClick={() => switchMode('signup')}
                            >
                                Sign Up
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
