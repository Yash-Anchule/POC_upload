export default function Input({
    label,
    error,
    icon,
    className = '',
    ...props
}) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-charcoal-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                        {icon}
                    </span>
                )}
                <input
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal-800 
            placeholder:text-charcoal-400
            transition-all duration-200
            focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 focus:outline-none
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-coral-400 ring-2 ring-coral-100' : 'border-sand-300 hover:border-sand-400'}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-coral-500 mt-1">{error}</p>}
        </div>
    );
}
