import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = false,
  options,
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
      <select
        className={`
          w-full px-4 py-2 rounded border
          ${error ? 'border-error' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-error' : 'focus:ring-primary'}
          transition-all duration-200
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
