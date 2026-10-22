import React, { useLayoutEffect, useRef, useState } from 'react';

const KINDS = [
  { kind: 'sticker', label: 'Sticker', icon: 'face_retouching_natural' },
  { kind: 'effect', label: 'Effect', icon: 'auto_awesome' },
  { kind: 'color', label: 'Color', icon: 'palette' }
];

const KIND_STEP = 45;      // degrees between kind buttons
const CHIP_WIDTH = 72;     // chip width estimate in px, until chips are measured
const CHIP_GAP = 10;       // px between chips along the arc
const MAX_ANGLE = 75;      // chips past this angle from the top are hidden
const CLOSE_ANGLE = -100;  // close button, just left of and below the dial
const DRAG_THRESHOLD = 6;
const DEG = 180 / Math.PI;

/**
 * Live filter picker laid out on a circle around the shutter button, which is
 * passed as `children`. One round button per filter kind (sticker, effect,
 * color) sits on the arc above the shutter; tapping a kind swaps them for a
 * dial of its filters that rotates continuously along the circle when dragged,
 * repeating the filters as needed to fill it. Tapping a filter activates it,
 * and tapping the active one (or "None") turns filters off.
 *
 * `filters` is the list from GET /api/filters ([{ id, name, kind }]) and `active`
 * the id of the filter currently on. Only one filter is active across all kinds.
 * `openKind` / `onOpenKindChange` control which dial is open (null for none).
 * `radius` is the arc radius in px; `arcHidden` fades the arc out, leaving the shutter.
 */
