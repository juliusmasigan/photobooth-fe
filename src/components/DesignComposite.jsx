import React, { useEffect, useRef, useState } from 'react';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XHTML_NS = 'http://www.w3.org/1999/xhtml';
const SLOT_ATTRS = ['x', 'y', 'width', 'height', 'id', 'transform', 'clip-path', 'style'];

// Swaps a placeholder <image> for a looping, muted <video> that occupies the same box and clipping
const toLiveSlot = (doc, image, { image: poster, video }) => {
  const slot = doc.createElementNS(SVG_NS, 'foreignObject');
  SLOT_ATTRS.forEach((name) => {
    if (image.hasAttribute(name)) slot.setAttribute(name, image.getAttribute(name));
  });

  const videoEl = doc.createElementNS(XHTML_NS, 'video');
  videoEl.setAttribute('src', video);
  videoEl.setAttribute('poster', poster);
  ['autoplay', 'muted', 'loop', 'playsinline'].forEach((name) => videoEl.setAttribute(name, ''));
  videoEl.setAttribute('style', 'width:100%;height:100%;object-fit:cover;display:block');

  slot.appendChild(videoEl);
  image.replaceWith(slot);
};

// Fetches a design SVG, swaps the placeholder <image> elements named in imgIds for the given photos
// ({ image, video? }; a video makes the slot a live photo), and mounts it inline
// (external <image> URLs don't load inside an SVG shown through <img>).
const DesignComposite = ({ url, imgIds = [], photos = [], className }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const idsKey = JSON.stringify(imgIds);
  const photosKey = JSON.stringify(photos);

  useEffect(() => {
    let ignore = false;
    const ids = JSON.parse(idsKey);
    const slotPhotos = JSON.parse(photosKey);
    setStatus('loading');

    const load = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        if (ignore) return;

        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = doc.documentElement;
        if (svg.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) {
          throw new Error('Invalid SVG');
        }

        doc.querySelectorAll('script').forEach((el) => el.remove());
        [svg, ...svg.querySelectorAll('*')].forEach((el) => {
          for (const attr of Array.from(el.attributes)) {
            if (attr.name.toLowerCase().startsWith('on')) el.removeAttributeNode(attr);
          }
        });

        ids.forEach((id, i) => {
          const photo = slotPhotos[i];
          if (!photo?.image) return;
          const el = doc.getElementById(id);
          if (!el || el.nodeName.toLowerCase() !== 'image') {
            console.warn(`Design placeholder "${id}" not found in ${url}`);
            return;
          }
          if (photo.video) {
            toLiveSlot(doc, el, photo);
            return;
          }
          el.setAttribute('href', photo.image);
          el.setAttributeNS(XLINK_NS, 'xlink:href', photo.image);
          el.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        });

        if (!svg.getAttribute('viewBox')) {
          const w = parseFloat(svg.getAttribute('width'));
          const h = parseFloat(svg.getAttribute('height'));
          if (w && h) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        }
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        if (containerRef.current) {
          containerRef.current.replaceChildren(document.importNode(svg, true));
          // The muted attribute alone doesn't always permit autoplay for script-inserted videos
          containerRef.current.querySelectorAll('video').forEach((videoEl) => {
            videoEl.muted = true;
            videoEl.play()?.catch(() => {});
          });
          setStatus('ready');
        }
      } catch (error) {
        if (ignore) return;
        console.error('Error rendering design:', error);
        setStatus('error');
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [url, idsKey, photosKey]);

  return (
    <div className={`relative ${className || ''}`}>
      <div ref={containerRef} className="w-full h-full" />
      {status !== 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
          {status === 'loading' ? (
            <span className="material-symbols-outlined text-4xl animate-pulse">hourglass_empty</span>
          ) : (
            <span>Unable to load design.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignComposite;
