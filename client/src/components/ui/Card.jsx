export default function Card({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`bg-white rounded-2xl border border-sand-200 shadow-sm 
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
