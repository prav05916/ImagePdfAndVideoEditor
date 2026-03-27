'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
}

export default function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{title}</h1>
      </div>
      <p className="text-text-secondary ml-12">{subtitle}</p>
    </motion.div>
  );
}
