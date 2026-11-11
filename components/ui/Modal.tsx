"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = "",
  ariaLabel,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closeOnEscRef = useRef(closeOnEsc);
  closeOnEscRef.current = closeOnEsc;

  // Track mousedown target to prevent accidental close on drag text selection
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const titleId = useId();
  const descId = useId();

  // Handle SSR hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll locking and focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element inside modal (or modal container)
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 40);

    // Escape and Tab listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscRef.current && e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      // Trap Tab key
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (
            document.activeElement === lastElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-5xl",
  }[size];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      mouseDownTarget.current === e.currentTarget &&
      e.target === e.currentTarget &&
      closeOnBackdropClick
    ) {
      onClose();
    }
  };

  const modalNode = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      aria-label={ariaLabel}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClasses} rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-2xl outline-none dark:border-gray-800 dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-h-[92vh] overflow-y-auto animate-scale-up ${className}`}
      >
        {/* Optional Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Title & Description if provided as props */}
        {(title || description) && (
          <div className="mb-4 pr-8 space-y-1">
            {title && (
              <h3
                id={titleId}
                className="text-xl font-black text-gray-900 dark:text-white"
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                id={descId}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}

// Subcomponents for compound composition
export function ModalHeader({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mb-4 space-y-1 ${className}`}>{children}</div>;
}

export function ModalTitle({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={`text-xl font-black text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

export function ModalDescription({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

export function ModalBody({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`py-2 ${className}`}>{children}</div>;
}

export function ModalFooter({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mt-6 flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
