"use client";

import React from "react";

type AIInputPopoverProps = {
  open: boolean;
  script: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export default function AIInputPopover({
  open,
  script,
  onChange,
  onConfirm,
  onClose,
  isLoading = false,
  error,
}: AIInputPopoverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={isLoading ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">AI Auto-fill</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-2 py-1 text-sm rounded hover:bg-black/5 disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-black/70 mb-3">
          Enter a script (book title or topic). The AI will fill in the form for
          you.
        </p>
        <input
          type="text"
          value={script}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. The Great Gatsby"
          className="w-full input mb-3"
          disabled={isLoading}
        />
        {error ? (
          <div className="text-sm text-red-600 mb-2">{error}</div>
        ) : null}
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !script.trim()}
            className="btn disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : null}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
