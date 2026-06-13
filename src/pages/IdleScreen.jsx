import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const captures = [
  { id: 1, time: '2m ago', alt: 'Portrait of a woman with prism light effects', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS1rpZf9G5qi6kDNPFpgDm43oDO6OGt3DdCS6Y-LL09USbDlgJbQOazfWvzMsfEnIINqqQ9xrP_97SRr3nnm5sU0AeDcORDne9Qt5VqtPCVv9-wBBOEjpglsIuUSSyedGBoG68owY8PaMjXa8q5noDSR1PL9Q_oMWAOqGNxeuBzdYH_f7X4uO9vhYjGhMZAvqG4wJQNf4K4w-M7dL0gTXjNdc6kR6jrP5E5sBTy3zSrwAnESATkRNJHVzxw_o6awyYAMSh039x4NVA' },
  { id: 2, time: '5m ago', alt: 'Stunning artistic portrait with chromatic aberration', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2l6l6lGIqORCoXsZbNvOW5MSoQnF6KRY2bsBGCvz1GXtslr4RtwTxlmXYwkjBxYrohuI9fW3z1E7i6sN045OqHoZ57BsIUpC28xvHAMUuhi_lkki705t8ZkJXTDjDnVy9ne-wU6urEz91gV4HiofjzIAqgdGDTSHQBW0FR4J5ho-nFKTY5V8zXBz07gCmrXQ0f9lXlKnivAN4NW8T0wDJdbF0z8sDqy_4yD-QidzyX86AlZf3LxrqCK4qM36LwU2sRbES1T6Is3HG' },
  { id: 3, time: '12m ago', alt: 'Male portrait with rainbow light leaks', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPCtz1tdrKEzTFKe4M34uW9Jxj8goG17ZtrtOocKUmnRs7wzH1QuoiiiYIbUuItDMltmVQQCkeOzzsjsOW2xfOpzERrq3xdLNG3vGhTpKHc48WUVoxU5KV07Dx9LIe4t71MXJV3d_SA5v9faRPCGrCQrd_Y4pyCLg_MBsenR5rYo9lJhVQ1xrQDXntQNu6-tskhjX-mrm2faA82y_i6w__b8HvJ658SSneRY62mMHOBediottmQ0r2ci_0tm_cthKhGp2IEhqzgjFK' },
  { id: 4, time: '18m ago', alt: 'Portrait photo with glass reflection overlay', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL_Y5L-ob7xCjiBgWjT7Usjion2bawgMoFE0zrD5AdBT7pGEcos-tGDE2f6pmfJLQf_jVseDKHXkVHLymHuXabEvMvFQZUeW4zYesNO14RYY31Z1h4fM9OX4FdXIIjXRbVQ2ZtmfRqbUA0sqnXHtCjcMkIzHP3H0jOKVEJTSwz4fFMjGx15qaLcUztNjuO3z-5qHRWKH1RbP56NASKbeaMPKABx_jv8U5xEBuiP1uyCupLHdB5ypeyjK6xZvXT6gUlpWF02XxKwvoT' },
];

const IdleScreen = () => {
  const [isSpread, setIsSpread] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-background text-on-surface">

      {/*  Video Background  */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        >
          <source src="/happy.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"></div>
      </div>
      {/*  Top Navigation (Shell Implementation)  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-2">
          <img src="/kuhabox-dark.png" alt="KuhaBox" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative flex items-center justify-center p-2 text-slate-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>
      {/*  Main Content Canvas  */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-16 pb-40">
        {/*  Central Hero Action  */}
        <div className="flex flex-col items-center gap-12 group">
          <div className="relative">
            {/*  Animated Firefly Effects Behind Button  */}
            <div className="absolute inset-[-40px] z-0 flex items-center justify-center pointer-events-none">

              {/* Firefly System 1 - Slow Clockwise */}
              <div className="absolute w-[360px] h-[360px] animate-orbit-slow">
                <div className="absolute top-10 left-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(233,193,118,0.8)] animate-flicker-fast"></div>
                <div className="absolute bottom-12 right-12 w-2 h-2 bg-primary-container rounded-full shadow-[0_0_10px_rgba(233,193,118,0.8)] animate-flicker-slow"></div>
                <div className="absolute top-1/2 left-4 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-[0_0_12px_rgba(253,224,71,0.8)] animate-flicker-medium"></div>
              </div>

              {/* Firefly System 2 - Medium Counter-Clockwise */}
              <div className="absolute w-[420px] h-[420px] animate-orbit-medium">
                <div className="absolute bottom-10 left-1/4 w-3.5 h-3.5 bg-tertiary rounded-full shadow-[0_0_15px_rgba(255,182,140,0.8)] animate-flicker-medium"></div>
                <div className="absolute top-1/4 right-8 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(233,193,118,0.8)] animate-flicker-fast" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/2 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-flicker-slow" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Firefly System 3 - Fast Clockwise */}
              <div className="absolute w-[300px] h-[300px] animate-orbit-fast">
                <div className="absolute top-0 right-1/3 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-flicker-fast" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-0 left-1/3 w-2.5 h-2.5 bg-primary-container rounded-full shadow-[0_0_15px_rgba(197,160,89,0.8)] animate-flicker-medium" style={{ animationDelay: '0.7s' }}></div>
              </div>

              {/* Soft center glow to anchor the fireflies */}
              <div className="absolute w-[200px] h-[200px] bg-primary/10 blur-[40px] rounded-full animate-pulse"></div>
            </div>
            {/*  Main CTA Button  */}
            <button
              onClick={() => navigate('/mode-selection')}
              className="relative z-10 glass-button w-72 h-72 rounded-full flex flex-col items-center justify-center gap-4 border-white/20 shadow-2xl shadow-primary/20 active:scale-90 transition-transform duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10 group-hover:border-primary/50"
            >
              <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(233,193,118,0.5)] animate-pulse">
                <span className="material-symbols-outlined text-white text-5xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>camera</span>
              </div>
              <span className="text-white font-headline font-extrabold tracking-[0.2em] text-lg">TAP TO START</span>
            </button>
          </div>
          <div className="text-center space-y-2">
            <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs opacity-70">Capture Every Moment</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface"><br /></h1>
          </div>
        </div>
        {/*  Recent Captures Showcase (Bento Style Horizontal)  */}
        <div className="absolute bottom-2 left-0 right-0 px-6 flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 px-2">
              <h2 className="text-[0.5rem] font-bold text-on-surface tracking-widest uppercase">Recent Captures</h2>
              <div className="h-[1px] flex-grow mx-4 bg-white/10"></div>
            </div>
            <div
              className="relative h-40 w-full flex justify-center items-center cursor-pointer mb-4"
              onClick={() => setIsSpread(!isSpread)}
            >
              {captures.map((capture, index) => {
                const stackedRotation = [0, -5, 4, -8][index];
                const stackedX = [0, -8, 5, 12][index];
                const stackedY = [0, 4, -3, 6][index];

                const spreadX = (index - 2) * 80;
                const spreadY = 0;
                const spreadRotation = [-4, -1, 1, 4][index];

                const transform = isSpread
                  ? `translateX(${spreadX}px) translateY(${spreadY}px) rotate(${spreadRotation}deg)`
                  : `translateX(${stackedX}px) translateY(${stackedY}px) rotate(${stackedRotation}deg)`;

                return (
                  <div
                    key={capture.id}
                    className="absolute w-20 h-36 glass-panel rounded-xl border border-white/10 overflow-hidden shadow-xl transition-all duration-500 ease-out hover:border-primary/50"
                    style={{ transform, zIndex: 40 - index }}
                  >
                    <img
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      alt={capture.alt}
                      src={capture.src}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      <span className="text-[10px] font-bold text-white/70">{capture.time}</span>
                    </div>
                  </div>
                );
              })}

              <div
                className="absolute w-20 h-36 glass-panel rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 transition-all duration-500 ease-out hover:bg-white/5"
                style={{
                  transform: isSpread
                    ? `translateX(${2 * 80}px) translateY(0px) rotate(8deg)`
                    : `translateX(25px) translateY(10px) rotate(15deg)`,
                  zIndex: 5,
                  opacity: isSpread ? 1 : 0,
                  pointerEvents: isSpread ? 'auto' : 'none'
                }}
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">grid_view</span>
                </div>
                <span className="text-[10px] font-bold text-white/40">VIEW ALL</span>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default IdleScreen;
