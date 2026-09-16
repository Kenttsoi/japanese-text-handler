import React from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  variant?: 'pop' | 'scroll';
}

export default function AnimatedNumber({ value, variant = "pop" }: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    if (variant === 'pop') {
      const controls = animate(count, value, {
        duration: 2,
        ease: 'easeOut',
        delay: 0.2,
      });

      return () => controls.stop();
    }
  }, [value, count]);

  if (variant === 'scroll') {
    return (
      <span style={{ overflow: 'hidden', display: 'inline-flex', height: '1.2em' }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              bounce: 0.3,
              delay: 0.1
            }}
            style={{ display: 'inline-block' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }

  return <motion.span>{displayValue}</motion.span>;
}

