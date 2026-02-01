"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export const CreateOrderModal = ({ isOpen, onClose, onSubmit }: CreateOrderModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        total_amount: '',
        payment_status: 'unpaid',
        status: 'pending'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                customer: {
                    name: formData.customer_name,
                    email: formData.customer_email,
                    avatar: null
                },
                total_amount: parseFloat(formData.total_amount) || 0,
                status: formData.status,
                payment_status: formData.payment_status
            });
            onClose();
            setFormData({
                customer_name: '',
                customer_email: '',
                total_amount: '',
                payment_status: 'unpaid',
                status: 'pending'
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-950 dark:border dark:border-slate-800">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Create New Order</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            value={formData.customer_name}
                            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Customer Email</label>
                        <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            value={formData.customer_email}
                            onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Total Amount</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            value={formData.total_amount}
                            onChange={e => setFormData({ ...formData, total_amount: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Payment</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                value={formData.payment_status}
                                onChange={e => setFormData({ ...formData, payment_status: e.target.value })}
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
