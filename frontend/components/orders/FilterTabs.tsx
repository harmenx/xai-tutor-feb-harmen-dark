"use client";

import React from 'react';

const tabs = ['All', 'Incomplete', 'Overdue', 'Ongoing', 'Finished'];

interface FilterTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const FilterTabs = ({ activeTab, onTabChange }: FilterTabsProps) => {
    return (
        <div className="flex border-b border-slate-200 px-6 pt-2 overflow-x-auto dark:border-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`relative px-1 py-4 text-sm font-medium transition-colors whitespace-nowrap mr-8 ${activeTab === tab
                            ? 'text-slate-900 border-b-2 border-slate-900'
                            : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
