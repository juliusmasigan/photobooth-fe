import React from 'react';

const ThemeSelection = () => {
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto pb-24">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-900/50 backdrop-blur-md dark:bg-slate-950/50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-inter tracking-tight">Prismatic</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:bg-white/10 transition-colors rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">info</span>
          </button>
          <button className="p-2 text-slate-400 hover:bg-white/10 transition-colors rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-4rem)]">
        {/*  Left: Live Preview  */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-on-surface-variant text-sm font-medium tracking-wider">LIVE PREVIEW</h2>
              <p className="text-2xl font-bold text-on-surface">Vibrant Prism</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">HD Preview</span>
            </div>
          </div>
          <div className="flex-1 glass-card rounded-xl p-6 relative overflow-hidden group preview-glow">
            {/*  Preview Content  */}
            <div className="w-full h-full rounded-lg overflow-hidden border-4 border-white/10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 mix-blend-overlay"></div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full p-2 bg-slate-900">
                <div className="relative rounded overflow-hidden">
                  <img alt="Abstract geometry" className="w-full h-full object-cover" data-alt="Vibrant abstract geometric shapes and colors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9dcBIQeNFiSmapfRJyI8Nw4rxQIX4_E26hXiHpQ7fRAmxNraGtaFZM26qgAJgtJ4m2UAzhjyzM5gnK8t7KVAVtJ3LWg-Bcf3UsAi7XAm7sF6YddYSSZuUW8xwKU4BZQGeABn1iXxZxf4AeqGJtcXdtinVUIEFB8vszZqX5ar9jm8LvXPt87hYyBZ5-p6ODS2ef24YlDX1ZTjNcrua12WFNfa4k7ZDMP8YxUYeJqlEa01tDmkTuNeOfeqsb5Rl2GBHvEOIyKJ5yjAE" />
                </div>
                <div className="relative rounded overflow-hidden">
                  <img alt="Prismatic refraction" className="w-full h-full object-cover" data-alt="Light refracting through a glass prism" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv5NsS-mhDKToGAjw3Z7P-laVKb4clwSIaKkN5SLwhE6pupUpvL7pcNDYrrPsIlCpB-Y51dvXfnQXlxAtmfO8fiWrO0hedXNsOyPcB3vDfEUkLwsGppOtgqd39UlLiJWT5iI9_1rYDnsAe-sv1YOH2hKSPyvFU-TJrux6l-rFt4o5w85cA6qJXDtk_rO1BSYeIBYSLrys-Rh0pyjdUemRdbdwT-eccs_uJdZ1ePu6qZWOZsAynhgyxFifwrrYY2uJSGNES86ds_8jn" />
                </div>
                <div className="relative rounded overflow-hidden">
                  <img alt="Colorful fluid" className="w-full h-full object-cover" data-alt="Colorful fluid marble texture pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS_HT-JL7zjC2Ei_kSHZIHblqd7gBVNPwB7nVaorZMfK-m4OBldwUV6jqlQZBbK55_3JQCIO_YFNLWpsRlj_jA5qcQOFc4ETD1Wbnajn2uIZK3iRW2pI_VGP4UhKlLrzSxrOvopmstupMyPuNXmXA8Yr5kUQdmRoylEkO0z2przphvl4WQ4P-LMZOLkpH0UH5aeQkPpzifwYJ38154l-H406-aZkmZWXnUJcosTGBE-nbvWGf4suJ7HF-JT6Ebx_y5F-hZcFEh32jO" />
                </div>
                <div className="relative rounded overflow-hidden">
                  <img alt="Digital art" className="w-full h-full object-cover" data-alt="Modern digital abstract art with blue tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXvMmyQ0zftkZavXKdBwnZ1_JmeYmJleDUvguWGny6IoUY9wEYh-oru-CW6xLyNPHyaCjmOx__gwr8mijBnnLNg6P7Pa0HslRhCTeN1FOkomyqNEA0aoUdgE2lHVKxn_PN8z-pz7eG_AKxb9XiaiRJVtGQwfu7YF8mkxKgY588dmdlTPrFZ61ZRdE1xviPtTYURxBBwRCWXbf77WGe3ancUkZRmVEqAY1iVXvyfSZaVbPpiFWpEbBWiTwaQuGajYhDbPEGFC_P24eR" />
                </div>
              </div>
            </div>
            {/*  Interactive Controls Overlay (Subtle)  */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">zoom_in</span>
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">refresh</span>
              </button>
            </div>
          </div>
        </div>
        {/*  Right: Configuration Panels  */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/*  Section: Layout  */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
              <h3 className="font-bold text-lg">Layout</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-primary text-on-primary-container border border-primary/50 transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-2xl" style={{ "fontVariationSettings": "\"FILL\" 1" }}>grid_view</span>
                <span className="text-xs font-semibold">2x2 Grid</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-variant transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">view_stream</span>
                <span className="text-xs font-semibold">Strip</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-variant transition-all text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">square</span>
                <span className="text-xs font-semibold">Single</span>
              </button>
            </div>
          </section>
          {/*  Section: Frame Styles  */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">frame_inspect</span>
              <h3 className="font-bold text-lg">Frame Style</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border border-outline-variant cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-white/40 rounded flex items-center justify-center text-[10px]">THIN</div>
                  <span className="font-medium">Minimal Border</span>
                </div>
                <input checked="" className="text-primary focus:ring-primary bg-transparent border-outline-variant" name="frame" type="radio" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border border-outline-variant cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-white rounded flex items-center justify-center text-[10px]">BOLD</div>
                  <span className="font-medium">Gallery Thick</span>
                </div>
                <input className="text-primary focus:ring-primary bg-transparent border-outline-variant" name="frame" type="radio" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border border-outline-variant cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-dashed border-white/40 rounded flex items-center justify-center text-[10px]">DASH</div>
                  <span className="font-medium">Dashed Accent</span>
                </div>
                <input className="text-primary focus:ring-primary bg-transparent border-outline-variant" name="frame" type="radio" />
              </label>
            </div>
          </section>
          {/*  Section: Style/Atmosphere  */}
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">palette</span>
              <h3 className="font-bold text-lg">Visual Style</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-4 p-3 rounded-lg bg-primary-container text-white border border-primary transition-all">
                <div className="w-12 h-12 rounded bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shrink-0"></div>
                <div className="text-left">
                  <p className="font-bold text-sm">Vibrant Prism</p>
                  <p className="text-[10px] text-white/70">High saturation, sharp highlights</p>
                </div>
                <span className="material-symbols-outlined ml-auto" style={{ "fontVariationSettings": "\"FILL\" 1" }}>check_circle</span>
              </button>
              <button className="w-full flex items-center gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant hover:bg-surface-variant transition-all">
                <div className="w-12 h-12 rounded bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-950 shrink-0"></div>
                <div className="text-left">
                  <p className="font-bold text-sm text-on-surface">Noire Retro</p>
                  <p className="text-[10px] text-on-surface-variant">Monochrome, deep shadows</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant hover:bg-surface-variant transition-all">
                <div className="w-12 h-12 rounded bg-gradient-to-tr from-amber-200 via-orange-300 to-rose-400 shrink-0 opacity-80"></div>
                <div className="text-left">
                  <p className="font-bold text-sm text-on-surface">Analog Haze</p>
                  <p className="text-[10px] text-on-surface-variant">Film grain, warm soft tones</p>
                </div>
              </button>
            </div>
          </section>
          <div className="flex gap-4 pt-4">
            <button className="flex-1 py-4 px-6 rounded-full bg-surface-container border border-outline-variant text-on-surface font-bold hover:bg-surface-variant transition-all active:scale-95">Reset</button>
            <button className="flex-[2] py-4 px-6 rounded-full bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Apply Changes</button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ThemeSelection;
