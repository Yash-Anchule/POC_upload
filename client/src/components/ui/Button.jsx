import { useMemo } from 'react';

const variants = {
    primary:
        'bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700 shadow-sm',
    secondary:
        'bg-sand-200 text-charcoal-800 hover:bg-sand-300 active:bg-sand-400',
    danger:
        'bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-600',
    ghost:
        'bg-transparent text-charcoal-700 hover:bg-sand-100 active:bg-sand-200',
    outline:
        'border-2 border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 active:bg-terracotta-100',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const classes = useMemo(
        () =>
            `inline-flex items-center justify-center font-semibold transition-all duration-200 
       focus-visible:ring-2 focus-visible:ring-terracotta-400 focus-visible:ring-offset-2
       disabled:opacity-50 disabled:cursor-not-allowed 
       ${variants[variant]} ${sizes[size]} ${className}`,
        [variant, size, className]
    );

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
