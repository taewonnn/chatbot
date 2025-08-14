interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
  className?: string;
  centered?: boolean;
}

export default function LoadingSpinner({
  size = 'lg',
  color = 'blue',
  text,
  className = '',
  centered = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
    '2xl': 'h-24 w-24',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  const containerClasses = centered
    ? `flex items-center justify-center gap-4 ${className}`
    : `flex items-center gap-4 ${className}`;

  return (
    <div className={`${containerClasses} animate-fade-in`}>
      <div
        className={`${sizeClasses[size]} animate-spin-custom rounded-full border-4 border-gray-200 ${colorClasses[color]} border-t-transparent`}
      />
      {text && <div className="theme-text-secondary text-lg font-medium">{text}</div>}
    </div>
  );
}
