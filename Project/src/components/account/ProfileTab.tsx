'use client';

import { User } from '@/api/types';
import Icon from '@/components/ui/Icon';
import styles from '@/styles/modules/ProfileTab.module.css';

interface ProfileTabProps {
  user: User;
  onLogout: () => void;
}

export default function ProfileTab({ user, onLogout }: ProfileTabProps) {
  return (
    <div className={styles.container}>
      <div className={styles.infoRow}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>
            {user.name.charAt(0)}
            {user.surname.charAt(0)}
          </span>
        </div>
        <div>
          <p className={styles.infoLabel}>Имя Фамилия</p>
          <p className={styles.infoValue}>
            {user.name} {user.surname}
          </p>
        </div>
      </div>

      <div className={`${styles.infoRow} mt-10`}>
        <div className={styles.iconBox}>
          <Icon name="mail-account" className={styles.icon} />
        </div>
        <div>
          <p className={styles.infoLabel}>Электронная почта</p>
          <p className={styles.infoValue}>{user.email}</p>
        </div>
      </div>

      <button onClick={onLogout} className={styles.logoutButton}>
        Выйти из аккаунта
      </button>
    </div>
  );
}