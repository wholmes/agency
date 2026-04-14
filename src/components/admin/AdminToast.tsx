"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AdminToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: AdminToastType;
  message: string;
};

const DISMISS_MS = 4500;

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useAdminToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return ctx;
}

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (type: AdminToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setItems((prev) => [...prev, { id, type, message }]);
      const tid = setTimeout(() => dismiss(id), DISMISS_MS);
      timers.current.set(id, tid);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
      info: (message: string) => push("info", message),
      dismiss,
    }),
    [push, dismiss],
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <AdminToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function AdminToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const labelId = useId();

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-[200] flex max-h-[min(50dvh,24rem)] w-full max-w-sm flex-col gap-2 overflow-y-auto p-4 md:p-6"
      aria-live="polite"
      aria-relevant="additions text"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Notifications
      </span>
      {items.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const border =
    item.type === "success"
      ? "border-success/35"
      : item.type === "error"
        ? "border-error/40"
        : "border-border";

  const dot =
    item.type === "success"
      ? "bg-success"
      : item.type === "error"
        ? "bg-error"
        : "bg-accent";

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-md border ${border} bg-surface px-4 py-3 shadow-md`}
    >
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm leading-snug text-text-primary">{item.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded px-1.5 py-0.5 text-xs text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-secondary"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
