"use client";

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
    BarChart3,
    Globe,
    CreditCard,
    Settings,
    HelpCircle,
    ChevronDown,
    Moon,
    Sun
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface SidebarProps {
    isCollapsed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isProductsExpanded, setIsProductsExpanded] = useState(false);
    const [isOrdersExpanded, setIsOrdersExpanded] = useState(true);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

    useEffect(() => {
        // Only enable dark mode if explicitly set in localStorage
        if (localStorage.theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            // Default to light mode
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white py-6 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${isCollapsed ? 'w-20 px-3' : 'w-64 px-4'
                }`}
        >
            {/* Logo */}
            <div className={`mb-8 flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-lg bg-orange-500 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                    </svg>
                </div>
                {!isCollapsed && <span className="text-xl font-bold text-slate-900 dark:text-slate-50">Prodex</span>}
            </div>

            {/* Workspace Switcher */}
            <div className="relative mb-6">
                <button
                    onClick={() => !isCollapsed && setIsWorkspaceOpen(!isWorkspaceOpen)}
                    className={`flex w-full items-center rounded-lg bg-slate-100 p-3 transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-[10px] text-white dark:bg-slate-50 dark:text-slate-900">
                            U
                        </div>
                        {!isCollapsed && <span className="text-sm font-medium text-slate-900 dark:text-slate-50">Uxerflow</span>}
                    </div>
                    {!isCollapsed && <ChevronDown size={16} className={`text-slate-500 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isWorkspaceOpen && !isCollapsed && (
                    <div className="absolute left-0 top-full mt-2 w-full z-50 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <div className="py-1">
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[10px] text-white">T</div>
                                Team Flow
                            </button>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-600 text-[10px] text-white">P</div>
                                Personal
                            </button>
                            <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                <PlusIcon size={14} className="text-slate-500" />
                                Create Workspace
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="mb-6">
                    {!isCollapsed && <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Main</div>}
                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isCollapsed={isCollapsed} />

                        {/* Products - Expandable */}
                        <div className="space-y-1">
                            <button
                                onClick={() => !isCollapsed && setIsProductsExpanded(!isProductsExpanded)}
                                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Package size={20} />
                                    {!isCollapsed && <span>Products</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={16} className={`transition-transform ${isProductsExpanded ? 'rotate-180' : ''}`} />}
                            </button>
                            {isProductsExpanded && !isCollapsed && (
                                <div className="ml-4 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        All Products
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Categories
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Inventory
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Orders - Expandable & Active */}
                        <div className="space-y-1">
                            <button
                                onClick={() => !isCollapsed && setIsOrdersExpanded(!isOrdersExpanded)}
                                className={`flex w-full items-center rounded-lg transition-colors ${!isCollapsed ? 'bg-slate-50 justify-between' : 'justify-center'} px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-50`}
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={20} />
                                    {!isCollapsed && <span>Orders</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={16} className={`transition-transform ${isOrdersExpanded ? 'rotate-180' : ''}`} />}
                            </button>
                            {isOrdersExpanded && !isCollapsed && (
                                <div className="ml-4 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                                    <Link href="#" className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800">
                                        All Orders
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Returns
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Order Tracking
                                    </Link>
                                </div>
                            )}
                        </div>

                        <NavItem icon={<TrendingUp size={20} />} label="Sales" isCollapsed={isCollapsed} />
                        <NavItem icon={<Users size={20} />} label="Customers" isCollapsed={isCollapsed} />
                        <NavItem icon={<BarChart3 size={20} />} label="Reports" isCollapsed={isCollapsed} />
                    </nav>
                </div>

                <div>
                    {!isCollapsed && <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Settings</div>}
                    <nav className="space-y-1">
                        <NavItem icon={<Globe size={20} />} label="Marketplace Sync" isCollapsed={isCollapsed} />
                        <NavItem icon={<CreditCard size={20} />} label="Payment Gateways" isCollapsed={isCollapsed} />

                        {/* Settings - Expandable */}
                        <div className="space-y-1">
                            <button
                                onClick={() => !isCollapsed && setIsSettingsExpanded(!isSettingsExpanded)}
                                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Settings size={20} />
                                    {!isCollapsed && <span>Settings</span>}
                                </div>
                                {!isCollapsed && <ChevronDown size={16} className={`transition-transform ${isSettingsExpanded ? 'rotate-180' : ''}`} />}
                            </button>
                            {isSettingsExpanded && !isCollapsed && (
                                <div className="ml-4 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        General
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Security
                                    </Link>
                                    <Link href="#" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                                        Notifications
                                    </Link>
                                </div>
                            )}
                        </div>

                        <NavItem icon={<HelpCircle size={20} />} label="Help Center" isCollapsed={isCollapsed} />
                    </nav>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 space-y-4">
                <button
                    onClick={toggleDarkMode}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 ${isCollapsed ? 'justify-center' : ''}`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    {!isCollapsed && (
                        <>
                            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            <div className={`ml-auto h-5 w-9 rounded-full px-0.5 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? 'translate-x-4' : ''}`}></div>
                            </div>
                        </>
                    )}
                </button>

                {!isCollapsed && (
                    <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                                Upgrade to <span className="text-indigo-600">Premium</span>
                            </p>
                        </div>
                        <p className="mb-3 text-[11px] text-slate-500">
                            Your Premium Account will expire in <span className="font-bold text-slate-700 dark:text-slate-300">18 days</span>
                        </p>
                        <Button variant="primary" size="sm" className="w-full bg-slate-900 text-xs text-white hover:bg-slate-800">
                            Upgrade Now
                        </Button>
                    </div>
                )}
            </div>
        </aside>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
}

const NavItem = ({ icon, label, isCollapsed }: NavItemProps) => (
    <Link href="#" className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
            {icon}
            {!isCollapsed && <span>{label}</span>}
        </div>
    </Link>
);

const PlusIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
