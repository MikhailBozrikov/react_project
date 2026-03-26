// src/components/AuthModal.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import Icon from './ui/Icon';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser, registerUser, clearError } from '@/lib/slices/authSlice';
import styles from '@/styles/modules/AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      onClose();
    }
  }, [dispatch, onClose]);

  const handleRegister = useCallback(async (data: { email: string; password: string; name: string; surname: string }) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      onClose();
    }
  }, [dispatch, onClose]);

  const handleClose = useCallback(() => {
    dispatch(clearError());
    onClose();
  }, [dispatch, onClose]);

  const switchMode = useCallback(() => {
    setIsLogin(!isLogin);
    dispatch(clearError());
  }, [isLogin, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src="/icons/logo-login.svg" alt="Логотип" className={styles.logo} />
        <button onClick={handleClose} className={styles.closeCircle}>
          <Icon name="x" className={styles.closeIcon} />
        </button>

        {isLogin ? (
          <>
            <div className={styles.loginFormWrapper}>
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
            </div>
            <button type="button" onClick={switchMode} className={styles.switchButton}>
              Регистрация
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.registerTitle}>Регистрация</h2>
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
              onSwitchMode={switchMode}
              className={styles.registerForm}
            />
          </>
        )}
      </div>
    </Modal>
  );
}