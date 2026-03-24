// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import styles from '@/styles/modules/Footer.module.css';

export default function Footer() {
  const socialLinks = [
    { name: 'vk', href: 'https://vk.com', label: 'ВКонтакте' },
    { name: 'youtube', href: 'https://youtube.com', label: 'YouTube' },
    { name: 'ok', href: 'https://ok.ru', label: 'Одноклассники' },
    { name: 'telegram', href: 'https://t.me', label: 'Telegram' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.social}>
          {socialLinks.map(({ name, href, label }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={label}
            >
              <span
                className={styles.socialIcon}
                style={{ maskImage: `url(/icons/${name}.svg)` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}