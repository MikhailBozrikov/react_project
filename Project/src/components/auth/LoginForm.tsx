'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/LoginForm.module.css';
import iconStyles from '@/styles/modules/Icon.module.css';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email обязателен';
    if (!password) errors.password = 'Пароль обязателен';
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
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label=""
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Электронная почта"
        icon={<Icon name="mail" className={iconStyles.iconLg} />}
        error={formErrors.email}
        required
        autoComplete="username email"
        name="email"
      />
      <Input
        label=""
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Пароль"
        icon={<Icon name="lock" className={iconStyles.iconLg} />}
        error={formErrors.password}
        required
        autoComplete="current-password"
        name="current-password"
      />
      {error && (
        <div className={styles.errorBlock}>
          <Icon name="alert-circle" className={styles.errorIcon} />
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
      <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Войти'}
      </Button>
    </form>
  );
}