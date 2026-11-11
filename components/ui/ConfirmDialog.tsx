"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";

export type ConfirmVariant = "danger" | "warning" | "info" | "primary";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "យល់ព្រម (Confirm)",
  cancelText = "បោះបង់ (Cancel)",
  variant = "danger",
  isLoading: externalLoading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("ConfirmDialog error:", err);
    } finally {
      setInternalLoading(false);
    }
  };

  const icons = {
    danger: "🗑️",
    warning: "⚠️",
    info: "ℹ️",
    primary: "✓",
  };

  const iconBg = {
    danger: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400  
    primary: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  }[variant];

  const confirmBtnStyles = {
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30",
    warning:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/30",
    info:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30",
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30",
  }[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      size="sm"
      showCloseButton={!isLoading}
      closeOnEsc={!isLoading}
      closeOnBackdropClick={!isLoading}
      ariaLabel={title}
    >
      <div className="flex flex-col items-center text-center pt-2">
        {/* Icon */}
        <div ​​
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm mb-4 ${iconBg}`}
        >
          {icons[variant]}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-black text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleConfirm}
          className={`cursor-pointer rounded-xl px-5 py-2 text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 ${confirmBtnStyles}`}
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>កំពុងដំណើរការ...</span>
            </>
          ) : (
            confirmText    
          )}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;                    
    