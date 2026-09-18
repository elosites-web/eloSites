import React from 'react';

interface EloLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EloLogo: React.FC<EloLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClass = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  }[size];

  return (
    <img
      src="/logo-elosites-final.png"
      alt="ēloSites"
      className={`${heightClass} w-auto max-w-full min-w-0 object-contain object-left block ${className}`}
    />
  );
};
