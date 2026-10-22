import React, { useLayoutEffect, useRef, useState } from 'react';

// Space between neighbouring labels when spaced by measured size, in px
const VERTICAL_GAP = 56;
const HORIZONTAL_GAP = 40;

/**
 * Circular mode selector strip: the active mode sits in the center, underlined,
 * and the others fan out on either side, fading with distance.
 *
 * `modes` is a list of [id, label] pairs. `swipe` is the result of useSwipe;
 * when given, its handlers are attached and the strip follows the drag.
 * With `vertical` the strip runs top to bottom instead of left to right, and
 * the labels are stacked upright like a banner. `large` uses bigger labels
 * on the horizontal strip (vertical labels are always large).
 */
const ModeStrip = ({ modes, activeIndex, onSelect, vertical = false, large = false, swipe, disabled = false, className = '' }) => {
  const count = modes.length;
  const dragX = swipe?.dragX || 0;
  const mask = `linear-gradient(to ${vertical ? 'bottom' : 'right'}, transparent, black 20%, black 80%, transparent)`;

  // Large labels differ a lot in length, so space them by their measured
  // size along the strip with a fixed gap instead of a fixed step.
  const measured = vertical || large;
  const labelRefs = useRef([]);
  const [sizes, setSizes] = useState([]);
  useLayoutEffect(() => {
    if (!measured) return;
    let active = true;
    const measure = () => {
      if (active) setSizes(labelRefs.current.slice(0, count).map(el => (vertical ? el?.offsetHeight : el?.offsetWidth) || 0));
    };
    measure();
    // Re-measure once the web font has loaded and changed the label sizes
    document.fonts?.ready.then(measure);
    return () => { active = false; };
  }, [measured, vertical, modes, count]);

  const measuredPosition = (offset) => {
    const size = (k) => sizes[(((activeIndex + k) % count) + count) % count] || 0;
    const gap = vertical ? VERTICAL_GAP : HORIZONTAL_GAP;
    const dir = Math.sign(offset);
    let pos = 0;
    for (let k = 0; k !== offset; k += dir) {
      pos += dir * (size(k) / 2 + gap + size(k + dir) / 2);
    }
    return pos;
  };

  return (
    <div
      {...(swipe?.handlers || {})}
      className={`relative w-full overflow-hidden flex justify-center items-center select-none ${vertical ? 'h-full' : 'h-12 touch-pan-y'} ${className}`}
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <div className={`relative w-full h-full flex justify-center items-center ${vertical ? '' : 'max-w-md'}`}>
        {modes.map(([id, label], i) => {
          // Calculate shortest distance in a circular array
          let offset = (i - activeIndex) % count;
          if (offset < -Math.floor(count / 2)) offset += count;
          if (offset > Math.floor(count / 2)) offset -= count;

          const isCenter = offset === 0;
          const distance = Math.abs(offset);
          const translate = vertical
            ? `translateY(${measuredPosition(offset)}px)`
            : `translateX(${(large ? measuredPosition(offset) : offset * 120) + dragX}px)`;

          return (
            <span
              key={id}
              ref={(el) => { labelRefs.current[i] = el; }}
              onClick={() => { if (!swipe?.wasDrag.current && !disabled) onSelect(i); }}
              className={`absolute font-bold uppercase whitespace-nowrap ${swipe?.isDragging ? '' : 'transition-all duration-300 ease-out'}
                ${vertical
                  // Banner style: letters stacked top to bottom, each upright, underline on the right
                  ? `[writing-mode:vertical-rl] [text-orientation:upright] text-lg tracking-tighter [word-spacing:-0.25em] pr-1 ${isCenter ? 'text-white border-r-2 border-primary' : 'text-white/40'}`
                  : `${large ? 'text-lg' : 'text-xs'} tracking-widest pb-1 ${isCenter ? 'text-white border-b-2 border-primary' : 'text-white/40'}`}`}
              style={{
                transform: `${translate} scale(${isCenter ? 1 : 0.85})`,
                opacity: distance === 0 ? 1 : distance === 1 ? 0.6 : 0.2,
                zIndex: 10 - distance
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ModeStrip;
