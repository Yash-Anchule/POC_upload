export default function EmptyState({ title, message, icon, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="mb-4 text-sand-400 opacity-60">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-charcoal-700 mb-1">{title}</h3>
            <p className="text-sm text-charcoal-500 max-w-sm mb-6">{message}</p>
            {action && action}
        </div>
    );
}
