import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

export default function ProfilePage() {
  const { email, displayName, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>
      <div className="profile-card">
        <div className="avatar">{(displayName || email || '?').charAt(0).toUpperCase()}</div>
        <div className="profile-name">{displayName || 'MyDay user'}</div>
        <div className="profile-email">{email}</div>
      </div>

      <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
        <span>{isDark ? '🌙 Dark mode' : '☀️ Light mode'}</span>
        <span className={'switch' + (isDark ? ' on' : '')}>
          <span className="switch-knob" />
        </span>
      </button>

      <button className="btn-secondary" onClick={logout}>
        Log out
      </button>
    </div>
  );
}
