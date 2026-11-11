"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  action?: ToastAction;
}

export interface ToastOptions {
  type?: ToastType;
  title: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  toast: {
    (options: ToastOptions): string;
    success: (title: React.ReactNode, description?: React.ReactNode) => string;
    error: (title: React.ReactNode, description?: React.ReactNode) => string;
    info: (title: React.ReactNode, description?: React.ReactNode) => string;
    warning: (title: React.ReactNode, description?: React.ReactNode) => string;
  };
  dismiss: (id: string) => void;
  dismissAll: () => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setMounted(true);
    return () => {
      // Clear all active timers on unmount
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id)!);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const duration = options.duration ?? 4000;
      const newToast: ToastItem = {
        id,
        type: options.type || "info",
        title: options.title,
        description: options.description,
        duration,
        action: options.action,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const toastMethods = Object.assign(
    (options: ToastOptions) => addToast(options),
    {
      success: (title: React.ReactNode, description?: React.ReactNode) =>
        addToast({ type: "success", title, description }),
      error: (title: React.ReactNode, description?: React.ReactNode) =>
        addToast({ type: "error", title, description }),
      info: (title: React.ReactNode, description?: React.ReactNode) =>
        addToast({ type: "info", title, description }),
      warning: (title: React.ReactNode, description?: React.ReactNode) =>
        addToast({ type: "warning", title, description }),
    }
  );

  return (
    <ToastContext.Provider
      value={{
        toast: toastMethods,
        dismiss,
        dismissAll,
        toasts,
      }}
    >
      {children}
      {mounted &&
        createPortal(
          <ToastContainer toasts={toasts} onDismiss={dismiss} />,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return context;
}

/**
 * Toast Container positioned at top-right on desktop and top-center/full on mobile.
 */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex flex-col gap-2.5 sm:max-w-sm w-auto sm:w-full pointer-events-none"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠️",
    info: "ℹ️",
  };

  const borderAndBg = {
    success:
      "border-emerald-500/30 bg-white/95 text-gray-900 dark:border-emerald-500/40 dark:bg-gray-900/95 shadow-emerald-500/10",
    error:
      "border-red-500/30 bg-white/95 text-gray-900 dark:border-red-500/40 dark:bg-gray-900/95 shadow-red-500/10",
    warning:
      "border-amber-500/30 bg-white/95 text-gray-900 dark:border-amber-500/40 dark:bg-gray-900/95 shadow-amber-500/10",
    info:
      "border-sky-500/30 bg-white/95 text-gray-900 dark:border-sky-500/40 dark:bg-gray-900/95 shadow-sky-500/10",
  }[item.type];

  const badgeColor = {
    success: "bg-emerald-500 text-white shadow-emerald-500/30",
    error: "bg-red-500 text-white shadow-red-500/30",
    warning: "bg-amber-500 text-white shadow-amber-500/30",
    info: "bg-sky-500 text-white shadow-sky-500/30",
  }[item.type];

  const actionColor = {
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-sky-600 dark:text-sky-400",
  }[item.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-down ${borderAndBg}`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ${badgeColor}`}
      >
        {icons[item.type]}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-xs font-bold leading-snug dark:text-white">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-normal">
            {item.description}
          </p>
        )}
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              onDismiss(item.id);
            }}
            className={`mt-2 text-xs font-bold hover:underline cursor-pointer ${actionColor}`}
          >
            {item.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs p-1 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default ToastProvider;
