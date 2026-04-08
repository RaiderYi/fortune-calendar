'use client';

import { Leaf, Flame, Mountain, Circle, Waves } from 'lucide-react';
import { cn, getElementColor } from '@/lib/utils';

interface ElementIconProps {
  element: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ElementIcon({ element, size = 'md', className }: ElementIconProps) {
  const elementLower = element.toLowerCase();
  const color = getElementColor(element);
  
  const icons = {
    wood: Leaf,
    fire: Flame,
    earth: Mountain,
    metal: Circle,
    water: Waves,
  };
  
  const Icon = icons[elementLower as keyof typeof icons] || Circle;
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center shadow-lg',
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 30px ${color}40`,
      }}
    >
      <Icon
        className={iconSizes[size]}
        style={{ color }}
        strokeWidth={1.5}
      />
    </div>
  );
}
