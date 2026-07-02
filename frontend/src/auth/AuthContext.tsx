import { createContext, useContext, useState, type ReactNode } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import { TOKEN_KEY } from '../api/client';

const EMAIL_KEY = 'myday_email';
const NAME_KEY = 'myday_name';

interface AuthState {
  token: string | null;
  email: string | null;
  displayName: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token: localStorage.getItem(TOKEN_KEY),
    email: localStorage.getItem(EMAIL_KEY),
    displayName: localStorage.getItem(NAME_KEY),
  }));

  function apply(token: string, email: string, displayName: string | null) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, email);
    if (displayName) {
      localStorage.setItem(NAME_KEY, displayName);
    } else {
      localStorage.removeItem(NAME_KEY);
    }
    setState({ token, email, displayName });
  }

  async function login(email: string, password: string) {
    const res = await loginRequest(email, password);
    apply(res.token, res.email, res.displayName);
  }

  async function register(email: string, password: string, displayName: string) {
    const res = await registerRequest(email, password, displayName);
    apply(res.token, res.email, res.displayName);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
    setState({ token: null, email: null, displayName: null });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, isAuthenticated: !!state.token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
