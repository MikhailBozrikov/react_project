import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from '@/styles/modules/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.message}>
          К сожалению, запрашиваемая страница не существует.
        </p>
        <Link href="/">
          <Button variant="primary">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  );
}