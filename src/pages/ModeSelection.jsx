import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    class: 'animate-still-photo'
  },
  {
    id: 'boomerang',
    title: 'Boomerang',
    desc: 'Smooth back-and-forth motion loops.',
    icon: 'all_inclusive',
    img: '/Boomerang.png',
    class: 'boomerang-animation'
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

const ModeSelection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-900/50 backdrop-blur-md dark:bg-slate-950/50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <button className="relative flex items-center justify-center w-11 h-11 text-slate-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      <main className="relative py-24 px-6">

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Capture Mode</h1>
            <p className="text-on-surface-variant">Select your visual language</p>
          </div>

          {/*  Uniform Grid of Modes  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modes.filter(mode => enabledModes.includes(mode.id)).map((mode) => (
              <div
                key={mode.id}
                // onClick={() => navigate('/photo-capture', { state: { mode: mode.id } })}
                onClick={() => navigate('/theme-selection', { state: { mode: mode.id } })}
                className="group relative overflow-hidden glass-card rounded-2xl flex flex-col hover:border-primary-dim transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Image Placeholder */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  {mode.id === 'gif' || mode.id === 'boomerang' ? (
                    <div
                      className={`w-full h-full opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ${mode.class}`}
                      style={{ backgroundImage: `url(${mode.img})` }}
                    />
                  ) : (
                    <img
                      src={mode.img}
                      alt={`${mode.title} template`}
                      className={`w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ${mode.class}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Icon floating on image */}
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-primary/20 backdrop-blur-md flex items-center justify-center rounded-lg border border-white/20">
                    <span className="material-symbols-outlined text-white" data-icon={mode.icon}>{mode.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative z-10 bg-surface/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                    {mode.title}
                    <span className="material-symbols-outlined text-primary transition-transform duration-300" data-icon="arrow_forward">arrow_forward</span>
                  </h3>
                  <p className="text-sm text-on-surface-variant flex-grow">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default ModeSelection;
