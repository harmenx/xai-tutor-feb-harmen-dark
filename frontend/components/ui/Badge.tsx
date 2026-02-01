import React from 'react';

export const Badge = ({ status, children }: { status: 'pending' | 'completed' | 'refunded' | 'in progress'; children: React.ReactNode }) => {
    const styles = {
        pending: 'bg-orange-50 text-orange-600',
        completed: 'bg-green-50 text-green-600',
        refunded: 'bg-red-50 text-red-600',
        'in progress': 'bg-blue-50 text-blue-600',
    };

    return (
        <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
            {children}
        </span>
    );
};
