import React from 'react';

const SettingsDashboard = () => {
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto">
      
{/*  Top Navigation for Mobile (Responsive Shell)  */}
<header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-sm sticky top-0 z-50 flex items-center justify-between px-6 h-16 w-full md:hidden">
<div className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">Prismatic</div>
<div className="flex gap-4">
<span className="material-symbols-outlined text-slate-500" data-icon="tune">tune</span>
<span className="material-symbols-outlined text-slate-500" data-icon="settings">settings</span>
</div>
</header>
{/*  Side Navigation (Web Desktop)  */}
<aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 shadow-xl z-50">
<div className="p-6">
<div className="text-xl font-bold text-slate-900 dark:text-white mb-1">Prismatic</div>
<div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Studio Settings</div>
</div>
<nav className="flex-1 px-4 space-y-2">
{/*  Active Tab: Camera & Hardware mapped to current context  */}
<a className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-inter text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" href="#">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
                Camera &amp; Hardware
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-inter text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50" href="#">
<span className="material-symbols-outlined" data-icon="palette">palette</span>
                Branding &amp; Themes
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-inter text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50" href="#">
<span className="material-symbols-outlined" data-icon="share">share</span>
                Social Sharing
            </a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-inter text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50" href="#">
<span className="material-symbols-outlined" data-icon="collections">collections</span>
                Gallery
            </a>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<div className="flex items-center gap-3 px-2">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold">PA</div>
<div>
<div className="text-sm font-bold text-slate-900 dark:text-white">Prismatic Admin</div>
<div className="text-xs text-slate-500">v2.4.0-pro</div>
</div>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="md:ml-64 min-h-screen p-6 md:p-12 lg:p-16 pb-24 md:pb-16 relative overflow-hidden">
{/*  Background Decor  */}
<div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>
<div className="fixed bottom-[-5%] left-[10%] w-[400px] h-[400px] bg-tertiary/10 blur-[100px] rounded-full pointer-events-none"></div>
<div className="max-w-6xl mx-auto relative z-10">
<header className="mb-10">
<h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-white mb-2">Studio Configuration</h1>
<p className="text-on-surface-variant max-w-2xl font-body">Manage your hardware performance, visual branding, and sharing workflows for the ultimate photobooth experience.</p>
</header>
{/*  Settings Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/*  Section 1: Camera & Hardware  */}
<section className="md:col-span-8 glass-card rounded-xl p-8 neon-glow-primary">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary-fixed" data-icon="photo_camera" style={{"fontVariationSettings":"\"FILL\" 1"}}>photo_camera</span>
<h2 className="text-xl font-headline font-bold text-white">Camera &amp; Hardware</h2>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
<div className="space-y-4">
<label className="block text-sm font-medium text-on-surface-variant">ISO Sensitivity</label>
<input className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container" type="range"/>
<div className="flex justify-between text-xs text-on-surface-variant">
<span>100</span>
<span>Auto</span>
<span>6400</span>
</div>
</div>
<div className="space-y-4">
<label className="block text-sm font-medium text-on-surface-variant">Focus Mode</label>
<select className="w-full bg-surface-container border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary-container outline-none">
<option>Continuous AF-C</option>
<option>Single Shot AF-S</option>
<option>Manual Focus</option>
<option>Face Detection</option>
</select>
</div>
<div className="space-y-4">
<label className="block text-sm font-medium text-on-surface-variant">Capture Delay (Seconds)</label>
<div className="flex gap-2">
<button className="flex-1 py-2 rounded-md bg-primary-container text-white font-bold text-sm">3s</button>
<button className="flex-1 py-2 rounded-md bg-surface-container-highest text-on-surface font-medium text-sm">5s</button>
<button className="flex-1 py-2 rounded-md bg-surface-container-highest text-on-surface font-medium text-sm">10s</button>
</div>
</div>
<div className="space-y-4">
<label className="block text-sm font-medium text-on-surface-variant">Hardware Status</label>
<div className="flex items-center gap-2 text-tertiary font-medium">
<span className="relative flex h-3 w-3">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
<span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
</span>
                                DSLR Connected
                            </div>
