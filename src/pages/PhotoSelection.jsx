import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCenteredCarousel from '../hooks/useCenteredCarousel';
import InfoOverlay from '../components/InfoOverlay';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const collageLayoutCount = process.env.REACT_APP_COLLAGE_LAYOUT_COUNT ? parseInt(process.env.REACT_APP_COLLAGE_LAYOUT_COUNT) : 4; // Default to 4 photos in collage if not specified

const PhotoSelection = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, requestId, design } = location.state || {};
  const [photoSelections, setPhotoSelections] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [numPhotosToSelect] = useState(mode === 'still' ? 1 : collageLayoutCount); // Default to 1 for still, layout count for collage
  const { containerRef, activeIndex, setItemRef } = useCenteredCarousel(photoSelections.length);

  useEffect(() => {
    const result = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/photos?prefix=${requestId}`);
        const data = await response.json();
        setPhotoSelections(data.photos || []);
      } catch (err) {
        console.error('Error fetching photo results:', err);
      }
    };

    if (requestId) {
      result();
    }
  }, [mode, requestId]);

  const toggleSelection = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
    } else {
      if (selectedPhotos.length < numPhotosToSelect) {
        setSelectedPhotos([...selectedPhotos, photo]);
      }
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-background text-on-surface overflow-hidden">

      {/*  TopAppBar  */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <img src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-white whitespace-nowrap">
          <span className="text-white">Select your</span>
          <span className="text-primary-dim">&nbsp;favorites</span>
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setInfoOpen(true)} className="flex items-center justify-center w-11 h-11 text-slate-400 transition-transform rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined" data-icon="info">info</span>
          </button>
          <button className="flex items-center justify-center w-11 h-11 text-slate-400 transition-transform rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </button>
        </div>
      </header>
      {/*  Main Content  */}
      <main className="h-[100dvh] pt-20 pb-28 px-6 max-w-4xl mx-auto w-full flex flex-col">
        <div className="mb-4 flex justify-between items-end shrink-0">
          <div className="space-y-2">
            <p className="text-on-surface-variant font-medium">Choose the best shot{numPhotosToSelect === 1 ? '' : 's'}.</p>
          </div>
          <div className="text-right pb-1">
            <div className="text-2xl font-bold text-white leading-none">
              {selectedPhotos.length} <span className="text-slate-500 text-lg font-medium">/ {numPhotosToSelect}</span>
            </div>
            <div className="text-xs text-primary-dim font-semibold tracking-wider uppercase mt-1">
              {Math.max(0, numPhotosToSelect - selectedPhotos.length)} remaining
            </div>
          </div>
        </div>
        {/*  Photo swipe carousel (vertical)  */}
        <div
          ref={containerRef}
          className="flex flex-col items-center gap-6 overflow-y-auto snap-y snap-mandatory no-scrollbar flex-1 min-h-0 py-[15vh]"
        >
          {photoSelections.map((photo, index) => {
            const isSelected = selectedPhotos.includes(photo);
            const isActive = index === activeIndex;
            return (
              <div
                key={photo.id}
                ref={setItemRef(index)}
                onClick={() => toggleSelection(photo)}
                className={`relative rounded-xl overflow-hidden glass-card snap-center shrink-0 w-[80%] max-w-2xl h-[60vh] transition-all duration-500 ${isSelected ? 'selected-ring' : ''} ${isActive ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'}`}
              >
                <img
                  className="w-full h-full object-cover transition-all duration-500"
                  alt={`Photo ${index + 1}`}
                  src={`${apiBaseUrl}${photo.path}`}
                />
                <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-primary/20' : 'bg-black/10'}`}></div>
                <div className={`absolute top-3 right-3 rounded-full w-9 h-9 flex items-center justify-center ${isSelected ? 'bg-primary-container text-on-primary-container shadow-lg' : 'bg-white/20 backdrop-blur-md border border-white/20'}`}>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[20px]" data-icon="check" style={{ "fontVariationSettings": "\"FILL\" 1" }}>check</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] text-white" data-icon="add">add</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      {/*  Frosted Glass Footer  */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/40 backdrop-blur-xl dark:bg-slate-950/40 border-t border-white/10 px-6 py-6 h-24 flex items-center justify-center gap-4">
        <div className="w-full max-w-4xl flex items-center justify-end gap-6">
          <button
            onClick={() => navigate("/theme-selection", { state: { mode, selectedPhotos } })}
            disabled={selectedPhotos.length !== numPhotosToSelect}
            className={`flex-1 max-w-[240px] h-14 rounded-xl font-bold tracking-wide uppercase text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              selectedPhotos.length === numPhotosToSelect
                ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/30 active:scale-95'
                : 'bg-surface-variant text-on-surface-variant opacity-50'
            }`}
          >
            NEXT
            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
      </footer>
      {/*  BottomNavBar (Hidden for focused selection task, as per UX goals)  */}
      {/*  Suppression logic: Page is transactional (Selection screen)  */}

      <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default PhotoSelection;
