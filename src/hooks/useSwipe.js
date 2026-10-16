import { useRef, useState } from 'react';

/**
 * Detects horizontal swipe gestures using Pointer Events, so it works with
 * both touch and mouse. While dragging, `dragX` holds the horizontal distance
 * from the start point so the UI can follow the finger.
 *
 * `wasDrag.current` stays true after a drag until the next pointer down, so a
 * click that ends a drag can be ignored.
 *
 * Usage:
 *   const { dragX, isDragging, handlers, wasDrag } = useSwipe({ onSwipeLeft, onSwipeRight });
 *   <div {...handlers} className="touch-pan-y"> ... </div>
 */
export default function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50, disabled = false } = {}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const start = useRef(null);
  const wasDrag = useRef(false);

  // Keep the latest callbacks without re-creating the handlers.
  const callbacks = useRef({});
  callbacks.current = { onSwipeLeft, onSwipeRight, disabled };

  const reset = () => {
    start.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  const onPointerDown = (e) => {
    wasDrag.current = false;
    if (callbacks.current.disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dragging: false };
  };

  const onPointerMove = (e) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    if (!s.dragging) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
      s.dragging = true;
      wasDrag.current = true;
      setIsDragging(true);
      // Keep receiving moves even if the pointer leaves the element.
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    setDragX(dx);
  };

  const onPointerUp = (e) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (s.dragging && !callbacks.current.disabled && Math.abs(dx) > threshold) {
      if (dx < 0) callbacks.current.onSwipeLeft?.();
      else callbacks.current.onSwipeRight?.();
    }
    reset();
  };

  const onPointerCancel = () => {
    if (start.current) reset();
  };

  return {
    dragX,
    isDragging,
    wasDrag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
