import React, { useState, useRef, useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useWebsocket } from '../contexts/WebsocketContext';
import { useNavigate } from 'react-router-dom';
import InfoOverlay from '../components/InfoOverlay';
import useSwipe from '../hooks/useSwipe';
import ModeStrip from '../components/ModeStrip';
import FilterPicker from '../components/FilterPicker';
import useRemoteSession from '../hooks/useRemoteSession';
import useDraggable from '../hooks/useDraggable';
import { QRCodeSVG } from 'qrcode.react';

// Base URL a phone uses to reach this app (the kiosk itself may be on localhost)
const remoteBaseUrl = (process.env.REACT_APP_REMOTE_BASE_URL || window.location.origin).replace(/\/$/, '');
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const collageLayoutCount = process.env.REACT_APP_COLLAGE_LAYOUT_COUNT ? parseInt(process.env.REACT_APP_COLLAGE_LAYOUT_COUNT) : 4; // Default to 4 photos in collage if not specified
const enabledModes = process.env.REACT_APP_BOOTH_MODES ? process.env.REACT_APP_BOOTH_MODES.split(',') : ['still', 'collage', 'gif', 'boomerang', 'wigglegram']; // Default to all modes if not specified
const defaultCountdown = process.env.REACT_APP_COUNTDOWN_TIMER_SECONDS ? parseInt(process.env.REACT_APP_COUNTDOWN_TIMER_SECONDS) : 5; // Default to 5 seconds
const extraShotsForSelection = process.env.REACT_APP_EXTRA_SHOTS_FOR_SELECTION ? parseInt(process.env.REACT_APP_EXTRA_SHOTS_FOR_SELECTION) : 0; // Default to 2 extra shots for selection if not specified
const allCaptureModes = {
  still: 'Still Photo',
  collage: 'Collage',
  gif: 'Animated GIF',
  boomerang: 'Boomerang',
  wigglegram: 'Wigglegram'
};
const captureModes = Object.fromEntries(
  Object.entries(allCaptureModes).filter(([key]) => enabledModes.includes(key))
);
// Upper bound for one capture request, so a stalled server can't freeze the screen (clips need time to encode)
const captureTimeoutMs = 60000;
// Modes the camera controller records as one animated clip (GIF + MP4)
const isClipMode = (mode) => mode === 'gif' || mode === 'boomerang';

