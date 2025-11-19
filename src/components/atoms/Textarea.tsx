import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
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
      <textarea
        className={`
          w-full px-4 py-2 rounded border
          ${error ? 'border-error' : 'border-gray-300'}
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-error' : 'focus:ring-primary'}
          transition-all duration-200 resize-none
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
