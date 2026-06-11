'use client';
// components/auth/AuthContext.tsx
// Global context to trigger login prompt from any component
import { createContext, useContext, useState, ReactNode } from 'react';
import LoginPrompt from './LoginPrompt';

interface AuthContextValue {
  showLoginPrompt: () => void;
}

const AuthContext = createContext<AuthContextValue>({ showLoginPrompt: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [promptKey, setPromptKey] = useState(0);
  const [show, setShow] = useState(false);

  const showLoginPrompt = () => {
    setPromptKey((k) => k + 1);
    setShow(true);
  };

  return (
    <AuthContext.Provider value={{ showLoginPrompt }}>
      {children}
      {show && (
        <LoginPrompt
          key={promptKey}
          onClose={() => setShow(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuthPrompt() {
  return useContext(AuthContext);
}
