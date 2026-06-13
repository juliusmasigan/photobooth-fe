import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const themeLayoutsUrl = process.env.REACT_APP_THEME_LAYOUTS || '/designs/layouts.json';

const ThemeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const captureMode = location.state?.mode || 'still';

  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDesigns = async () => {
      setLoading(true);
      const foundDesigns = [];
      try {
        const response = await fetch(themeLayoutsUrl);
        const data = await response.json();
        const layoutsForMode = data[captureMode] || [];
        for (const layout of layoutsForMode) {
          foundDesigns.push({
            id: layout.id,
            url: layout.url
          });
        }
        setDesigns(foundDesigns);
        if (foundDesigns.length > 0) {
          setSelectedDesign(foundDesigns[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        setLoading(false);
      }
    };

    getDesigns();
  }, [captureMode]);

  const handleNext = () => {
    navigate('/photo-capture', { state: { mode: captureMode, design: selectedDesign } });
  };

  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-y-auto pb-24">
      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-900/50 backdrop-blur-md dark:bg-slate-950/50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-inter tracking-tight">KuhaBox</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative flex items-center justify-center p-2 text-slate-400 hover:bg-white/10 transition-colors active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-4rem)]">
        {/*  Left: Live Preview  */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-on-surface-variant text-sm font-medium tracking-wider uppercase">{captureMode} MODE</h2>
              <p className="text-2xl font-bold text-on-surface">Preview Design</p>
            </div>
          </div>
          <div className="flex-1 glass-card rounded-xl p-6 relative overflow-hidden group preview-glow flex items-center justify-center">
            {/*  Preview Content  */}
            <div className="w-full h-full rounded-lg overflow-hidden relative flex items-center justify-center bg-slate-800/50">
              {loading ? (
                <div className="animate-pulse flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">hourglass_empty</span>
                  <span className="text-slate-400">Loading Designs...</span>
                </div>
              ) : selectedDesign ? (
                <img 
                  src={selectedDesign.url} 
                  alt={`Design ${selectedDesign.id}`} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2">visibility_off</span>
                  <span>No designs found for {captureMode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Design Selection */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto px-2">
          <h2 className="text-xl font-bold text-white mb-2">Choose a Design</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {designs.map((design) => (
              <div 
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedDesign?.id === design.id 
                    ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div className="aspect-[3/4] bg-slate-800/50 flex items-center justify-center p-2">
                  <img src={design.url} alt={`Design ${design.id}`} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-3 bg-slate-900/80 text-center text-sm font-medium">
                  Design {design.id}
                </div>
              </div>
            ))}
          </div>

          {designs.length === 0 && !loading && (
             <div className="p-6 bg-white/5 rounded-xl text-center text-slate-400">
               No designs available for this mode. Check the public/designs/{captureMode} directory.
             </div>
          )}

          <div className="mt-auto pt-6">
            <button 
              onClick={handleNext}
              disabled={!selectedDesign}
              className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all ${
                selectedDesign 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 active:scale-95' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ThemeSelection;