</div>
</div>
</section>
{/*  Section 2: Event Quick Actions  */}
<section className="md:col-span-4 glass-card rounded-xl p-8 flex flex-col justify-between">
<div>
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-tertiary" data-icon="event">event</span>
<h2 className="text-xl font-headline font-bold text-white">Event Settings</h2>
</div>
<div className="space-y-4">
<div>
<label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Event Name</label>
<input className="w-full bg-surface-container-highest/50 border-outline-variant rounded-lg px-4 py-3 text-on-surface font-semibold" type="text" value="Gala Night 2024"/>
</div>
<div className="pt-4 flex flex-col items-center justify-center p-6 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low">
<span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2" data-icon="qr_code_2">qr_code_2</span>
<span className="text-sm font-medium text-on-surface-variant">QR Sharing Code</span>
<button className="mt-4 text-xs font-bold text-primary px-4 py-2 border border-primary/30 rounded-full hover:bg-primary/10 transition-colors">REGENERATE</button>
</div>
</div>
</div>
</section>
{/*  Section 3: Branding  */}
<section className="md:col-span-6 glass-card rounded-xl p-8">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-primary-fixed" data-icon="brush" style={{"fontVariationSettings":"\"FILL\" 1"}}>brush</span>
<h2 className="text-xl font-headline font-bold text-white">Branding</h2>
</div>
<div className="space-y-6">
<div className="flex items-center gap-6">
<div className="w-20 h-20 bg-surface-container-highest rounded-xl flex items-center justify-center border border-outline-variant overflow-hidden group relative">
<img className="w-full h-full object-cover" data-alt="Abstract vibrant geometric logo pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Uk4jPg7aEFxzDcACDDz_t7eDZ7sSoUIHmiMvNUZrK6I8e2vWlYSBCNAw4Az_yc_2yMVoZ1fGYK1ga4qelFpNe0grgfm70OFplXPvAdi1woO97rqsmbr9vJ07k_3XGaHKJUhKPOydF3DEAHV_gXa086DPAEq7yen-K6tWXQhYYUwVngd9Ou_SsOc6_H3cBlLpi_UNG8PeEXsHTyjNzv3gzjjxXqVyknerRPpYZ8Cmcp2XFlvkRU9GXkfpBLMtJiOeG7lCAiT4Yp_6"/>
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-white" data-icon="upload">upload</span>
</div>
</div>
<div className="flex-1">
<h4 className="text-sm font-bold text-white">Brand Logo</h4>
<p className="text-xs text-on-surface-variant mb-2">PNG or SVG, Max 2MB</p>
<button className="text-xs font-bold text-on-primary-container bg-primary-container px-4 py-2 rounded-lg">UPLOAD NEW</button>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase">Accent Color</label>
<div className="flex items-center gap-3 p-2 bg-surface-container rounded-lg border border-outline-variant">
<div className="w-6 h-6 rounded-full bg-primary-container"></div>
<span className="text-xs font-mono text-on-surface">#2D5BFF</span>
</div>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase">UI Theme</label>
<div className="flex gap-2">
<div className="flex-1 h-10 bg-slate-900 border-2 border-primary-container rounded-md"></div>
<div className="flex-1 h-10 bg-slate-100 rounded-md"></div>
</div>
</div>
</div>
</div>
</section>
{/*  Section 4: Social Sharing  */}
<section className="md:col-span-6 glass-card rounded-xl p-8 border-l-4 border-tertiary">
<div className="flex items-center gap-3 mb-6">
<span className="material-symbols-outlined text-tertiary" data-icon="send" style={{"fontVariationSettings":"\"FILL\" 1"}}>send</span>
<h2 className="text-xl font-headline font-bold text-white">Social Sharing</h2>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
</div>
<div>
<div className="text-sm font-bold text-white">Instagram Direct</div>
<div className="text-xs text-on-surface-variant">Post directly to stories</div>
</div>
</div>
<div className="w-12 h-6 bg-primary-container rounded-full relative p-1 cursor-pointer">
<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<div>
<div className="text-sm font-bold text-white">Email Delivery</div>
<div className="text-xs text-on-surface-variant">Custom HTML templates</div>
</div>
</div>
<div className="w-12 h-6 bg-primary-container rounded-full relative p-1 cursor-pointer">
<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
<span className="material-symbols-outlined" data-icon="sms">sms</span>
</div>
<div>
<div className="text-sm font-bold text-white">SMS Sharing</div>
<div className="text-xs text-on-surface-variant">Twilio Integration Active</div>
</div>
</div>
<div className="w-12 h-6 bg-surface-container-highest rounded-full relative p-1 cursor-pointer">
<div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full"></div>
</div>
</div>
</div>
</section>
</div>
{/*  Footer Action Bar  */}
<div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-6 glass-card rounded-2xl border-t-2 border-primary-container/30">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error">
<span className="material-symbols-outlined" data-icon="report">report</span>
</div>
<div>
<div className="text-sm font-bold text-white">Unsaved Changes</div>
<div className="text-xs text-on-surface-variant">You have modified 4 camera settings</div>
</div>
</div>
<div className="flex gap-4 w-full md:w-auto">
<button className="flex-1 md:flex-none px-8 py-3 rounded-xl border border-outline-variant text-on-surface font-bold hover:bg-white/5 transition-all">DISCARD</button>
<button className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-primary-container text-white font-bold neon-glow-primary active:scale-95 transition-all">SAVE CONFIGURATION</button>
</div>
</div>
</div>
</main>
{/*  Bottom Navigation for Mobile  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-white/20 dark:border-slate-800/50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl flex justify-around items-center px-4 py-3 pb-safe">
<div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl px-3 py-1">
<span className="material-symbols-outlined" data-icon="settings_input_component">settings_input_component</span>
<span className="text-[10px] font-bold uppercase tracking-wider mt-1">Hardware</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-transform active:scale-90">
<span className="material-symbols-outlined" data-icon="brush">brush</span>
<span className="text-[10px] font-bold uppercase tracking-wider mt-1">Branding</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-transform active:scale-90">
<span className="material-symbols-outlined" data-icon="send">send</span>
<span className="text-[10px] font-bold uppercase tracking-wider mt-1">Social</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-transform active:scale-90">
<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span className="text-[10px] font-bold uppercase tracking-wider mt-1">Gallery</span>
</div>
</nav>

    </div>
  );
};

export default SettingsDashboard;
