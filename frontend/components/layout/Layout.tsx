"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-black dark:text-slate-50">
            <Sidebar isCollapsed={isSidebarCollapsed} />
            <div className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
