import Button from './Button';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 w-16 h-16 rounded-full bg-coral-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-700 mb-1">Oops!</h3>
            <p className="text-sm text-charcoal-500 max-w-sm mb-6">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}
