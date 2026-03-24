'use client';

import { ReactNode } from 'react';
import styles from '@/styles/modules/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.centerWrapper}>
        {children}
      </div>
    </div>
  );
}