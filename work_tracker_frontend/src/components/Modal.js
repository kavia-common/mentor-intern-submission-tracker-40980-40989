import React, { useEffect, useMemo, useRef } from "react";
import Button from "./Button";

/**
 * Finds focusable elements within a container.
 * This is intentionally small for UI-only focus trapping.
 */
function getFocusable(container) {
  if (!container) return [];
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(container.querySelectorAll(selectors.join(",")));
}

// PUBLIC_INTERFACE
function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}) {
  /** Accessible modal with overlay, Esc-to-close, and basic focus trapping. */
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  const labelId = useMemo(() => `modal-title-${Math.random().toString(36).slice(2)}`, []);
  const descId = useMemo(() => `modal-desc-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;

    // Focus first focusable element in modal, else focus panel.
    const focusables = getFocusable(panelRef.current);
    const toFocus = focusables[0] || panelRef.current;
    if (toFocus && toFocus.focus) toFocus.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      // Focus trap for Tab/Shift+Tab.
      if (e.key === "Tab") {
        const items = getFocusable(panelRef.current);
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      aria-describedby={description ? descId : undefined}
    >
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={labelId} className="text-lg font-extrabold text-slate-900">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>

        <div className="mt-4">{children}</div>

        <div className="mt-6 flex items-center justify-end gap-2">
          {footer || (
            <Button variant="secondary" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
