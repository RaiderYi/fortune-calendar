'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

interface ShareModuleProps {
  summary: string;
}

export function ShareModule({ summary }: ShareModuleProps) {
  const [copied, setCopied] = useState(false);

  const sharePayload = useMemo(
    () => ({
      title: 'My MysticEast Elemental Blueprint',
      text: summary,
      url: typeof window !== 'undefined' ? window.location.origin + '/calculator' : '/calculator',
    }),
    [summary]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      trackEvent('share_clicked', { method: 'copy' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      trackEvent('share_clicked', { method: 'copy_failed' });
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return;

    try {
      await navigator.share(sharePayload);
      trackEvent('share_clicked', { method: 'native_share' });
    } catch {
      trackEvent('share_clicked', { method: 'native_share_cancelled' });
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.15, duration: 0.5 }}
      className="mt-8 crystal-card p-6 border border-primary-200/70 bg-white/75"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700/80">
            Share your summary
          </p>
          <p className="mt-2 text-charcoal/70 leading-relaxed">{summary}</p>
        </div>

        <div className="flex flex-col gap-3 sm:w-auto sm:min-w-[220px]">
          <Button type="button" variant="secondary" onClick={handleCopy} className="w-full justify-center">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </Button>

          {canShare && (
            <Button type="button" variant="outline" onClick={handleNativeShare} className="w-full justify-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
