import React from 'react';

interface StatsCardsProps {
    stats: {
        total: number;
        pending: number;
        shipped: number;
        refunded: number;
    };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders This Month</p>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stats.total}</p>
            </div>

            <div className="rounded-lg bg-white p-6 border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Orders</p>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stats.pending}</p>
            </div>

            <div className="rounded-lg bg-white p-6 border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Shipped Orders</p>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stats.shipped}</p>
            </div>

            <div className="rounded-lg bg-white p-6 border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Refunded Orders</p>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stats.refunded}</p>
            </div>
        </div>
    );
};
