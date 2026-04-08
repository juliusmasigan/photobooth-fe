import React from 'react';

const PhotoSelection = () => {
  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-900/50 backdrop-blur-md dark:bg-slate-950/50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-inter tracking-tight">Prismatic</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined" data-icon="info">info</span>
          </button>
          <button className="text-slate-400 hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </button>
        </div>
      </header>
      {/*  Main Content  */}
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-white">Select your</span>
            <span className="text-primary-dim">favorites</span>
          </h1>
          <p className="text-on-surface-variant font-medium">Choose the best shots for your final gallery.</p>
        </div>
        {/*  Photo Grid  */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/*  Selected Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card selected-ring transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover" data-alt="Close up portrait of a woman with prism lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCotrwEgjALu3kqQXjDX_YinZaeyVmknuAWvHrEfhhdbsqaR31YxcrnKCDRkXtO4ALllFwMuwkomzj_iEVnLDa5drMKqQppHx23a_Jh-Ty6m7bIYDNQwkOCrkR4AAlL3KxnFpDVT699zaYeg3rieBdpn6TaIypE5u2J2veOJ5nEEaJlPt-ni1si0Lnl4iIxFkQ-sCCPb1Qo5nvZ_sMvLROaqFZ5S-LsMp0xwIetlE07hEuRwmJa2Mq1Cj3yJt-Frs5PPDTW8ZGwcV_C" />
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[18px]" data-icon="check" style={{ "fontVariationSettings": "\"FILL\" 1" }}>check</span>
            </div>
          </div>
          {/*  Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Abstract architectural photography with sharp angles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgs2hDibC50mJfrCOhKu-2SdyGS8OM2xESBEN7pwItLMsCBB4Tkegbn0mVJfqzoE8_AnlYYj818okV-lLyRdNJhgcYmyG-sMTIB5QPbsk5c4o33ADPm2PgrdZhyFnNwlTYlnuxUM4gzXIGTUcXAKXKqfofTlWIALhzYWQTFOXbQNoEjlOz4PVMuE24c6dTKIOc9wRQn9NU9BHhcKY6LOISpKO5K-PGGG-CMdyrrjzFziFd9I1WuejV-n4jqMqTAQBgs8ji-ra60lT4" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[18px] text-white opacity-0 group-hover:opacity-100 transition-opacity" data-icon="add">add</span>
            </div>
          </div>
          {/*  Selected Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card selected-ring transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover" data-alt="Fashion photography with neon reflections" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1TVrCvhcwXZlultSxQW-_DxbVGc_lrKgQRWxegGW0DWMeHCpPWccBSlaNAzCBOkffUXM0olptbBukEL0qupBOpWXW01dV1BGEr3Q30JtgmhCiDpSfMVh7hnixXWEUFL5UKszZ2pr4XmBQP73f_HtjGTPA99t_muiGDrTBexT4qmL8DNL5wDComPvJquAMqkbRH7QTs2E7inxrRkf_uvrtI4rPlYt437aEr4WrKDenoFMBdWVWq9HMeWPuPl4tKXswI8VEkgho5cEt" />
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[18px]" data-icon="check" style={{ "fontVariationSettings": "\"FILL\" 1" }}>check</span>
            </div>
          </div>
          {/*  Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Candid street photography with light flares" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOrbVLuj0trxNyrqwIMKm0f7M4oH78PDP8uXtQwHNx16DzGoOB2XTQ9vI-Gw1R02y5cXD62Q-cvg5BLHljfgVtLT56Vohs8x78u-rvPEMRt71Q3i6tzfBWYXiVvF0rrgoFmfpZeMgwU3KuV1XnziCJWP0zKf3BbBOQ1xz6ks5EfbKweODlvuoXXbPETVjTmAKrFN5WhtH42gTB2d3kJA5mjAMbb98Qoztbj9VO_3S5bYPklg4-HrXahDImlmLXkMuqlxquolnCpQtL" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[18px] text-white opacity-0 group-hover:opacity-100 transition-opacity" data-icon="add">add</span>
            </div>
          </div>
          {/*  Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Editorial portrait with soft bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUbdvWIWJ83OeiD1Na0IUWA3e_m1vghPmbCur-1enNfW10RZfD69ZM7QIBRcRiZw0KUeS-AbgkuZiN4yioc3WTQ4j1SRCbsiT9GXU2VvRXO9a9M5YzcXTxxE0T3aG0JdSFsBeIJpeHBP14X0aQJ0JfsDMyHljKbSgsFZZ4n-jsv8BcWsH7k30DnW1nzTdFRxc8dSqxiNwXjaDPozFucpoo4Y1F4yrGzGPCZu65IfqM6TiDuMKxwPiFvAdIJWRvkPbi66OoEla1XAAy" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[18px] text-white opacity-0 group-hover:opacity-100 transition-opacity" data-icon="add">add</span>
            </div>
          </div>
          {/*  Selected Item  */}
          <div className="relative group aspect-square rounded-xl overflow-hidden glass-card selected-ring transition-all duration-300 cursor-pointer">
            <img className="w-full h-full object-cover" data-alt="Portrait of a man with dramatic shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfWJM6sRRAyxSM-_OV9W2M68_R7HAO61Qro4xWeZ-drOu3Ehqq2I4bMfeEOb-jAXa31W6tPyfctdELD8nh7wJlYLMm16IeGlSYg1gvl5ICYDO4xoS9i-VvJtt44ZPIYX8Hux6T-82OzRu3PPP0ZfkApmC0vuzbchrrHgdFuIDcdoJhNOu_bBgMJ6MF-t0ipN3G2aZJpcrkITbMaPER5PCABrJ3zMEpPwVHWM984DFdk_4GmXvOA3549qy4oT9f6Odv1HNqQlinJUy_" />
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[18px]" data-icon="check" style={{ "fontVariationSettings": "\"FILL\" 1" }}>check</span>
            </div>
          </div>
        </div>
        <div className="mt-12 mb-20 text-center">
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">3 photos selected</p>
        </div>
      </main>
      {/*  Frosted Glass Footer  */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/40 backdrop-blur-xl dark:bg-slate-950/40 border-t border-white/10 px-6 py-6 h-24 flex items-center justify-center gap-4">
        <div className="w-full max-w-4xl flex items-center justify-between gap-6">
          <button className="flex-1 max-w-[180px] h-14 rounded-xl font-bold tracking-wide border border-white/20 text-white hover:bg-white/10 active:scale-95 transition-all duration-200 uppercase text-sm">
            RETAKE
          </button>
          <button className="flex-1 max-w-[240px] h-14 rounded-xl font-bold tracking-wide bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/30 hover:brightness-110 active:scale-95 transition-all duration-200 uppercase text-sm flex items-center justify-center gap-2">
            NEXT
            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
      </footer>
      {/*  BottomNavBar (Hidden for focused selection task, as per UX goals)  */}
      {/*  Suppression logic: Page is transactional (Selection screen)  */}

    </div>
  );
};

export default PhotoSelection;
