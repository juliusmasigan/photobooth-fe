import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { checkDesigns, checkCamera, checkPrinter } from './utils/startupChecks';
import { enterKiosk } from './utils/kiosk';

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

// Definition of the startup readiness checks shown on the splash screen.
const STARTUP_CHECKS = [
  { id: 'designs', label: 'Verifying design templates', run: checkDesigns },
  { id: 'camera', label: 'Connecting to camera', run: checkCamera },
  { id: 'printer', label: 'Checking printer', run: checkPrinter },
];

function App() {
  const [isReady, setIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Engine');
  const [checks, setChecks] = useState(() =>
    STARTUP_CHECKS.map(({ id, label }) => ({ id, label, status: 'pending', detail: '' }))
  );
  const [hasFailure, setHasFailure] = useState(false);

  // Derive progress from how many checks have settled (ok or failed).
  const settled = checks.filter((c) => c.status === 'ok' || c.status === 'failed').length;
  const progress = Math.round((settled / STARTUP_CHECKS.length) * 100);

  const runChecks = useCallback(async () => {
    setHasFailure(false);
    setLoadingMessage('Running system checks');
    setChecks(STARTUP_CHECKS.map(({ id, label }) => ({ id, label, status: 'checking', detail: '' })));

    // Run all checks concurrently, updating each row as it settles.
    const results = await Promise.all(
      STARTUP_CHECKS.map(async (check) => {
        const result = await check.run();
        setChecks((prev) =>
          prev.map((c) =>
            c.id === check.id
              ? { ...c, status: result.ok ? 'ok' : 'failed', detail: result.detail }
              : c
          )
        );
        return result;
      })
    );

    if (results.every((r) => r.ok)) {
      setLoadingMessage('Ready');
      setTimeout(() => setIsReady(true), 800);
    } else {
      setHasFailure(true);
      setLoadingMessage('System checks failed');
    }
  }, []);

  useEffect(() => {
    runChecks();

    // Register the service worker for offline caching, but don't gate entry on it.
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      serviceWorkerRegistration.register();
    }

    // Enter kiosk mode (fullscreen + portrait lock) on the first user gesture —
    // browsers forbid these APIs without one. One-shot: detaches after firing.
    const onFirstGesture = () => {
      enterKiosk();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture, { once: true });
    window.addEventListener('touchstart', onFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
    };
  }, [runChecks]);

  if (!isReady) {
    return (
      <SplashScreen
        progress={progress}
        message={loadingMessage}
        checks={checks}
        hasFailure={hasFailure}
        onRetry={runChecks}
        onContinue={() => setIsReady(true)}
      />
    );
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
