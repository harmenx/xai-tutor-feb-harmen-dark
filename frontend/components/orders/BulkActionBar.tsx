"use client";

import React from 'react';
import { Copy, Printer, Trash2, X } from 'lucide-react';

interface BulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

export const BulkActionBar = ({ selectedCount, onClearSelection, onDelete, onDuplicate }: BulkActionBarProps) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                <span className="font-semibold">{selectedCount}</span> Selected
            </span>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            <button
                onClick={onDuplicate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded dark:text-slate-300 dark:hover:bg-slate-800"
            >
                <Copy size={14} />
                Duplicate
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded dark:text-slate-300 dark:hover:bg-slate-800">
                <Printer size={14} />
                Print
            </button>

            <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded dark:text-red-500 dark:hover:bg-red-900/10"
            >
                <Trash2 size={14} />
                Delete
            </button>

            <button
                onClick={onClearSelection}
                className="ml-1 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
                <X size={16} />
            </button>
        </div>
    );
};
