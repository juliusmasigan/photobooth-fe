import { useCallback, useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 6;

const readOffset = (storageKey) => {
  try {
    const saved = storageKey && JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved;
  } catch {
    // Storage unavailable or corrupt — fall back to the default position
  }
  return { x: 0, y: 0 };
};

const writeOffset = (storageKey, offset) => {
  try {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(offset));
  } catch {
    // Storage unavailable — position just won't be remembered
  }
};

/**
 * Makes a fixed-position element draggable with Pointer Events (touch and mouse).
 * `offset` is a translation from the element's CSS position, kept inside the
 * viewport and remembered in localStorage under `storageKey`.
 *
 * `wasDrag.current` stays true after a drag until the next pointer down, so a
 * click that ends a drag can be ignored.
 *
 * Usage:
 *   const { offset, isDragging, wasDrag, ref, handlers } = useDraggable({ storageKey: 'my.key' });
 *   <button ref={ref} {...handlers} className="touch-none"
 *     style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} />
 */
export default function useDraggable({ storageKey, margin = 8 } = {}) {
  const [offset, setOffset] = useState(() => readOffset(storageKey));
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(offset);
  const elRef = useRef(null);
  const start = useRef(null);
  const wasDrag = useRef(false);

  const updateOffset = useCallback((next) => {
    offsetRef.current = next;
    setOffset(next);
  }, []);

  // Nudge the element back inside the viewport (after resize, or a position saved on a bigger screen)
  const clampToViewport = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let { x, y } = offsetRef.current;
    if (rect.left < margin) x += margin - rect.left;
    else if (rect.right > window.innerWidth - margin) x -= rect.right - (window.innerWidth - margin);
    if (rect.top < margin) y += margin - rect.top;
    else if (rect.bottom > window.innerHeight - margin) y -= rect.bottom - (window.innerHeight - margin);
    if (x !== offsetRef.current.x || y !== offsetRef.current.y) updateOffset({ x, y });
  }, [margin, updateOffset]);

  const ref = useCallback((node) => {
    elRef.current = node;
    if (node) clampToViewport();
  }, [clampToViewport]);

  useEffect(() => {
    window.addEventListener('resize', clampToViewport);
    return () => window.removeEventListener('resize', clampToViewport);
  }, [clampToViewport]);

  const onPointerDown = (e) => {
    wasDrag.current = false;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      id: e.pointerId,
      offset: offsetRef.current,
      rect: e.currentTarget.getBoundingClientRect(),
      dragging: false
    };
  };

  const onPointerMove = (e) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    if (!s.dragging) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      s.dragging = true;
      wasDrag.current = true;
      setIsDragging(true);
      // Keep receiving moves even if the pointer leaves the element.
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    const minX = s.offset.x - s.rect.left + margin;
    const maxX = s.offset.x + (window.innerWidth - s.rect.right) - margin;
    const minY = s.offset.y - s.rect.top + margin;
    const maxY = s.offset.y + (window.innerHeight - s.rect.bottom) - margin;
    updateOffset({
      x: Math.min(Math.max(s.offset.x + dx, minX), maxX),
      y: Math.min(Math.max(s.offset.y + dy, minY), maxY)
    });
  };

  const endDrag = (e) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    start.current = null;
    if (s.dragging) {
      setIsDragging(false);
      writeOffset(storageKey, offsetRef.current);
    }
  };

  return {
    offset,
    isDragging,
    wasDrag,
    ref,
    handlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  };
}
