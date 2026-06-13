import React from 'react';

const STATUS_ICON = {
    ok: 'check_circle',
    failed: 'error',
};

const CheckRow = ({ check }) => {
    const isOk = check.status === 'ok';
    const isFailed = check.status === 'failed';
    const isChecking = check.status === 'checking';

    let color = 'text-on-surface-variant';
    if (isOk) color = 'text-primary';
    else if (isFailed) color = 'text-red-400';

    return (
        <div className="flex items-start gap-3 text-left">
            <span className={`mt-0.5 flex-shrink-0 ${color}`}>
                {isChecking ? (
                    <span className="block w-4 h-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin"></span>
                ) : (
                    <span className="material-symbols-outlined text-base leading-none">
                        {STATUS_ICON[check.status] || 'radio_button_unchecked'}
                    </span>
                )}
            </span>
            <div className="flex-1 min-w-0">
                <p className={`font-sans text-xs font-medium ${isFailed ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {check.label}
                </p>
                {isFailed && check.detail && (
                    <p className="font-body text-[11px] text-red-400/80 leading-snug mt-0.5">
                        {check.detail}
                    </p>
                )}
            </div>
        </div>
    );
};

const SplashScreen = ({
    progress = 65,
    message = "Initializing Engine",
    checks = null,
    hasFailure = false,
    onRetry,
    onContinue,
}) => {
    return (
        <div className="w-full h-screen bg-background text-on-surface">

            {/*  Background Subtlety  */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="modern-gradient absolute inset-0"></div>
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full"></div>
            </div>
            {/*  Main Content Canvas  */}
            <main className="relative z-10 flex flex-col items-center min-h-screen w-full px-6 py-12 text-center overflow-y-auto">
                {/*  Centered Stack (logo + progress)  */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                {/*  Logo Branding Section  */}
                <div className="flex flex-col items-center space-y-8">
                    {/*  Logo  */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <img
                            src="/kuhabox-dark.png"
                            alt="KuhaBox"
                            className="relative w-72 md:w-80 h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                    {/*  Tagline  */}
                    <p className="font-sans text-on-surface-variant tracking-[0.3em] text-[10px] md:text-xs font-semibold uppercase">
                        Capture Every Moment
                    </p>
                </div>
                {/*  Progress System  */}
                <div className="mt-12 w-full max-w-xs space-y-4">
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

                    {/*  Per-check Status List  */}
                    {checks && (
                        <div className="pt-2 space-y-3">
                            {checks.map((check) => (
                                <CheckRow key={check.id} check={check} />
                            ))}
                        </div>
                    )}

                    {/*  Failure Actions  */}
                    {hasFailure && (
                        <div className="pt-2 flex flex-col gap-3">
                            <button
                                onClick={onRetry}
                                className="w-full py-3 px-6 rounded-xl bg-primary text-on-primary font-sans text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(45,91,255,0.4)] transition-transform hover:scale-[1.02]"
                            >
                                <span className="material-symbols-outlined text-base align-middle mr-2">refresh</span>
                                Retry
                            </button>
                            <button
                                onClick={onContinue}
                                className="w-full py-3 px-6 rounded-xl bg-surface border border-outline/50 text-on-surface-variant font-sans text-xs font-semibold uppercase tracking-wider transition-colors hover:text-on-surface"
                            >
                                Continue anyway
                            </button>
                        </div>
                    )}
                </div>
                </div>
                {/*  Footer Info  */}
                <footer className="flex-shrink-0 mt-12 pt-8 w-full flex flex-col items-center space-y-6 px-6">
                    <div className="flex items-center gap-8 text-on-surface-variant/40">
                        <span className="material-symbols-outlined text-xl" data-icon="camera">camera</span>
                        <span className="material-symbols-outlined text-xl" data-icon="filter_vintage">filter_vintage</span>
                        <span className="material-symbols-outlined text-xl" data-icon="auto_awesome">auto_awesome</span>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed max-w-[280px]">
                        A modern photobooth experience — capture, customize, and share your moments in an instant.
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
