import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCenteredCarousel from '../hooks/useCenteredCarousel';
import InfoOverlay from '../components/InfoOverlay';
import { fetchTemplates } from '../utils/templates';

const ThemeSelection = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { mode = 'collage', requestId } = location.state || {};

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { containerRef, activeIndex, setItemRef } = useCenteredCarousel(designs.length, 'auto');

  useEffect(() => {
    const getDesigns = async () => {
      setLoading(true);
      const foundDesigns = [];
      try {
        const templates = await fetchTemplates();
        const layoutsForMode = templates[mode] || [];
        for (const layout of layoutsForMode) {
          foundDesigns.push({
            id: layout.id,
            name: layout.name,
            url: layout.url,
            imgIds: layout.imgIds || []
          });
        }
        setDesigns(foundDesigns);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        setLoading(false);
      }
    };

    getDesigns();
  }, [mode]);

  const handleSelect = (design) => {
    navigate('/photo-selection', { state: { mode, requestId, design } });
  };

  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-hidden">
      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <img onClick={() => navigate('/')} src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-white whitespace-nowrap">Choose a Design</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setInfoOpen(true)} className="relative flex items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
            <span className="absolute material-symbols-outlined animate-ping">info</span>
            <span className="absolute material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      <main className="relative h-full flex flex-col pt-16">

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-pulse">
            <span className="material-symbols-outlined text-4xl mb-2">hourglass_empty</span>
            <span>Loading Designs...</span>
          </div>
        ) : designs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md mx-auto p-6 bg-white/5 rounded-xl text-center text-slate-400">
              No designs available for this mode.
            </div>
          </div>
        ) : (
          /*  Vertical swipe carousel of Designs  */
          <div
            ref={containerRef}
            className="flex flex-col landscape:flex-row items-center gap-6 overflow-y-auto landscape:overflow-y-hidden landscape:overflow-x-auto snap-y landscape:snap-x snap-mandatory no-scrollbar flex-1 min-h-0 py-[20vh] landscape:py-0 landscape:px-[25%] relative z-10"
          >
            {designs.map((design, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={design.id}
                  ref={setItemRef(index)}
                  onClick={() => handleSelect(design)}
                  className={`relative overflow-hidden glass-card rounded-2xl flex flex-col shadow-lg snap-center shrink-0 w-[80%] max-w-2xl h-[60vh] landscape:w-[min(45vw,36rem)] landscape:h-[80%] landscape:max-w-none transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'
                  }`}
                >
                  <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-surface-container flex items-center justify-center p-2">
                    <img
                      src={design.url}
                      alt={`Design ${design.id}`}
                      className="max-w-full max-h-full object-contain opacity-90 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6 flex items-center justify-between shrink-0 relative z-10 bg-surface/50 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white">Design {design.id}</h3>
                    <span className="material-symbols-outlined text-primary transition-transform duration-300" data-icon="arrow_forward">arrow_forward</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default ThemeSelection;
