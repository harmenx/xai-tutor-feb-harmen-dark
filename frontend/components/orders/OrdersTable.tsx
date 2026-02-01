"use client";

import React from 'react';
import { OrderRow } from './OrderRow';
import { FilterTabs } from './FilterTabs';
import { Pagination } from './Pagination';
import { BulkActionBar } from './BulkActionBar';
import { Checkbox } from '../ui/Checkbox';
import { Order } from '../../lib/types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface OrdersTableProps {
    orders: Order[];
    selectedIds: Set<number>;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onDeleteOne: (id: number) => void;
    onBulkDelete: () => void;
    onBulkDuplicate: () => void;
    onClearSelection: () => void;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    sortBy?: string;
    sortOrder?: string;
    onSort?: (field: string) => void;
}

export const OrdersTable = ({
    orders,
    selectedIds,
    activeTab,
    onTabChange,
    onSelectAll,
    onSelectOne,
    onDeleteOne,
    onBulkDelete,
    onBulkDuplicate,
    onClearSelection,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    sortBy = 'id',
    sortOrder = 'desc',
    onSort
}: OrdersTableProps) => {

    const allSelected = orders.length > 0 && selectedIds.size === orders.length;

    const SortableHeader = ({ field, label }: { field: string; label: string }) => {
        const isActive = sortBy === field;
        const isAsc = isActive && sortOrder === 'asc';
        const isDesc = isActive && sortOrder === 'desc';

        return (
            <th className="px-6 py-3">
                <button
                    onClick={() => onSort?.(field)}
                    className="flex items-center gap-1.5 text-xs font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                    <span>{label}</span>
                    {isActive ? (
                        isAsc ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                    )}
                </button>
            </th>
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <FilterTabs activeTab={activeTab} onTabChange={onTabChange} />

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            <th className="px-6 py-3 w-10">
                                <Checkbox
                                    checked={allSelected}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                />
                            </th>
                            <SortableHeader field="order_number" label="Order Number" />
                            <SortableHeader field="customer_name" label="Customer Name" />
                            <SortableHeader field="order_date" label="Order Date" />
                            <th className="px-6 py-3 text-xs font-medium">Status</th>
                            <SortableHeader field="total_amount" label="Total Amount" />
                            <SortableHeader field="payment_status" label="Payment Status" />
                            <th className="px-6 py-3 text-xs font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                        {orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                selected={selectedIds.has(order.id)}
                                onSelect={(checked) => onSelectOne(order.id, checked)}
                                onDelete={() => onDeleteOne(order.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <BulkActionBar
                selectedCount={selectedIds.size}
                onClearSelection={onClearSelection}
                onDelete={onBulkDelete}
                onDuplicate={onBulkDuplicate}
            />

            <div className="border-t border-slate-200 dark:border-slate-800">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};
