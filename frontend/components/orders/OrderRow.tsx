import React from 'react';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';
import { Avatar } from '../ui/Avatar';
import { Order } from '../../lib/types';

interface OrderRowProps {
    order: Order;
    selected: boolean;
    onSelect: (checked: boolean) => void;
    onDelete: () => void;
}

export const OrderRow = ({ order, selected, onSelect, onDelete }: OrderRowProps) => {
    return (
        <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${selected ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''}`}>
            <td className="px-6 py-3.5">
                <Checkbox
                    checked={selected}
                    onChange={(e) => onSelect(e.target.checked)}
                />
            </td>
            <td className="px-6 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                {order.order_number}
            </td>
            <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                    <Avatar src={`https://i.pravatar.cc/150?u=${order.id}`} alt={order.customer_name} />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{order.customer_name}</span>
                </div>
            </td>
            <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                {order.order_date}
            </td>
            <td className="px-6 py-3.5">
                <Badge status={order.status.toLowerCase() as any}>
                    {order.status}
                </Badge>
            </td>
            <td className="px-6 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                ${order.total_amount.toFixed(2)}
            </td>
            <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                {order.payment_status}
            </td>
            <td className="px-6 py-3.5">
                <div className="flex items-center gap-1 text-slate-400">
                    <button
                        className="p-1.5 hover:bg-slate-100 hover:text-slate-600 rounded dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        title="Edit order"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded dark:hover:bg-red-900/20 dark:hover:text-red-500 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        title="Delete order"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        className="p-1.5 hover:bg-slate-100 hover:text-slate-600 rounded dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        title="More actions"
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
