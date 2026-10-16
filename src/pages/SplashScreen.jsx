import React from 'react';

const STATUS_ICON = {
    ok: 'check_circle',
    failed: 'error',
};

const SplashScreen = ({
    progress = 65,
    message = "Initializing Engine",
    checks = null,
    hasFailure = false,
    onRetry,
    onContinue,
}) => {
    //  Derive the single "current" check to display on one line.
    const failedChecks = checks?.filter((c) => c.status === 'failed') || [];
    const failedCheck = failedChecks[0] || null;
    const checkingCheck = checks?.find((c) => c.status === 'checking') || null;
    const currentCheck = failedCheck || checkingCheck;

    const currentStatus = currentCheck ? currentCheck.status : 'ok';
    const currentLabel = currentCheck ? currentCheck.label : message;
    const isFailed = currentStatus === 'failed';
    const isChecking = currentStatus === 'checking';

    let labelColor = 'text-on-surface-variant';
    if (isFailed) labelColor = 'text-red-400';
    else if (currentStatus === 'ok') labelColor = 'text-primary';

    return (
        <div className="w-full h-screen bg-background text-on-surface">

            {/*  Background Subtlety  */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="modern-gradient absolute inset-0"></div>
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full"></div>
            </div>
            {/*  Main Content Canvas  */}
            <main className="relative z-10 flex flex-col items-center min-h-screen w-full px-6 text-center">
                {/*  Centered Logo Branding Section  */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {/*  Logo  */}
                    <div className="relative">
                        <img
                            src="/SnapGo-dark.png"
                            alt="SnapGo"
                            className="relative w-72 md:w-80 h-auto rounded-xl shadow-2xl"
                        />
                    </div>
                    {/*  Tagline  */}
                    <p className="mt-2 font-sans text-on-surface-variant tracking-[0.3em] text-[10px] md:text-xs font-semibold uppercase">
                        Capture Every Moment
                    </p>
                </div>

                {/*  Progress System (anchored at bottom, full width)  */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-stretch">
                    {/*  Single current-check line  */}
                    <div className="flex items-center justify-between gap-3 px-6 pb-3 text-left">
                        <span className="flex items-center gap-2 min-w-0">
                            <span className={`flex-shrink-0 flex items-center ${labelColor}`}>
                                {isChecking ? (
                                    <span className="block w-3.5 h-3.5 rounded-full border-2 border-primary/40 border-t-primary animate-spin"></span>
                                ) : (
                                    <span className="material-symbols-outlined text-base leading-none">
                                        {STATUS_ICON[currentStatus] || 'radio_button_unchecked'}
                                    </span>
                                )}
                            </span>
                            <span className={`truncate font-sans text-[11px] tracking-wider font-medium uppercase ${labelColor}`}>
                                {currentLabel}
                            </span>
                        </span>
                        <span className="flex-shrink-0 font-sans text-[11px] tracking-wider text-on-surface font-bold">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    {/*  Loading Indicator (full screen width)  */}
                    <div className="h-2 w-full bg-outline/30 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300 relative shadow-[0_0_15px_rgba(45,91,255,0.4)]" style={{ width: `${progress}%` }}>
                            <div className="absolute inset-0 shimmer"></div>
                        </div>
                    </div>
                </div>
            </main>

            {/*  Error Dialog  */}
            {hasFailure && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/60 backdrop-blur-md">
                    <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl bg-white/60 backdrop-blur-2xl border border-white/40 ring-1 ring-white/20 text-left">
                        {/*  Header  */}
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-error-container text-2xl leading-none">error</span>
                            <h2 className="font-sans text-lg font-bold text-on-primary">System check failed</h2>
                        </div>

                        {/*  Failed checks  */}
                        <ul className="mt-5 space-y-3">
                            {failedChecks.map((c) => (
                                <li key={c.id} className="space-y-0.5">
                                    <p className="font-sans text-sm font-medium text-on-primary-container">{c.label}</p>
                                    {c.detail && (
                                        <p className="font-body text-xs text-error-container/90 leading-snug">{c.detail}</p>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/*  Actions  */}
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={onRetry}
                                className="w-full py-3 px-6 rounded-xl bg-primary text-on-primary font-sans text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(45,91,255,0.4)] transition-transform active:scale-95"
                            >
                                <span className="material-symbols-outlined text-base align-middle mr-2">refresh</span>
                                Retry
                            </button>
                            <button
                                onClick={onContinue}
                                className="w-full py-3 px-6 rounded-xl bg-surface border border-outline/50 text-on-surface-variant font-sans text-xs font-semibold uppercase tracking-wider"
                            >
                                Continue anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
