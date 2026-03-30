// src/components/ui/Input.tsx
'use client';

import { ReactNode, memo } from 'react';
import styles from '@/styles/modules/Input.module.css';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  autoFocus?: boolean;
  autoComplete?: string;
  name?: string;
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  className = '',
  required = false,
  icon,
  iconPosition = 'left',
  autoFocus,
  autoComplete,
  name,
}: InputProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && iconPosition === 'left' && (
          <span className={`${styles.icon} ${styles.left} ${error ? styles.iconError : ''}`}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          name={name}
          className={`
            ${styles.input}
            ${error ? styles.error : ''}
            ${icon && iconPosition === 'left' ? styles.iconLeft : ''}
            ${icon && iconPosition === 'right' ? styles.iconRight : ''}
          `}
        />
        {icon && iconPosition === 'right' && (
          <div className={`${styles.icon} ${styles.right}`}>{icon}</div>
        )}
      </div>
    </div>
  );
}

export default memo(Input);