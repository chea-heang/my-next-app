"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  useRef,
  useEffect,
} from "react";

export interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  syncWithUrl?: boolean;
  urlParamName?: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  syncWithUrl = false,
  urlParamName = "tab",
  children,
  className = "",
}: TabsProps) {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue);

  const activeValue = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // On mount, sync from URL if enabled
  useEffect(() => {
    if (!syncWithUrl || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlVal = params.get(urlParamName);
    if (urlVal) {
      if (controlledValue === undefined) {
        setUncontrolledValue(urlVal);
      }
      onValueChangeRef.current?.(urlVal);
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentVal = currentParams.get(urlParamName) || defaultValue;
      if (controlledValue === undefined) {
        setUncontrolledValue(currentVal);
      }
      onValueChangeRef.current?.(currentVal);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncWithUrl, urlParamName, defaultValue, controlledValue === undefined]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);

      if (syncWithUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set(urlParamName, newValue);
        window.history.replaceState(null, "", url.toString());
      }
    },
    [controlledValue, onValueChange, syncWithUrl, urlParamName]
  );

  return (
    <TabsContext.Provider
      value={{
        value: activeValue,
        setValue: handleValueChange,
        baseId,
      }}
    >
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function TabsList({
  children,
  className = "",
  ariaLabel = "Tabs",
  ...props
}: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation: ArrowRight / ArrowDown (next), ArrowLeft / ArrowUp (prev), Home, End
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;
    const triggers = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]:not([disabled])'
      )
    );
    if (triggers.length === 0) return;

    const currentIndex = triggers.indexOf(
      document.activeElement as HTMLButtonElement
    );
    if (currentIndex === -1) return;

    let targetIndex: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      targetIndex = (currentIndex + 1) % triggers.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = triggers.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      triggers[targetIndex].focus();
      triggers[targetIndex].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center gap-1.5 rounded-2xl bg-gray-100/90 p-1.5 dark:bg-gray-800/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = "",
  activeClassName = "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white font-black",
  inactiveClassName = "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold",
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within <Tabs>");
  }

  const isSelected = context.value === value;
  const triggerId = `${context.baseId}-tab-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => context.setValue(value)}
      className={`cursor-pointer rounded-xl px-4 py-2 text-xs transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
        isSelected ? activeClassName : inactiveClassName
      } ${className}`}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabsContent({
  value,
  children,
  className = "",
  forceMount = false,
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within <Tabs>");
  }

  const isSelected = context.value === value;
  const triggerId = `${context.baseId}-tab-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  if (!isSelected && !forceMount) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={triggerId}
      hidden={!isSelected}
      tabIndex={0}
      className={`mt-4 outline-none animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
