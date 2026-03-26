/* ============================================
   水墨晕染扩散效果
   Ink Spread Animation Effect
   ============================================ */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface InkSpreadProps {
  isActive: boolean;
  onComplete?: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InkSpread({ 
  isActive, 
  onComplete,
  color = '#C45C26',
  size = 'md',
  className = ''
}: InkSpreadProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96'
  };

  return (
    <AnimatePresence>
      {isActive && (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
          {/* 主扩散圆 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`
            }}
          />
          
          {/* 次扩散圆 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}30 0%, transparent 60%)`
            }}
          />

          {/* 水墨粒子效果 */}
          {showParticles && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0, 
                    opacity: 0.8,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 1.5],
                    opacity: [0.8, 0.4, 0],
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                  className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                    filter: 'blur(2px)'
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

// 金粉飘落效果
interface GoldenParticlesProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  className?: string;
}

export function GoldenParticles({ 
  isActive, 
  particleCount = 30,
  duration = 2000,
  className = ''
}: GoldenParticlesProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    size: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 1 + 1
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration + 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, duration]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-50 ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            y: -20, 
            x: `${particle.x}%`,
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            y: '110vh',
            opacity: [0, 1, 1, 0],
            rotate: 360
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear"
          }}
          className="absolute"
          style={{ left: 0 }}
        >
          <div
            className="rounded-full bg-gold"
            style={{
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 6px rgba(212, 165, 116, 0.8)'
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// 呼吸光环效果
interface BreathingGlowProps {
  isActive: boolean;
  color?: string;
  className?: string;
}

export function BreathingGlow({ 
  isActive, 
  color = '#D4A574',
  className = ''
}: BreathingGlowProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 flex items-center justify-center ${className}`}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="rounded-full"
            style={{
              width: '150%',
              height: '150%',
              background: `radial-gradient(circle, ${color}30 0%, transparent 60%)`
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { InkSpreadProps, GoldenParticlesProps, BreathingGlowProps };
