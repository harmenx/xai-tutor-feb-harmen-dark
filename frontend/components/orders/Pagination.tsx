"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}: PaginationProps) => {

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pages;
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-slate-500">
                Showing <span className="font-medium">{startItem}-{endItem}</span> of <span className="font-medium">{totalItems}</span> entries
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, i) => (
                        typeof p === 'number' ? (
                            <button
                                key={i}
                                onClick={() => onPageChange(p)}
                                className={`h-8 w-8 rounded text-sm font-medium transition-colors ${p === currentPage
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {p}
                            </button>
                        ) : (
                            <span key={i} className="px-2 text-slate-400">...</span>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
