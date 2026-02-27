import { useMemo, useCallback } from 'react';

export default function Pagination({ page, pages, onPageChange }) {
    const pageNumbers = useMemo(() => {
        const nums = [];
        const delta = 2;
        const start = Math.max(2, page - delta);
        const end = Math.min(pages - 1, page + delta);

        nums.push(1);
        if (start > 2) nums.push('...');
        for (let i = start; i <= end; i++) nums.push(i);
        if (end < pages - 1) nums.push('...');
        if (pages > 1) nums.push(pages);

        return nums;
    }, [page, pages]);

    const goTo = useCallback(
        (p) => {
            if (p >= 1 && p <= pages && p !== page) onPageChange(p);
        },
        [page, pages, onPageChange]
    );

    if (pages <= 1) return null;

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-6">
            <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                ← Prev
            </button>

            {pageNumbers.map((num, i) =>
                num === '...' ? (
                    <span key={`dot-${i}`} className="px-2 text-charcoal-400">
                        …
                    </span>
                ) : (
                    <button
                        key={num}
                        onClick={() => goTo(num)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
              ${num === page
                                ? 'bg-terracotta-500 text-white shadow-sm'
                                : 'text-charcoal-600 hover:bg-sand-200'
                            }`}
                    >
                        {num}
                    </button>
                )
            )}

            <button
                onClick={() => goTo(page + 1)}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Next →
            </button>
        </nav>
    );
}
