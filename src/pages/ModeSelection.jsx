import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCenteredCarousel from '../hooks/useCenteredCarousel';
import InfoOverlay from '../components/InfoOverlay';

const enabledModes = process.env.REACT_APP_BOOTH_MODES ? process.env.REACT_APP_BOOTH_MODES.split(',') : ['still', 'collage', 'gif', 'boomerang', 'wigglegram']; // Default to all modes if not specified
const modes = [
  {
    id: 'still',
    title: 'Still Photo',
    desc: 'High-fidelity singular moments captured in crisp, vivid detail.',
    icon: 'photo_camera',
    img: '/StillPhoto.png',
    class: ''
  },
  {
    id: 'collage',
    title: 'Collage',
    desc: 'Grid layouts for multiple perspectives.',
    icon: 'dashboard',
    img: '/Collage.png',
    class: ''
  },
  {
    id: 'gif',
    title: 'Animated GIF',
    desc: 'Looped sequences with vintage grain.',
    icon: 'gif',
    img: '/AnimatedGIF.png',
    class: 'animate-still-photo',
    frameAspect: 416 / 424 // 416x2544 sprite, 6 frames
  },
  {
    id: 'boomerang',
    title: 'Boomerang',
    desc: 'Smooth back-and-forth motion loops.',
    icon: 'all_inclusive',
    img: '/Boomerang.png',
    class: 'boomerang-animation',
    frameAspect: 416 / (2544 / 6.3) // matches background-size: 100% 630%
  },
  {
    id: 'wigglegram',
    title: 'Wigglegram',
    desc: '3D stereo effect through rapid switching.',
    icon: 'vibration',
    img: '/Wigglegram.gif',
    class: 'wigglegram-animation'
  }
];

const visibleModes = modes.filter(mode => enabledModes.includes(mode.id));
// Three copies back to back so the carousel can loop infinitely
const loopedModes = visibleModes.length > 1 ? [...visibleModes, ...visibleModes, ...visibleModes] : visibleModes;

const ModeSelection = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const navigate = useNavigate();
  const { containerRef, activeIndex, setItemRef, scrollToIndex } = useCenteredCarousel(visibleModes.length, 'vertical', { loop: true });
  const activeModeIndex = activeIndex % visibleModes.length;
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-hidden">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <img src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-white whitespace-nowrap">Capture Mode</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setInfoOpen(true)} className="relative flex items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      <main className="relative h-full flex flex-row pt-16">

        {/*  Side index of Mode labels  */}
        <nav className="shrink-0 w-28 sm:w-36 flex flex-col justify-center gap-2 pl-4 relative z-20">
          {visibleModes.map((mode, i) => {
            const isActive = i === activeModeIndex;
            return (
              <button
                key={mode.id}
                // Target the middle copy so the loop recentering stays seamless
                onClick={() => scrollToIndex(visibleModes.length > 1 ? visibleModes.length + i : i)}
                className={`flex items-center gap-2 min-h-[44px] text-left text-sm transition-all duration-300 active:scale-95 ${
                  isActive ? 'text-white font-bold' : 'text-on-surface-variant/60'
                }`}
              >
                <span
                  className={`shrink-0 rounded-full transition-all duration-300 ${
                    isActive ? 'w-2 h-6 bg-primary' : 'w-1.5 h-1.5 bg-on-surface-variant/40'
                  }`}
                ></span>
                {mode.title}
              </button>
            );
          })}
        </nav>

        {/*  Vertical swipe carousel of Modes  */}
        <div
          ref={containerRef}
          className="flex flex-col items-center gap-6 overflow-y-auto snap-y snap-mandatory no-scrollbar flex-1 min-w-0 min-h-0 py-[20vh] relative z-10"
        >
          {loopedModes.map((mode, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={`${mode.id}-${index}`}
                ref={setItemRef(index)}
                onClick={() => navigate('/photo-capture', { state: { mode: mode.id } })}
                className={`relative overflow-hidden glass-card rounded-2xl flex flex-col shadow-lg snap-center shrink-0 w-[80%] max-w-2xl h-[60vh] transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'
                }`}
              >

                {/* Image Placeholder */}
                <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-surface-container [container-type:size]">
                  {mode.frameAspect ? (
                    // Sprite box keeps the frame's aspect ratio and covers the area
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 transition-all duration-500 ${mode.class}`}
                      style={{
                        backgroundImage: `url(${mode.img})`,
                        width: `max(100cqw, calc(100cqh * ${mode.frameAspect}))`,
                        height: `max(100cqh, calc(100cqw / ${mode.frameAspect}))`,
                      }}
                    />
                  ) : (
                    <img
                      src={mode.img}
                      alt={`${mode.title} template`}
                      className={`w-full h-full object-cover opacity-80 transition-all duration-500 ${mode.class}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Icon floating on image */}
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-primary/20 backdrop-blur-md flex items-center justify-center rounded-lg border border-white/20">
                    <span className="material-symbols-outlined text-white" data-icon={mode.icon}>{mode.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col shrink-0 relative z-10 bg-surface/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                    {mode.title}
                    <span className="material-symbols-outlined text-primary transition-transform duration-300" data-icon="arrow_forward">arrow_forward</span>
                  </h3>
                  <p className="text-sm text-on-surface-variant">{mode.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default ModeSelection;
