import { Outlet } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';

/** App shell for authenticated pages: scrollable content area + fixed bottom tab bar. */
export default function Layout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
