import React from 'react';
import { useNavigate } from 'react-router-dom';

const enabledModes = process.env.REACT_APP_BOOTH_MODES ? process.env.REACT_APP_BOOTH_MODES.split(',') : ['still', 'collage', 'gif', 'boomerang', 'wigglegram']; // Default to all modes if not specified
const modes = [
  {
    id: 'still',
    title: 'Still Photo',
    desc: 'High-fidelity singular moments captured with prismatic lens enhancements.',
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
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-inter tracking-tight">Litrato</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative flex items-center justify-center p-2 text-slate-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      <main className="relative pt-16 pb-48 px-6">

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
                onClick={() => navigate('/photo-capture', { state: { mode: mode.id } })}
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
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" data-icon="arrow_forward">arrow_forward</span>
                  </h3>
                  <p className="text-sm text-on-surface-variant flex-grow">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/*  BottomNavBar  */}
      {/* <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-20 px-4 bg-slate-900/40 backdrop-blur-xl dark:bg-slate-950/40 rounded-full mx-6 mb-6 border border-white/20 shadow-2xl shadow-blue-900/20">
        <div 
          onClick={() => navigate('/')}
          className="flex flex-col items-center justify-center text-slate-400 w-12 h-12 hover:text-blue-300 transition-all active:scale-90 duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined" data-icon="home">home</span>
          <span className="font-inter text-[10px] font-medium mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 w-12 h-12 hover:text-blue-300 transition-all active:scale-90 duration-150 cursor-pointer">
          <span className="material-symbols-outlined" data-icon="photo_library">photo_library</span>
          <span className="font-inter text-[10px] font-medium mt-1">Gallery</span>
        </div>
        <div className="flex items-center justify-center bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-500/50 active:scale-90 duration-150 cursor-pointer">
          <span className="material-symbols-outlined" data-icon="auto_fix_high" data-weight="fill" style={{"fontVariationSettings":"\"FILL\" 1"}}>auto_fix_high</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 w-12 h-12 hover:text-blue-300 transition-all active:scale-90 duration-150 cursor-pointer">
          <span className="material-symbols-outlined" data-icon="share">share</span>
          <span className="font-inter text-[10px] font-medium mt-1">Share</span>
        </div>
      </nav> */}

    </div>
  );
};

export default ModeSelection;
