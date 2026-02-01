"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import Link from 'next/link';

interface HeaderProps {
    onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">Orders</h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden w-[300px] lg:block">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search anything"
                        className="h-10 w-full rounded-lg bg-slate-100 pl-10 pr-12 text-sm outline-none ring-offset-white focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-slate-900 dark:ring-offset-black dark:focus:ring-slate-50"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                        ⌘K
                    </kbd>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* User Avatars */}
                    <div className="flex -space-x-2">
                        <Avatar src="https://i.pravatar.cc/150?u=1" className="ring-2 ring-white dark:ring-slate-950" />
                        <Avatar src="https://i.pravatar.cc/150?u=2" className="ring-2 ring-white dark:ring-slate-950" />
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-2 ring-white dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-950">
                            +2
                        </div>
                    </div>

                    {/* Notifications */}
                    <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <Bell size={20} />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            24
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex cursor-pointer items-center gap-2 outline-none"
                        >
                            <Avatar src="https://i.pravatar.cc/150?u=me" />
                            <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-800 dark:bg-slate-950">
                                <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-800">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">User Profile</p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">user@example.com</p>
                                </div>
                                <div className="py-1">
                                    <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    <Link href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
