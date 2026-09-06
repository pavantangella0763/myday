import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/home', label: 'Home', icon: '⌂' },
  { to: '/todos', label: 'Todos', icon: '☑' },
  { to: '/expenses', label: 'Expenses', icon: '₹' },
  { to: '/profile', label: 'Profile', icon: '☺' },
];

export default function BottomTabBar() {
  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => 'tab' + (isActive ? ' tab-active' : '')}
        >
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
