'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/spinner';

type TxStatus = 'pending' | 'success' | 'error';

interface Toast {
  id: string;
  status: TxStatus;
  message: string;
  txHash?: string;
  explorerUrl?: string;
}

let addToastGlobal: ((toast: Omit<Toast, 'id'>) => void) | null = null;

/** Call from anywhere to show a transaction toast */
export function txToast(status: TxStatus, message: string, txHash?: string) {
  const explorerUrl = txHash ? `https://testnet.monadexplorer.com/tx/${txHash}` : undefined;

  addToastGlobal?.({ status, message, txHash, explorerUrl });
}

const STATUS_CONFIG: Record<TxStatus, { icon: string; border: string; bg: string }> = {
  pending: {
    icon: '',
    border: 'border-warning/40',
    bg: 'bg-warning/5',
  },
  success: {
    icon: '\u2705',
    border: 'border-success/40',
    bg: 'bg-success/5',
  },
  error: {
    icon: '\u274C',
    border: 'border-danger/40',
    bg: 'bg-danger/5',
  },
};

const AUTO_DISMISS_MS: Record<TxStatus, number> = {
  pending: 0, // don't auto-dismiss pending
  success: 5000,
  error: 6000,
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const cfg = STATUS_CONFIG[toast.status];

  useEffect(() => {
    const ms = AUTO_DISMISS_MS[toast.status];

    if (ms > 0) {
      const timer = setTimeout(() => onRemove(toast.id), ms);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.status, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.border} ${cfg.bg} backdrop-blur-md shadow-lg animate-appearance-in max-w-sm w-full`}
    >
      {toast.status === 'pending' ? (
        <Spinner className="mt-0.5" color="warning" size="sm" />
      ) : (
        <span className="text-base mt-0.5">{cfg.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.explorerUrl && (
          <a
            className="text-xs text-success hover:underline mt-0.5 inline-block"
            href={toast.explorerUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Explorer
          </a>
        )}
      </div>
      <button
        className="text-default-400 hover:text-default-200 text-sm shrink-0 mt-0.5"
        onClick={() => onRemove(toast.id)}
      >
        &#x2715;
      </button>
    </div>
  );
}

export function TxToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = String(++idRef.current);

    setToasts((prev) => {
      // When success or error arrives, remove all pending toasts
      const filtered =
        toast.status === 'success' || toast.status === 'error'
          ? prev.filter((t) => t.status !== 'pending')
          : prev;

      return [...filtered.slice(-4), { ...toast, id }];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;

    return () => {
      addToastGlobal = null;
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
