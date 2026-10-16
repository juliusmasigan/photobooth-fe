import React from 'react';

const About = () => {
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
        <img src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        <div className="flex gap-4">
          <button className="flex items-center justify-center w-11 h-11 text-on-surface-variant transition-transform rounded-lg active:scale-95 duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="flex items-center justify-center w-11 h-11 text-primary font-semibold transition-transform rounded-lg active:scale-95 duration-200">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </header>
      <main className="pt-16 pb-32 max-w-7xl mx-auto px-6">
        {/*  Hero Section  */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-12 rounded-2xl">
          <div className="absolute inset-0 z-0">
            <img alt="Abstract glass prism refraction" className="w-full h-full object-cover opacity-40 scale-105" data-alt="Beautiful abstract glass and prism visual with light refraction" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7v1-Ce3-Q0dSJiG97lMTyL6tPqqkShWK6-8MGgLMt6VQXqVoW2PFWBhzIsw3ZRNd5hTc2hfVEJ9yCZ-Nr2QV-iY_E7zU9olTCgp5yxaNmgj00i7mEmqYmv298TLwQhYLZpVnfJ4E35dd-bye8mxkkKeZV854VjQG_uBTHzJ4sP-3J7Nb9FDKycXnYOc2IGAOOSW9O2eXvEz_OFoacYNEXvDIdSqTq99hm4OUbRvwhYl-eUZOZ8qSuYfZe5NbWW8WGimyjNrl1QKx_" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background"></div>
            {/*  Ambient Glows  */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full ambient-blur opacity-50"></div>
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6">
            <h1 className="font-headline text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 text-glow">
              SnapGo
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed">
              A modern photobooth experience. Capture, customize, and share your moments — where great memories meet effortless sharing.
            </p>
          </div>
        </section>
        {/*  Content Grid Optimized for Tablet  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/*  Feature 1: The SnapGo Experience  */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-10 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>filter_tilt_shift</span>
              </div>
              <h2 className="font-headline text-3xl font-bold text-white mb-6 tracking-tight">The SnapGo Experience</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg max-w-2xl">
                A complete photobooth in one box. Capture crisp, high-fidelity shots, apply curated themes and layouts, and print or share your creations in seconds — all from an intuitive, kiosk-ready interface.
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              <div className="h-24 flex-1 rounded-xl bg-surface-container-highest/50 border border-white/5"></div>
              <div className="h-24 flex-1 rounded-xl bg-surface-container-highest/50 border border-white/5 opacity-60"></div>
              <div className="h-24 flex-1 rounded-xl bg-surface-container-highest/50 border border-white/5 opacity-30"></div>
            </div>
          </div>
          {/*  Feature 2: Technology & Craft  */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-10 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-tertiary/20 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>memory</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-white mb-6 tracking-tight">Technology &amp; Craft</h2>
            <ul className="space-y-6 text-on-surface-variant">
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-lg font-medium">Real-time 4K Rendering</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-lg font-medium">Pro-grade Lighting Algorithms</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-lg font-medium">HDR Color Support</span>
              </li>
            </ul>
          </div>
          {/*  Feature 3: Designed for the Social Era  */}
          <div className="lg:col-span-12 glass-panel rounded-2xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <div className="w-14 h-14 rounded-xl bg-error/20 flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-error text-3xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>share</span>
              </div>
              <h2 className="font-headline text-4xl font-bold text-white mb-6 tracking-tight">Designed for the Social Era</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
                SnapGo isn't just about the capture; it's about the connection. With instant social integration and a curated set of trending filters, your creative vision reaches the world in seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-white/5 rounded-full text-sm font-bold uppercase tracking-wider border border-white/10">#SnapGo</span>
                <span className="px-5 py-2.5 bg-white/5 rounded-full text-sm font-bold uppercase tracking-wider border border-white/10">#PhotoBooth</span>
                <span className="px-5 py-2.5 bg-white/5 rounded-full text-sm font-bold uppercase tracking-wider border border-white/10">#SnapAndShare</span>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden relative order-1 md:order-2">
              <img alt="Social photography montage" className="w-full h-full object-cover" data-alt="A montage of artistic social media photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJXbOXU6_ITDPgO4hJlP8MJ48xg1fIWC-2DB5CETjIvz4AAbv7NOE5-pZeSZ9lhmNAxAcjYTCmu13qKZPHPS6qpmYK5ExhkIYej7liJBdDM2ohPHnRUGaLrdLjURWdjhYrXRS7mrD2ZqvCVNTOFPGxIAt2HreujrnA6Lj-jgeroOmy5elAWrkvAWUhxYK39dtSCjzEc_z7oznYRLDcCPg5kPPKJS02UiRePOYRZBWJq5nPT2cg7P-ENd6iouLHQO9bl-z_6hy7HLGy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
          </div>
        </div>
        {/*  Action Area  */}
        <div className="mt-20 flex flex-col items-center">
          <button className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-headline font-bold text-xl transition-all active:scale-95 shadow-2xl shadow-primary/30">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Start
          </button>
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-on-secondary-container text-xs font-bold tracking-[0.2em] uppercase">Version 2.4.0</p>
            <p className="text-on-surface-variant/40 text-xs font-medium uppercase tracking-widest">Built with Passion • 2024</p>
          </div>
        </div>
      </main>
      {/*  BottomNavBar  */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-center items-center px-4 pb-8 pt-4">
        <div className="flex justify-around items-center w-full max-w-2xl bg-gray-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl px-2 py-2">
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2.5">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-70">Capture</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2.5">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-70">Gallery</span>
          </div>
          <div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2.5">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-70">Lens</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-primary text-white rounded-xl px-8 py-2.5 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined" style={{ "fontVariationSettings": "\"FILL\" 1" }}>info</span>
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5">About</span>
          </div>
        </div>
      </nav>

    </div>
  );
};

export default About;