const PhotoCapture = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};
  const [countdown, setCountdown] = useState(defaultCountdown);
  const [selectedMode, setSelectedMode] = useState(mode);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [remainingShots, setRemainingShots] = useState(null);
  // Set while a gif/boomerang records: { index, total } of the last GIF pose, or {} for a boomerang
  const [recording, setRecording] = useState(null);
  const [captureMethod, setCaptureMethod] = useState(null);
  const videoRef = useRef(null);
  const captureStartedRef = useRef(false);
  const { wsEvent } = useWebsocket();
  const [requestId] = useState(() => uuidv4());
  // One remote-control session per visit to this screen, so each guest scans a fresh code
  const [remoteSessionId] = useState(() => uuidv4());
  const remoteUrl = `${remoteBaseUrl}/remote/${remoteSessionId}`;
  const [qrExpanded, setQrExpanded] = useState(false);
  const qrDrag = useDraggable({ storageKey: 'booth.remoteQrOffset' });
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState('none');
  const [filterTray, setFilterTray] = useState(null);
  const startCaptureRef = useRef(null);
  const handleModeClickRef = useRef(null);
  const selectFilterRef = useRef(null);
  const busyRef = useRef(false);
  busyRef.current = isCapturing || isProcessing;
  const sendBoothStateRef = useRef(null);

  const { connected: remoteConnected, peerCount: remotePeerCount, send: sendRemote } = useRemoteSession({
    sessionId: remoteSessionId,
    role: 'booth',
    onMessage: (msg) => {
      if (msg.type === 'remote_hello' || msg.type === 'remote_joined') {
        if (sendBoothStateRef.current) sendBoothStateRef.current();
      } else if (msg.type === 'remote_command') {
        if (msg.command === 'shutter') {
          if (startCaptureRef.current) startCaptureRef.current();
        } else if (msg.command === 'set_mode' && captureModes[msg.mode] && !busyRef.current) {
          if (handleModeClickRef.current) handleModeClickRef.current([msg.mode]);
        } else if (msg.command === 'set_filter' && typeof msg.filter === 'string' && !busyRef.current) {
          if (selectFilterRef.current) selectFilterRef.current(msg.filter);
        }
      }
    }
  });


  const bgImgRef = useRef(null);
  const fgImgRef = useRef(null);

  useEffect(() => {
    const bgImg = bgImgRef.current;
    const fgImg = fgImgRef.current;
    
    // In React 18 Strict Mode, components mount, unmount, then mount again.
    // If we cleared the src during the first unmount, we need to restore it on the second mount.
    if (bgImg && !bgImg.src.includes('api/stream')) {
      bgImg.src = `${apiBaseUrl}/api/stream`;
    }
    if (fgImg && !fgImg.src.includes('api/stream')) {
      fgImg.src = `${apiBaseUrl}/api/stream`;
    }

    return () => {
      // Stop the image stream when unmounting by clearing the src
      if (bgImg) bgImg.src = "";
      if (fgImg) fgImg.src = "";
    };
  }, []);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/filters`)
      .then(response => response.json())
      .then(data => {
        setFilters(data.filters || []);
        setActiveFilter(data.active || 'none');
      })
      .catch(err => console.error("Error fetching filters:", err));
  }, []);

  const selectFilter = async (id) => {
    if (isCapturing || isProcessing) return;
    const previous = activeFilter;
    setActiveFilter(id);
    try {
      const response = await fetch(`${apiBaseUrl}/api/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setActiveFilter(data.active || 'none');
    } catch (error) {
      console.error("Error setting filter:", error);
      setActiveFilter(previous);
    }
  };

  useEffect(() => {
    if (wsEvent && wsEvent.type === 'filter_changed') {
      setActiveFilter(wsEvent.filter || 'none');
    }

    // Capture events from another booth session shouldn't drive this screen's UI
    if (wsEvent && wsEvent.session_id && wsEvent.session_id !== requestId) return;

    if (isClipMode(selectedMode) && wsEvent) {
      if (wsEvent.type === 'camera_action') {
        if (wsEvent.action === 'recording_started') {
          setRecording({});
        } else if (wsEvent.action === 'frame_captured') {
          // Flash on each GIF pose so guests know when to change it
          setRecording({ index: wsEvent.index, total: wsEvent.total });
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 100);
        } else if (wsEvent.action === 'encoding') {
          setRecording(null);
          setIsProcessing(true);
        }
      } else if (wsEvent.type === 'capture_success' || wsEvent.type === 'capture_error') {
        setRecording(null);
        setIsProcessing(false);
      }
      return;
    }

    if (captureMethod === "gphoto" && wsEvent && wsEvent.type === 'camera_action') {
      if (wsEvent.action === 'capturing_image') {
        // Trigger flash effect
        setTimeout(() => {
          setIsFlashing(true);
          setTimeout(() => {
            setIsFlashing(false);
            setIsProcessing(true);
          }, 100); // Quick flash duration
        }, 500); // Delay flash slightly to sync with actual capture
      } else if (wsEvent.action === 'capture_completed') {
        setIsProcessing(false);
      }
    }

    if (captureMethod === "stream" && wsEvent && wsEvent.type === 'capture_started') {
      // Trigger flash effect
      setIsFlashing(true);
      setIsProcessing(true);
      setTimeout(() => {
        setIsFlashing(false);
      }, 100); // Quick flash duration
    } else if (captureMethod === "stream" && wsEvent && wsEvent.type === 'capture_success') {
      setIsProcessing(false);
    }
  }, [wsEvent]);

  useEffect(() => {
    if (mode) {
      setSelectedMode(mode || 0);
      setCaptureMethod(getCaptureMethodForMode(mode)); // Set capture method based on mode
    }
  }, [mode]);

  useEffect(() => {
    if (videoRef.current) {
      if (isFlashing) {
        videoRef.current.pause();
      } else if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.error("Video play failed", e));
      }
    }
  }, [isFlashing]);

  const handleModeClick = (captureMode) => {
    setSelectedMode(captureMode[0]);
    setCaptureMethod(getCaptureMethodForMode(captureMode[0])); // Set capture method based on mode
  };

  // Move to the next (delta = 1) or previous (delta = -1) mode, wrapping around
  const stepMode = (delta) => {
    const keys = Object.keys(captureModes);
    if (!keys.length) return;
    const current = Math.max(keys.indexOf(selectedMode), 0);
    const next = keys[(current + delta + keys.length) % keys.length];
    handleModeClick([next]);
  };

  const { dragX, isDragging, handlers: swipeHandlers, wasDrag } = useSwipe({
    onSwipeLeft: () => stepMode(1),
    onSwipeRight: () => stepMode(-1),
    disabled: isCapturing || isProcessing
  });

  // Resolves once the capture request settles. The HTTP response is the source of truth:
  // the server broadcasts capture_success before replying, so waiting on the WS event races.
  const takePhoto = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), captureTimeoutMs);
    try {
      const response = await fetch(`${apiBaseUrl}/api/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method: captureMethod, id: requestId, mode: selectedMode }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        console.error("Capture failed:", data.error || data.detail || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      clearTimeout(timeoutId);
      setRecording(null);
      setIsProcessing(false);
    }
  }

  const getCaptureMethodForMode = (mode) => {
    if (/still|collage/gi.test(mode)) {
      return 'stream';
    } else {
      return 'stream';
    }
  };

  const runCountdown = () => {
    return new Promise((resolve) => {
      let _countdown = defaultCountdown;
      setCountdown(_countdown);

      const intervalId = setInterval(() => {
        _countdown -= 1;
        setCountdown(_countdown);
        if (_countdown === 0) {
          clearInterval(intervalId);
          takePhoto().then(() => {
            resolve();
          });
        }
      }, 1000);
    });
  };

  const startCapture = async () => {
    // Prevent multiple clicks; the ref also guards a kiosk tap and a remote shutter landing before a re-render
    if (isCapturing || isProcessing || captureStartedRef.current) return;
    captureStartedRef.current = true;

    setQrExpanded(false);
    setFilterTray(null);
    setIsCapturing(true);

    if (isClipMode(selectedMode)) {
      // The camera controller records the whole clip from a single request
      await runCountdown();
    } else if (/still|collage/gi.test(selectedMode)) {
      const photosToTake = selectedMode === 'still' ? 1 + extraShotsForSelection : collageLayoutCount + extraShotsForSelection; // Take extra shots for still to allow for selection
      for (let i = 0; i < photosToTake; i++) {
        setRemainingShots(photosToTake - i);
        await runCountdown(false);
      }
    }

    setIsCapturing(false);
    setRemainingShots(null);
    setCountdown(defaultCountdown);

    setTimeout(() => {
      navigate("/theme-selection", { state: { mode: selectedMode, requestId } });
    }, 1000);

  };

  // Keep the remote handlers pointed at the latest render's closures
  startCaptureRef.current = startCapture;
  handleModeClickRef.current = handleModeClick;
  selectFilterRef.current = (id) => {
    if (id === 'none' || filters.some(f => f.id === id)) selectFilter(id);
  };
  sendBoothStateRef.current = () => sendRemote({
    type: 'booth_state',
    mode: selectedMode,
    modes: Object.entries(captureModes),
    isCapturing,
    isProcessing,
    countdown,
    remainingShots,
    filters,
    activeFilter
  });

  useEffect(() => {
    if (remoteConnected) sendBoothStateRef.current();
  }, [selectedMode, isCapturing, isProcessing, countdown, remainingShots, filters, activeFilter, remoteConnected]);

  const remoteCountLabel = `${remotePeerCount} remote${remotePeerCount === 1 ? '' : 's'} connected`;

  return (
    <div className="w-full h-screen bg-background text-on-surface">

      {/*  Full-screen Camera Viewfinder  */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Blurred background image */}
        <img ref={bgImgRef} alt="Blurred camera background" className="absolute inset-0 w-full h-full object-cover blur-md opacity-60 scale-110" src={`${apiBaseUrl}/api/stream`} />
        <img ref={fgImgRef} alt="Group of friends laughing at a party" className="absolute inset-0 w-full h-full object-contain" data-alt="Group of happy friends posing together" src={`${apiBaseUrl}/api/stream`} />
        {/*  Viewfinder Overlay Gradient  */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>
      {/*  Top AppBar (Suppressed standard but kept functional identity)  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <img onClick={() => navigate('/')} src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        <div className="flex items-center gap-4">
          {remotePeerCount > 0 && (
            <div title={remoteCountLabel} className="flex items-center gap-1 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20 backdrop-blur-md">
              <span className="material-symbols-outlined text-base">phonelink_ring</span>
              {remotePeerCount}
            </div>
          )}
          {/collage|still/gi.test(selectedMode) && remainingShots !== null && (
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20 backdrop-blur-md">
              Shots left: {remainingShots}
            </div>
          )}
          <button onClick={() => setInfoOpen(true)} disabled={isCapturing || isProcessing} className="relative flex disabled:opacity-40 items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>
      {/*  Main Canvas Area: Countdown  */}
      <main {...swipeHandlers} className="relative z-10 flex flex-col items-center justify-center h-screen touch-pan-y select-none">
        <div className={`flex flex-col items-center transition-all duration-300 ${(isCapturing || isProcessing) ? 'animate-pulse' : ''}`}>
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-full mb-8 absolute top-1/4 transition-opacity duration-300 ${(isCapturing || isProcessing) ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">
              {isProcessing ? 'PROCESSING...'
                : recording?.total ? `POSE ${recording.index} / ${recording.total}`
                : recording ? 'MOVE!'
                : countdown === 1 ? 'SMILE' : 'GET READY'}
            </span>
          </div>
          <div className="relative flex items-center justify-center aspect-square min-w-[14rem] md:min-w-[18rem]">
            {isCapturing && countdown > 0 && (
              <span
                key={`ping-${countdown}`}
                className="absolute text-[12rem] md:text-[16rem] font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.9)] md:[-webkit-text-stroke:3px_rgba(255,255,255,0.9)] leading-none select-none z-0 animate-ping opacity-20"
              >
                {countdown}
              </span>
            )}
            {isCapturing && (
              <span className={`absolute text-[12rem] md:text-[16rem] font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.9)] md:[-webkit-text-stroke:3px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] leading-none select-none z-10 transition-all duration-300 ${countdown === 0 ? 'scale-125 opacity-0' : 'opacity-40'}`}>
                {countdown > 0 ? countdown : ''}
              </span>
            )}

            {/* Camera Flash Effect */}
            <div className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-[100ms] ease-out ${isFlashing ? 'opacity-80' : 'opacity-0'}`} />

            {/*  Countdown racing light streaks  */}
            <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-full border-[2px] border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${isCapturing && countdown > 0 ? 'opacity-100' : 'opacity-0'}`}>
              {/* Streak 1 */}
              <div
                className="absolute top-[35%] w-[100%] h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
                style={{ animation: 'slide-right 2.5s ease-in-out infinite' }}
              />
              {/* Streak 2 */}
              <div
                className="absolute top-[65%] w-[100%] h-[5px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-90"
                style={{ animation: 'slide-left 2s ease-in-out infinite 0.8s' }}
              />
              {/* Streak 3 */}
              <div
                className="absolute top-[48%] w-[100%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                style={{ animation: 'slide-right 3.5s ease-in-out infinite 1.2s' }}
              />
              {/* Streak 4 */}
              <div
                className="absolute top-[20%] w-[100%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"
                style={{ animation: 'slide-left 3s ease-in-out infinite 0.3s' }}
              />
            </div>
          </div>
        </div>
      </main>
      {/*  Bottom Controls Area  */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-12 px-8">
        {/*  Filter Picker, arced around the shutter  */}
        <FilterPicker
          filters={filters}
          active={activeFilter}
          onSelect={selectFilter}
          openKind={filterTray}
          onOpenKindChange={setFilterTray}
          disabled={isCapturing || isProcessing}
          arcHidden={isCapturing || isProcessing}
          radius={120}
        >
          {/*  Shutter Button Container  */}
          <div className="relative flex items-center justify-center">
            {/*  Animated outer ring (visual only)  */}
            <div className={`absolute w-24 h-24 rounded-full border-2 border-white/30 transition-all duration-300 opacity-20 ${(isCapturing || isProcessing) ? 'animate-ping border-primary' : ''}`}></div>
            {/*  Main Shutter Button  */}
            <button
              className={`relative w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform duration-150 shutter-glow ${(isCapturing || isProcessing) ? 'scale-90 bg-primary/20' : 'active:scale-90'}`}
              onClick={startCapture}
              disabled={isCapturing || isProcessing}
            >
              <div className="w-16 h-16 rounded-full border-4 border-slate-900/10 bg-white"></div>
            </button>
          </div>
        </FilterPicker>
        {/*  Mode Selector  */}
        <ModeStrip
          className="mt-8"
          modes={Object.entries(captureModes)}
          activeIndex={Object.keys(captureModes).indexOf(selectedMode)}
          onSelect={(i) => handleModeClick(Object.entries(captureModes)[i])}
          swipe={{ dragX, isDragging, handlers: swipeHandlers, wasDrag }}
          disabled={isCapturing || isProcessing}
        />
      </div>
      {/*  Hidden Navigation Shell Logic (Suppressed per "Task-Focused" rule but structure present if needed for transitions)  */}
      <nav className="hidden">
        {/*  BottomNavBar would be here if not in camera mode  */}
      </nav>

      {/*  Remote Control QR  */}
      {remoteConnected && (
        <button
          ref={qrDrag.ref}
          {...qrDrag.handlers}
          onClick={() => { if (!qrDrag.wasDrag.current) setQrExpanded(true); }}
          disabled={isCapturing}
          style={{ transform: `translate(${qrDrag.offset.x}px, ${qrDrag.offset.y}px)` }}
          className={`fixed right-6 bottom-32 z-50 flex flex-col items-center gap-2 p-3 rounded-2xl bg-black/50 border border-white/20 backdrop-blur-md transition-opacity duration-300 touch-none select-none ${qrDrag.isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isCapturing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="bg-white p-1.5 rounded-lg">
            <QRCodeSVG value={remoteUrl} size={84} />
          </div>
          <span className="flex items-center gap-1 text-white text-[10px] font-bold tracking-widest uppercase">
            <span className="material-symbols-outlined text-sm">{remotePeerCount > 0 ? 'phonelink_ring' : 'qr_code_scanner'}</span>
            {remotePeerCount > 0 ? remoteCountLabel : 'Scan to control'}
          </span>
        </button>
      )}

      {qrExpanded && (
        <div
          onClick={() => setQrExpanded(false)}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-black/80 backdrop-blur-md"
        >
          <div className="bg-white p-5 rounded-3xl">
            <QRCodeSVG value={remoteUrl} size={280} />
          </div>
          <p className="text-white text-sm font-bold tracking-[0.2em] uppercase">Scan with your phone to control the camera</p>
          <p className="text-white/50 text-xs">Tap anywhere to close</p>
        </div>
      )}

      <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default PhotoCapture;
