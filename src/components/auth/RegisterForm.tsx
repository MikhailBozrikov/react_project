// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/RegisterForm.module.css';
import authStyles from '@/styles/modules/AuthModal.module.css';
import iconStyles from '@/styles/modules/Icon.module.css';

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string; name: string; surname: string }) => void;
  isLoading: boolean;
  error?: string | null;
  onSwitchMode: () => void;
  className?: string;
}

export default function RegisterForm({
  onSubmit,
  isLoading,
  error,
  onSwitchMode,
  className = '',
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Некорректный email';
    if (!password) errors.password = 'Пароль обязателен';
    else if (password.length < 6) errors.password = 'Пароль должен быть не менее 6 символов';
    if (!confirmPassword) errors.confirmPassword = 'Подтвердите пароль';
    else if (password !== confirmPassword) errors.confirmPassword = 'Пароли не совпадают';
    if (!name.trim()) errors.name = 'Имя обязательно';
    if (!surname.trim()) errors.surname = 'Фамилия обязательна';
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    onSubmit({ email, password, name, surname });
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      {/* Email */}
      <Input
        label=""
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Электронная почта"
        icon={<Icon name="mail-placeholder" className={iconStyles.iconLg} />}
        error={formErrors.email}
        required
        autoComplete="username email"
        name="email"
      />

      {/* Имя */}
      <Input
        label=""
        type="text"
        value={name}
        onChange={setName}
        placeholder="Имя"
        icon={<Icon name="user-account" className={iconStyles.iconLg} />}
        error={formErrors.name}
        required
        autoComplete="off"
        name="given-name"
      />

      {/* Фамилия */}
      <Input
        label=""
        type="text"
        value={surname}
        onChange={setSurname}
        placeholder="Фамилия"
        icon={<Icon name="user-account" className={iconStyles.iconLg} />}
        error={formErrors.surname}
        required
        autoComplete="off"
        name="family-name"
      />

      {/* Пароль */}
      <Input
        label=""
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Пароль"
        icon={<Icon name="lock" className={iconStyles.iconLg} />}
        error={formErrors.password}
        required
        autoComplete="new-password"
        name="new-password"
      />

      {/* Подтверждение пароля */}
      <Input
        label=""
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Подтвердите пароль"
        icon={<Icon name="lock" className={iconStyles.iconLg} />}
        error={formErrors.confirmPassword}
        required
        autoComplete="off"
        name="confirm-password"
      />

      {error && (
        <div className={styles.errorBlock}>
          <Icon name="alert-circle" className={styles.errorIcon} />
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Создать аккаунт'}
        </Button>
        <button type="button" onClick={onSwitchMode} className={authStyles.switchButton}>
          У меня есть пароль
        </button>
      </div>
    </form>
  );
}