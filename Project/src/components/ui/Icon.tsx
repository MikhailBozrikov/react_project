'use client';

import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  alt?: string;
}

export default function Icon({ name, className = '', alt = '' }: IconProps) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}