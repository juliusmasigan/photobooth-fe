import React, { useEffect, useState } from 'react';

// Contact details come from env so each deployment can set its own.
// REACT_APP_CONTACT_SOCIALS is comma-separated "network:handle" pairs,
// e.g. "instagram:@snapgo,facebook:snapgo".
const socials = (process.env.REACT_APP_CONTACT_SOCIALS || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [network, ...rest] = entry.split(':');
    const handle = rest.join(':').trim();
    return handle ? { label: network.trim(), value: handle } : { label: '', value: network.trim() };
  });

const contactRows = [
  { icon: 'call', label: 'Phone', value: process.env.REACT_APP_CONTACT_PHONE },
  { icon: 'mail', label: 'Email', value: process.env.REACT_APP_CONTACT_EMAIL },
  { icon: 'language', label: 'Website', value: process.env.REACT_APP_CONTACT_WEBSITE },
  ...socials.map((s) => ({ icon: 'alternate_email', label: s.label, value: s.value })),
].filter((row) => row.value && row.value.trim());

const FADE_MS = 200;

const InfoOverlay = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame so the opacity transition runs from 0.
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-6 transition-opacity ease-out"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md rounded-xl bg-surface-container/90 border border-white/10 shadow-2xl px-8 pt-12 pb-10 flex flex-col items-center gap-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 border border-white/20 text-white active:scale-95 transition-transform duration-200"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <img src="/SnapGo-dark.png" alt="SnapGo" className="w-56 h-auto" />
        {contactRows.length > 0 && (
          <ul className="w-full flex flex-col gap-4">
            {contactRows.map((row) => (
              <li key={`${row.icon}-${row.value}`} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">{row.icon}</span>
                </span>
                <div className="flex flex-col min-w-0">
                  {row.label && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">{row.label}</span>
                  )}
                  <span className="text-base font-semibold text-on-surface break-words">{row.value}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InfoOverlay;