const FilterPicker = ({
  filters,
  active,
  onSelect,
  openKind,
  onOpenKindChange,
  disabled = false,
  arcHidden = false,
  radius = 120,
  className = '',
  children
}) => {
  const kinds = KINDS.filter(({ kind }) => filters.some(f => f.kind === kind));
  const activeKind = filters.find(f => f.id === active)?.kind;
  const trayItems = [{ id: 'none', name: 'None' }, ...filters.filter(f => f.kind === openKind)];
  const isTrayOpen = Boolean(openKind) && trayItems.length > 1;

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [chipWidths, setChipWidths] = useState([]);
  const shutterRef = useRef(null);
  const chipRefs = useRef([]);
  const drag = useRef(null);
  const wasDrag = useRef(false);

  // Lay chips edge to edge along the arc: angular center of each chip in one set,
  // and the angle the whole set spans. Sets repeat until they fill the circle, so
  // the wrap-around point is always hidden behind the shutter.
  const spans = trayItems.map((_, i) => ((chipWidths[i] ?? CHIP_WIDTH) + CHIP_GAP) / radius * DEG);
  const centers = spans.map((a, i) => spans.slice(0, i).reduce((sum, b) => sum + b, 0) + a / 2 - spans[0] / 2);
  const setSpan = spans.reduce((sum, a) => sum + a, 0);
  const copies = Math.max(1, Math.ceil(360 / setSpan));
  const period = setSpan * copies;
  const wrap = (angle) => ((((angle + period / 2) % period) + period) % period) - period / 2;

  // Measure the chips and bring the active filter (or "None") to the top whenever a dial opens
  const trayKey = trayItems.map(f => f.name).join('\n');
  useLayoutEffect(() => {
    if (!isTrayOpen) return;
    const widths = trayItems.map((_, i) => chipRefs.current[i]?.offsetWidth ?? CHIP_WIDTH);
    const measured = widths.map(w => (w + CHIP_GAP) / radius * DEG);
    const activeIndex = Math.max(0, trayItems.findIndex(f => f.id === active));
    setChipWidths(widths);
    setRotation(measured.slice(0, activeIndex).reduce((sum, a) => sum + a, 0) + measured[activeIndex] / 2 - measured[0] / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKind, trayKey, radius]);

  if (!kinds.length) return children;

  const choose = (id) => {
    if (disabled) return;
    onSelect(id === active ? 'none' : id);
  };

  const onPointerDown = (e) => {
    wasDrag.current = false;
    if (!isTrayOpen || disabled || shutterRef.current?.contains(e.target)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, id: e.pointerId, rotation, dragging: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.dragging = true;
      wasDrag.current = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    // Chips follow the finger along the arc
    setRotation(d.rotation - (dx / radius) * DEG);
  };

  // Angle of each chip from the top, for every repeated set
  const chipAngles = () =>
    Array.from({ length: copies }, (_, copy) => centers.map(c => wrap(c + copy * setSpan - rotation))).flat();

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.dragging) {
      setIsDragging(false);
      // Snap the chip nearest the top into place
      const nearest = chipAngles().reduce((best, a) => (Math.abs(a) < Math.abs(best) ? a : best), Infinity);
      setRotation(r => r + nearest);
    }
  };

  // Position an item on the circle; 0° is straight above the shutter, positive is clockwise
  const place = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      transform: `translate(-50%, -50%) translate(${radius * Math.sin(rad)}px, ${-radius * Math.cos(rad)}px)`
    };
  };

  const itemClass = `absolute left-1/2 top-1/2 ${isDragging ? '' : 'transition-[transform,opacity] duration-300'}`;

  const chipClass = (isActive) =>
    `whitespace-nowrap px-3 py-2 rounded-full text-xs font-bold tracking-widest uppercase border backdrop-blur-md transition-colors duration-200 ${
      isActive ? 'bg-primary text-white border-primary' : 'bg-black/50 text-white/80 border-white/20'
    }`;

  return (
    <div
      className={`relative flex justify-center select-none ${isTrayOpen ? 'touch-none' : ''} ${className}`}
      style={{ paddingTop: radius - 8 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="relative">
        <div ref={shutterRef}>{children}</div>

        <div className={`transition-opacity duration-300 ${arcHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {isTrayOpen ? (
            <>
              {Array.from({ length: copies }, (_, copy) => trayItems.map((f, i) => {
                const angle = wrap(centers[i] + copy * setSpan - rotation);
                const visible = Math.abs(angle) <= MAX_ANGLE;
                const isActive = f.id === 'none' ? activeKind !== openKind : f.id === active;
                return (
                  <button
                    key={`${copy}-${f.id}`}
                    ref={copy === 0 ? (el) => { chipRefs.current[i] = el; } : undefined}
                    onClick={() => {
                      if (wasDrag.current) return;
                      setRotation(r => r + angle);
                      choose(f.id);
                    }}
                    disabled={disabled}
                    className={`${itemClass} ${chipClass(isActive)} ${visible ? '' : 'pointer-events-none'} disabled:opacity-40`}
                    style={{ ...place(angle), opacity: visible ? 1 - (angle / MAX_ANGLE) ** 2 * 0.6 : 0 }}
                  >
                    {f.name}
                  </button>
                );
              }))}
              <button
                aria-label="Close filters"
                onClick={() => onOpenKindChange(null)}
                className={`${itemClass} flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white`}
                style={place(CLOSE_ANGLE)}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </>
          ) : (
            kinds.map(({ kind, label, icon }, i) => {
              const isOn = activeKind === kind;
              return (
                <button
                  key={kind}
                  onClick={() => onOpenKindChange(kind)}
                  disabled={disabled}
                  className={`${itemClass} flex flex-col items-center gap-1 disabled:opacity-40`}
                  style={place((i - (kinds.length - 1) / 2) * KIND_STEP)}
                >
                  <span className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border backdrop-blur-md ${isOn ? 'border-primary' : 'border-white/20'}`}>
                    <span className={`material-symbols-outlined ${isOn ? 'text-primary' : 'text-white'}`}>{icon}</span>
                    {isOn && <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border border-black/50" />}
                  </span>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isOn ? 'text-white' : 'text-white/60'}`}>{label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPicker;
