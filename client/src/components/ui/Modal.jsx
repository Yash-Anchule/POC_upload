import { useEffect, useCallback } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    const handleEsc = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal-800/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
                onClick={onClose}
            />
            {/* Content */}
            <div
                className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]}
          animate-[slideUp_250ms_ease-out] max-h-[85vh] flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
                    <h2 className="text-lg font-semibold text-charcoal-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-sand-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
