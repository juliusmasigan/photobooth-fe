import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import About from './pages/About';
import IdleScreen from './pages/IdleScreen';
import ModeSelection from './pages/ModeSelection';
import PhotoCapture from './pages/PhotoCapture';
import PhotoSelection from './pages/PhotoSelection';
import PrintShare from './pages/PrintShare';
import SettingsDashboard from './pages/SettingsDashboard';
import SplashScreen from './pages/SplashScreen';
import ThemeSelection from './pages/ThemeSelection';
import { WebsocketProvider } from './contexts/WebsocketContext';

function IdleTimer() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  const IDLE_TIMEOUT_MS = 1000 * (process.env.REACT_APP_IDLE_TIMEOUT_SECONDS ? parseInt(process.env.REACT_APP_IDLE_TIMEOUT_SECONDS) : 300); // Default 5 minutes

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set timer only if we are not on the idle screen
    if (location.pathname !== '/' && location.pathname !== '/idle-screen') {
      timeoutRef.current = setTimeout(() => {
        navigate('/');
      }, IDLE_TIMEOUT_MS);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Setup event listeners
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchmove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Initial timer setup
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchmove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [resetTimer]);

  return null;
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Engine');

  useEffect(() => {
    let progressInterval;

    const completeLoading = () => {
      setProgress(100);
      setLoadingMessage('Ready');
      setTimeout(() => setIsReady(true), 800);
    };

    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        // Service worker already controls the page, cache is likely hot.
        setProgress(100);
        setLoadingMessage('Loading App');
        setTimeout(() => setIsReady(true), 500);
        return;
      }

      // Start simulating progress while caching in the background
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 200);

      serviceWorkerRegistration.register({
        onSuccess: (registration) => {
          clearInterval(progressInterval);
          completeLoading();
        },
        onUpdate: (registration) => {
          clearInterval(progressInterval);
          completeLoading();
        },
      });

      // Fallback in case SW fails or takes too long (10s max wait)
      setTimeout(() => {
        if (!isReady) {
          clearInterval(progressInterval);
          completeLoading();
        }
      }, 10000);

    } else {
      // Development mode or no SW support: simulate a quick load
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsReady(true);
            return 100;
          }
          return prev + 20;
        });
      }, 100);
    }

    return () => clearInterval(progressInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return <SplashScreen progress={progress} message={loadingMessage} />;
  }

  return (
    <Router>
      <IdleTimer />
      <WebsocketProvider>
        <div className="min-h-screen bg-background text-on-surface">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/idle-screen" element={<IdleScreen />} />
            <Route path="/mode-selection" element={<ModeSelection />} />
            <Route path="/photo-capture" element={<PhotoCapture />} />
            <Route path="/photo-selection" element={<PhotoSelection />} />
            <Route path="/print-share" element={<PrintShare />} />
            <Route path="/settings-dashboard" element={<SettingsDashboard />} />
            <Route path="/splash-screen" element={<SplashScreen />} />
            <Route path="/theme-selection" element={<ThemeSelection />} />
            <Route path="/" element={<IdleScreen />} />
          </Routes>
        </div>
      </WebsocketProvider>
    </Router>
  );
}

export default App;
