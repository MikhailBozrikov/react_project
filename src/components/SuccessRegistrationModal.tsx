'use client';

import Modal from './ui/Modal';
import Button from './ui/Button';
import Icon from './ui/Icon';
import styles from '@/styles/modules/SuccessRegistrationModal.module.css';

interface SuccessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function SuccessRegistrationModal({
  isOpen,
  onClose,
  onLoginClick,
}: SuccessRegistrationModalProps) {
  const handleLogin = () => {
    onClose();
    onLoginClick();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src="/icons/logo-login.svg" alt="Логотип" className={styles.logo} />
        <button onClick={onClose} className={styles.closeCircle}>
          <Icon name="x" className={styles.closeIcon} />
        </button>
        <h2 className={styles.title}>Регистрация завершена</h2>
        <p className={styles.message}>Используйте вашу электронную почту для входа</p>
        <Button variant="primary" size="lg" fullWidth onClick={handleLogin}>
          Войти
        </Button>
      </div>
    </Modal>
  );
}