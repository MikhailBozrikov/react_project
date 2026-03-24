// src/components/ui/Button.tsx
'use client';

import { ReactNode, memo } from 'react';
import styles from '@/styles/modules/Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'register';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}: ButtonProps) {
  const variantClass = styles[variant];
  const sizeClass = styles[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${styles.button}
        ${variantClass}
        ${sizeClass}
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default memo(Button);