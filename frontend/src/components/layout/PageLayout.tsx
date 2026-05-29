import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react'

interface PageLayoutProps {
    children: React.ReactNode;
}

export default function PageLayout({ children, ...props }: PageLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}