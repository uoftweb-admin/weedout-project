// contexts/ui-context.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("");
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <UIContext.Provider
      value={{
        isMobile,
        sidebarOpen,
        setSidebarOpen,
        activeNavItem,
        setActiveNavItem,
        showBack,
        setShowBack
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}