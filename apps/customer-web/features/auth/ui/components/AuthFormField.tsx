// Generic labeled input with icon, error state
// Used across all auth forms to avoid repetition

import React from 'react'

interface AuthFormFieldProps {
  label:        string
  name:         string
  type:         string
  value:        string
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?:       string
  disabled?:    boolean
  autoComplete?: string
  icon?:        React.ReactNode
  rightElement?: React.ReactNode
}

export function AuthFormField({
  label, name, type, value, onChange,
  placeholder, error, disabled,
  autoComplete, icon, rightElement,
}: AuthFormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-neutral-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full h-11 rounded-xl border font-medium text-neutral-900
            placeholder:text-neutral-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            disabled:opacity-60 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-10' : 'pr-4'}
            ${error
              ? 'border-red-400 bg-red-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
            }
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  )
}