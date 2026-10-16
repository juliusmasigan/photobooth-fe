import React, { useState } from 'react';
import InfoOverlay from '../components/InfoOverlay';

const PrintShare = () => {
    const [infoOpen, setInfoOpen] = useState(false);
    return (
        <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto pb-24">

            {/*  TopAppBar  */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
                <div className="flex items-center gap-2">
                    <img src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setInfoOpen(true)} className="flex items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
                        <span className="material-symbols-outlined" data-icon="info">info</span>
                    </button>
                    <button className="flex items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
                        <span className="material-symbols-outlined" data-icon="settings">settings</span>
                    </button>
                </div>
            </header>
            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/*  Final Photo Preview Section  */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-xl blur opacity-25"></div>
                            <div className="relative glass-card rounded-xl overflow-hidden p-3 aspect-[4/5] sm:aspect-video flex items-center justify-center">
                                <img alt="Final edited artistic photograph" className="w-full h-full object-cover rounded-lg shadow-2xl" data-alt="Modern artistic photograph with high-end color grading" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKjIAfLLJs1V53CxK8JRfKgPfSuMNoC01obWPIrl5689e_keNTfbz_1dSARNcyBZR3NHxQXz_UO5AaserQTFFn7epjLbQBQ02En-rTKjBnfnGEkcllCDk2YhwfipqvwaZkEx2hzozPUFxUtjgmV5ndCanFJBvmsJ2VOspbOrCDJv1YmUrzCiuGP1cPgmVZVMcbzM9YdwSVfAvs-B82Hqj6R__paWyyZm152vEpGd5ef4xdGU5K_qZlHLjDOt2muzUYwrxvT01pQPRh" />
                                <div className="absolute bottom-8 right-8 flex gap-2">
                                    <div className="glass-card px-4 py-2 rounded-full text-xs font-medium text-white/90 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        Final Render · 4K UHD
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight text-on-background lg:text-4xl">Masterpiece Ready.</h1>
                            <p className="text-on-surface-variant max-w-2xl leading-relaxed">Your photo has been processed with ultra-high fidelity. You can now print, share, or download your creation to any device.</p>
                        </div>
                    </div>
                    {/*  Action Sidebar  */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/*  QR Download Card  */}
                        <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-6 shadow-2xl">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Scan to Download</h3>
                                <p className="text-sm text-on-surface-variant">Instant access on your mobile device</p>
                            </div>
                            <div className="relative p-4 bg-white rounded-xl shadow-inner">
                                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {/*  Using a placeholder pattern that mimics a QR code structure visually  */}
                                    <div className="grid grid-cols-5 gap-1 p-2 w-full h-full opacity-80">
                                        <div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-primary p-2 rounded-lg shadow-lg">
                                        <span className="material-symbols-outlined text-white text-2xl" data-icon="qr_code_2">qr_code_2</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/10"></div>
                            <div className="flex items-center gap-3 text-on-surface-variant text-sm font-medium">
                                <span className="material-symbols-outlined text-primary" data-icon="verified_user">verified_user</span>
                                Secure encrypted link
                            </div>
                        </div>
                        {/*  Primary Actions Cluster  */}
                        <div className="flex flex-col gap-3">
                            <button className="w-full py-4 px-6 bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg shadow-primary-container/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined" data-icon="print">print</span>
                                PRINT HIGH-RES COPY
                            </button>
                            <button className="w-full py-4 px-6 glass-card text-on-surface font-semibold rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-white/20">
                                <span className="material-symbols-outlined" data-icon="share">share</span>
                                SHARE TO SOCIALS
                            </button>
                            <button className="w-full py-4 px-6 glass-card text-on-surface-variant font-medium rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-white/10 mt-4">
                                <span className="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
                                APPLY NEW FILTERS
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/*  BottomNavBar  */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-20 px-4 bg-slate-900/40 backdrop-blur-xl dark:bg-slate-950/40 border border-white/20 rounded-full mx-6 mb-6 shadow-2xl shadow-blue-900/20">
                <a className="flex items-center justify-center text-slate-400 w-12 h-12 transition-all active:scale-90 duration-150" href="#">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined" data-icon="home">home</span>
                        <span className="font-inter text-[10px] font-medium mt-1">Home</span>
                    </div>
                </a>
                <a className="flex items-center justify-center text-slate-400 w-12 h-12 transition-all active:scale-90 duration-150" href="#">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined" data-icon="photo_library">photo_library</span>
                        <span className="font-inter text-[10px] font-medium mt-1">Gallery</span>
                    </div>
                </a>
                <a className="flex items-center justify-center text-slate-400 w-12 h-12 transition-all active:scale-90 duration-150" href="#">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
                        <span className="font-inter text-[10px] font-medium mt-1">Effects</span>
                    </div>
                </a>
                {/*  Active Tab: Share  */}
                <a className="flex items-center justify-center bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-500/50 active:scale-90 duration-150" href="#">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined" data-icon="share" style={{ "fontVariationSettings": "\"FILL\" 1" }}>share</span>
                        <span className="font-inter text-[10px] font-medium mt-0.5">Share</span>
                    </div>
                </a>
            </nav>

            <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
        </div>
    );
};

export default PrintShare;
