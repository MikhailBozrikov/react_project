'use client';

import Link from 'next/link';
import { useMemo, memo } from 'react';
import styles from '@/styles/modules/GenreCard.module.css';

interface GenreCardProps {
  id: string;
  name: string;
  posterUrl?: string;
}

function GenreCard({ id, name, posterUrl }: GenreCardProps) {
  const gradientColor = useMemo(() => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-yellow-500 to-orange-500',
      'from-gray-700 to-gray-900',
      'from-green-500 to-emerald-500',
      'from-amber-700 to-yellow-700',
      'from-red-600 to-pink-600',
      'from-purple-600 to-indigo-600',
      'from-teal-500 to-cyan-500',
    ];
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }, [id]);

  const [from, to] = gradientColor.split(' ').map(part => part.replace('from-', '').replace('to-', ''));

  const colorMap: Record<string, string> = {
    'blue-500': '#3b82f6',
    'cyan-500': '#06b6d4',
    'yellow-500': '#eab308',
    'orange-500': '#f97316',
    'gray-700': '#374151',
    'gray-900': '#111827',
    'green-500': '#22c55e',
    'emerald-500': '#10b981',
    'amber-700': '#b45309',
    'yellow-700': '#a16207',
    'red-600': '#dc2626',
    'pink-600': '#db2777',
    'purple-600': '#9333ea',
    'indigo-600': '#4f46e5',
    'teal-500': '#14b8a6',
  };

  const gradientStyle = {
    '--gradient-from': colorMap[from] || '#3b82f6',
    '--gradient-to': colorMap[to] || '#06b6d4',
  } as React.CSSProperties;

  return (
    <Link href={`/genres/${id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {posterUrl ? (
          <img src={posterUrl} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.placeholder} style={gradientStyle}>
            <span className={styles.placeholderLetter}>
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.titleContainer}>
        <h3 className={styles.title}>{name}</h3>
      </div>
    </Link>
  );
}

export default memo(GenreCard);