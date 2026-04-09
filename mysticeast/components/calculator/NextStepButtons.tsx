'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NextStepButtonsProps {
  onSubscribeClick: () => void;
}

export function NextStepButtons({ onSubscribeClick }: NextStepButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.05, duration: 0.5 }}
      className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <Link href="/blog" className="block">
        <Button size="lg" className="w-full justify-center">
          Read Related Article
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full justify-center"
        onClick={onSubscribeClick}
      >
        Subscribe Weekly Insights
        <Mail className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
}
