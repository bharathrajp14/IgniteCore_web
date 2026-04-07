'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { label: 'Problem', id: 'problem' },
    { label: 'Opportunity', id: 'opportunity' },
    { label: 'Solution', id: 'solution' },
    { label: 'Business Model', id: 'business-model' },
    { label: 'Traction', id: 'traction' },
    { label: 'Roadmap', id: 'roadmap' },
    { label: 'Financials', id: 'financials' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Studio
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex gap-8 items-center">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleScroll(section.id)}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm"
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1.5"
          >
            <motion.div
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gray-900"
            />
            <motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-gray-900" />
            <motion.div
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gray-900"
            />
          </button>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden mt-4 space-y-2"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleScroll(section.id)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded transition-colors"
            >
              {section.label}
            </button>
          ))}
        </motion.div>
      </div>
    </motion.nav>
  );
}
