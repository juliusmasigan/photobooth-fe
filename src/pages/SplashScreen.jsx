import React from 'react';

const SplashScreen = ({ progress = 65, message = "Initializing Engine" }) => {
    return (
        <div className="w-full h-screen bg-background text-on-surface">

            {/*  Background Subtlety  */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="modern-gradient absolute inset-0"></div>
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full"></div>
            </div>
            {/*  Main Content Canvas  */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 text-center">
                {/*  Logo Branding Section  */}
                <div className="flex flex-col items-center space-y-10">
                    {/*  Icon  */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative w-28 h-28 bg-surface border border-outline/50 rounded-xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                            <span className="material-symbols-outlined text-primary text-5xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>
                                auto_fix_high
                            </span>
                        </div>
                    </div>
                    {/*  Brand Typography  */}
                    <div className="space-y-3">
                        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface">
                            PRISMATIC
                        </h1>
                        <p className="font-sans text-on-surface-variant tracking-[0.3em] text-[10px] md:text-xs font-semibold uppercase">
                            Capture the Spectrum
                        </p>
                    </div>
                </div>
                {/*  Progress System  */}
                <div className="mt-20 w-full max-w-xs space-y-4">
                    {/*  Loading Indicator  */}
                    <div className="h-2 w-full bg-outline/30 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300 rounded-full relative shadow-[0_0_15px_rgba(45,91,255,0.4)]" style={{ width: `${progress}%` }}>
                            <div className="absolute inset-0 shimmer"></div>
                        </div>
                    </div>
                    {/*  Status Label  */}
                    <div className="flex justify-between items-center font-sans text-[11px] tracking-wider text-on-surface-variant font-medium uppercase">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            {message}
                        </span>
                        <span className="text-on-surface font-bold">{Math.round(progress)}%</span>
                    </div>
                </div>
                {/*  Footer Info  */}
                <footer className="absolute bottom-12 w-full flex flex-col items-center space-y-6 px-6">
                    <div className="flex items-center gap-8 text-on-surface-variant/40">
                        <span className="material-symbols-outlined text-xl" data-icon="camera">camera</span>
                        <span className="material-symbols-outlined text-xl" data-icon="filter_vintage">filter_vintage</span>
                        <span className="material-symbols-outlined text-xl" data-icon="auto_awesome">auto_awesome</span>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed max-w-[280px]">
                        Experience photography through a high-end prismatic lens. Designed for the social era.
                    </p>
                </footer>
            </main>
            {/*  Grain Overlay  */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay">
                <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" type="fractalNoise"></feTurbulence>
                    </filter>
                    <rect filter="url(#noiseFilter)" height="100%" width="100%"></rect>
                </svg>
            </div>

        </div>
    );
};

export default SplashScreen;
