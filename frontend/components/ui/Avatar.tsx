import React from 'react';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    className?: string;
}

export const Avatar = ({ src, alt, fallback, className = '' }: AvatarProps) => {
    return (
        <div className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}>
            {src ? (
                <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {fallback || alt?.charAt(0) || '?'}
                </div>
            )}
        </div>
    );
};
