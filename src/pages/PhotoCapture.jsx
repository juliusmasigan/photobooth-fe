import React, { useState, useRef, useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useWebsocket } from '../contexts/WebsocketContext';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const collageLayoutCount = process.env.REACT_APP_COLLAGE_LAYOUT_COUNT ? parseInt(process.env.REACT_APP_COLLAGE_LAYOUT_COUNT) : 4; // Default to 4 photos in collage if not specified
const burstCount = process.env.REACT_APP_BOOMERANG_BURST_COUNT ? parseInt(process.env.REACT_APP_BOOMERANG_BURST_COUNT) : 10; // Default to 10 photos in boomerang if not specified
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

const PhotoCapture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = location.state || {};
  const [countdown, setCountdown] = useState(defaultCountdown);
  const [selectedMode, setSelectedMode] = useState(mode);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [remainingShots, setRemainingShots] = useState(null);
  const [captureMethod, setCaptureMethod] = useState(null);
  const videoRef = useRef(null);
  const processingResolveRef = useRef(null);
  const { wsEvent } = useWebsocket();
  const requestId = uuidv4();


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
        if (processingResolveRef.current) {
          processingResolveRef.current();
          processingResolveRef.current = null;
        }
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
      if (processingResolveRef.current) {
        processingResolveRef.current();
        processingResolveRef.current = null;
      }
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

  const takePhoto = async () => {
    try {
      const results = await fetch(`${apiBaseUrl}/api/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method: captureMethod, id: requestId, mode: selectedMode })
      });

      results.json().then(data => {
      }).catch(err => {
        console.error("Error parsing capture response:", err);
      });
    } catch (error) {
      console.error("Error taking photo:", error);
      setIsProcessing(false);
      return Promise.resolve(); // Resolve immediately on error to avoid hanging
    }

    return new Promise(resolve => {
      processingResolveRef.current = resolve;
    });
  }

  const getCaptureMethodForMode = (mode) => {
    if (/still|collage/gi.test(mode)) {
      return 'stream';
    } else {
      return 'stream';
    }
  };

  const takeBurstShots = (delay = 150) => {
    return new Promise((resolve) => {
      let count = 0;
      const intervalMs = delay; // Delay between burst shots
      const burstInterval = setInterval(() => {
        takePhoto();
        count++;
        if (count >= burstCount) {
          clearInterval(burstInterval);
          setTimeout(() => resolve(), 1000);
        }
      }, intervalMs);
    });
  };

  const runCountdown = (isBurst = false, delay = 150) => {
    return new Promise((resolve) => {
      let _countdown = defaultCountdown;
      setCountdown(_countdown);

      const intervalId = setInterval(() => {
        _countdown -= 1;
        setCountdown(_countdown);
        if (_countdown === 0) {
          clearInterval(intervalId);
          if (isBurst) {
            takeBurstShots(delay).then(resolve);
          } else {
            takePhoto().then(() => {
              resolve();
            });
          }
        }
      }, 1000);
    });
  };

  const startCapture = async () => {
    if (isCapturing || isProcessing) return; // Prevent multiple clicks

    setIsCapturing(true);

    if (selectedMode === 'boomerang') {
      await runCountdown(true);
    } else if (selectedMode === 'gif') {
      await runCountdown(true, 500);
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
      if (/collage|still/gi.test(selectedMode)) {
        navigate("/photo-selection", { state: { mode: selectedMode, requestId } });
      } else {
        navigate("/theme-selection", { state: { mode: selectedMode, requestId } });
      }
    }, 1000);

  };

  return (
    <div className="w-full h-screen bg-background text-on-surface">

      {/*  Full-screen Camera Viewfinder  */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Blurred background image */}
        <img ref={bgImgRef} alt="Blurred camera background" className="absolute inset-0 w-full h-full object-cover blur-md opacity-60 scale-110" src={`${apiBaseUrl}/api/stream`} />

        {/* <video ref={videoRef} autoPlay muted playsInline loop className="w-full h-full object-cover">
          <source src={`${apiBaseUrl}/api/stream`} type="multipart/x-mixed-replace" />
          <div className="w-full h-full flex items-center justify-center bg-black/50 text-white">
            Camera feed unavailable
          </div>
        </video> */}
        <img ref={fgImgRef} alt="Group of friends laughing at a party" className="absolute inset-0 w-full h-full object-contain" data-alt="Group of happy friends posing together" src={`${apiBaseUrl}/api/stream`} />
        {/*  Viewfinder Overlay Gradient  */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>
      {/*  Top AppBar (Suppressed standard but kept functional identity)  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">KuhaBox</div>
        <div className="flex items-center gap-4">
          {/collage|still/gi.test(selectedMode) && remainingShots !== null && (
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20 backdrop-blur-md">
              Shots left: {remainingShots}
            </div>
          )}
          <button className="relative flex items-center justify-center p-2 text-slate-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>
      {/*  Main Canvas Area: Countdown  */}
      <main className="relative z-10 flex flex-col items-center justify-center h-screen">
        <div className={`flex flex-col items-center transition-all duration-300 ${(isCapturing || isProcessing) ? 'animate-pulse' : ''}`}>
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-3 rounded-full mb-8 absolute top-1/4 transition-opacity duration-300 ${(isCapturing || isProcessing) ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">
              {isProcessing ? 'PROCESSING...' : countdown === 1 ? 'SMILE' : 'GET READY'}
            </span>
          </div>
          <div className="relative flex items-center justify-center aspect-square min-w-[14rem] md:min-w-[18rem]">
            {isCapturing && countdown > 0 && (
              <span
                key={`ping-${countdown}`}
                className="absolute text-[12rem] md:text-[16rem] font-black text-white countdown-glow leading-none select-none z-0 animate-ping opacity-60"
              >
                {countdown}
              </span>
            )}
            <span className={`absolute text-[12rem] md:text-[16rem] font-black text-white countdown-glow leading-none select-none z-10 transition-all duration-300 ${isCapturing && countdown === 0 ? 'scale-125 text-primary opacity-0' : 'opacity-100'}`}>
              {countdown > 0 ? countdown : ''}
            </span>

            {/* Camera Flash Effect */}
            <div className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-[100ms] ease-out ${isFlashing ? 'opacity-80' : 'opacity-0'}`} />

            {/*  Idle racing light streaks  */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full border-[2px] border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
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
        {/*  Gallery Preview (Small Thumbnail)  */}
        {/* <div className="absolute left-10 bottom-16 md:bottom-20">
          <div className="w-14 h-14 rounded-lg border-2 border-white/40 overflow-hidden shadow-lg rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer">
            <img alt="Recent photo" className="w-full h-full object-cover" data-alt="Thumbnail of last photo taken" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTObHKKS95M5QOt5qDYnS47KubOY1Q4b3ynV9IYMf-ymsUjlbJMvbSws6jMS_tnPHJw9OqF9j14NAe589xYZ3ibuTP3NmiI64OV-PT-cNWMt_mDLcnNH-QVIlDjp1vdckf7gGvxsD3Yr2CfCr_-rpV3iuh5YKTa3Va8IaY2fjBNuZoLHvsNXGBDrOqC9HOpULZxrSFKz75X3kLlTjBhnArRzGuTPzWists2LibHc55-RBAg4Nxrwiy185-b2YKUjQKEmr5crRvLd8N" />
          </div>
        </div> */}
        {/*  Shutter Button Container  */}
        <div className="relative flex items-center justify-center">
          {/*  Animated outer ring (visual only)  */}
          <div className={`absolute w-24 h-24 rounded-full border-2 border-white/30 transition-all duration-300 opacity-20 ${(isCapturing || isProcessing) ? 'animate-ping border-primary' : ''}`}></div>
          {/*  Main Shutter Button  */}
          <button
            className={`relative w-20 h-20 rounded-full bg-white flex items-center justify-center group transition-transform duration-150 shutter-glow ${(isCapturing || isProcessing) ? 'scale-90 bg-primary/20 cursor-not-allowed' : 'active:scale-90'}`}
            onClick={startCapture}
            disabled={isCapturing || isProcessing}
          >
            <div className="w-16 h-16 rounded-full border-4 border-slate-900/10 bg-white"></div>
            {/*  Shutter Action Icon (Hidden by default, used for interaction)  */}
            <span className="absolute inset-0 flex items-center justify-center text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined scale-150" data-icon="camera">camera</span>
            </span>
          </button>
        </div>
        {/*  Mode Selector  */}
        <div
          className="mt-8 relative w-full overflow-hidden flex justify-center items-center h-12"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}
        >
          <div className="relative w-full max-w-md h-full flex justify-center items-center">
            {Object.entries(captureModes).map((captureMode, i) => {
              // Calculate shortest distance in a circular array
              let offset = (i - Object.keys(captureModes).indexOf(selectedMode)) % Object.entries(captureModes).length;
              if (offset < -Math.floor(Object.entries(captureModes).length / 2)) offset += Object.entries(captureModes).length;
              if (offset > Math.floor(Object.entries(captureModes).length / 2)) offset -= Object.entries(captureModes).length;

              const isCenter = offset === 0;
              const distance = Math.abs(offset);

              return (
                <span
                  key={captureMode[0]}
                  onClick={() => handleModeClick(captureMode)}
                  className={`absolute text-xs font-bold tracking-widest uppercase cursor-pointer transition-all duration-300 ease-out whitespace-nowrap
                    ${isCenter
                      ? 'text-white border-b-2 border-primary pb-1'
                      : 'text-white/40 pb-1 hover:text-white/70'}`}
                  style={{
                    transform: `translateX(${offset * 120}px) scale(${isCenter ? 1 : 0.85})`,
                    opacity: distance === 0 ? 1 : distance === 1 ? 0.6 : 0.2,
                    zIndex: 10 - distance,
                    cursor: 'pointer'
                  }}
                >
                  {captureMode[1]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      {/*  Hidden Navigation Shell Logic (Suppressed per "Task-Focused" rule but structure present if needed for transitions)  */}
      <nav className="hidden">
        {/*  BottomNavBar would be here if not in camera mode  */}
      </nav>

    </div>
  );
};

export default PhotoCapture;
