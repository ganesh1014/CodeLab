import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [websiteTheme, setWebsiteTheme] = useState(() => {
    return localStorage.getItem('codelab-theme') || 'system';
  });

  const [editorTheme, setEditorTheme] = useState(() => {
    return localStorage.getItem('codelab-editor-theme') || 'vs-dark';
  });

  
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;

    let isDark;

    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'light') {
      isDark = false;
    } else {
      
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');     
      root.style.colorScheme = 'dark';           
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');   
      root.style.colorScheme = 'light';            
    }

    setResolvedTheme(isDark ? 'dark' : 'light');
  }, []);

  
  useEffect(() => {
    applyTheme(websiteTheme);
  }, [websiteTheme, applyTheme]);

  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = () => {
      if (websiteTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [websiteTheme, applyTheme]);

 
  const changeWebsiteTheme = useCallback((theme) => {
    setWebsiteTheme(theme);
    localStorage.setItem('codelab-theme', theme);
    applyTheme(theme);
  }, [applyTheme]);

  
  const changeEditorTheme = useCallback((theme) => {
    setEditorTheme(theme);
    localStorage.setItem('codelab-editor-theme', theme);
  }, []);

  
  const getMonacoTheme = useCallback(() => {
    
    const themeMap = {
      'light': 'light',
      'dark': 'vs-dark',
      'hc-black': 'hc-black',
      'vs-dark': 'vs-dark',
    };
    return themeMap[editorTheme] || 'vs-dark';
  }, [editorTheme]);

  const value = {
    websiteTheme,      
    editorTheme,        
    resolvedTheme,       
    changeWebsiteTheme,
    changeEditorTheme,
    getMonacoTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};








