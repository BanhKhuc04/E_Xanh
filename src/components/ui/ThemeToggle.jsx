import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
;

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          className="theme-toggle-icon"
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
