import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 rounded border
          ${error ? 'border-error' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-error' : 'focus:ring-primary'}
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
