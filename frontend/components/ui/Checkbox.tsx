import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Checkbox = (props: CheckboxProps) => {
    return (
        <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-slate-50 accent-slate-900"
            {...props}
        />
    );
};
