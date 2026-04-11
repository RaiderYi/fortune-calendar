'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { type BirthData, type CalculationResult } from '@/types';

// Common timezones
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'UTC', label: 'UTC' },
];

type FormData = BirthData;

interface CalculateApiResponse {
  success: boolean;
  data?: CalculationResult;
  error?: string;
}

export function BirthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    timezone: 'America/New_York',
    location: '',
  });
  const [displayDate, setDisplayDate] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    trackEvent('calculator_started');
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (!formData.date || !isoDateRegex.test(formData.date)) {
      newErrors.date = 'Please enter a valid birth date (MM/DD/YYYY)';
    } else if (Number.isNaN(new Date(formData.date).getTime())) {
      newErrors.date = 'Please enter a valid calendar date';
    }
    
    if (!formData.time || !timeRegex.test(formData.time)) {
      newErrors.time = 'Please enter a valid birth time';
    }
    
    if (!formData.timezone) {
      newErrors.timezone = 'Please select your timezone';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    trackEvent('calculator_submitted', {
      has_location: Boolean(formData.location),
      timezone: formData.timezone,
    });

    try {
      const payload = {
        ...formData,
        location: formData.location?.trim() || undefined,
      };

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as CalculateApiResponse;
      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Unable to calculate your chart right now.');
      }

      // Store form/result in sessionStorage for result page
      sessionStorage.setItem('birthData', JSON.stringify(formData));
      sessionStorage.setItem('calculationResult', JSON.stringify(json.data));
      
      // Navigate to result page
      router.push('/result');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while calculating your chart. Please try again.';
      setSubmitError(message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format ISO date for display (YYYY-MM-DD to MM/DD/YYYY)
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    if (!year || !month || !day) return '';
    return `${month}/${day}/${year}`;
  };

  const toIsoDate = (input: string): string | null => {
    const parts = input.split('/');
    if (parts.length !== 3) return null;

    const [monthRaw, dayRaw, yearRaw] = parts.map((part) => part.trim());
    if (!monthRaw || !dayRaw || !yearRaw) return null;

    if (!/^\d{1,2}$/.test(monthRaw) || !/^\d{1,2}$/.test(dayRaw) || !/^\d{4}$/.test(yearRaw)) {
      return null;
    }

    const month = Number(monthRaw);
    const day = Number(dayRaw);
    const year = Number(yearRaw);
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
      return null;
    }

    const iso = `${yearRaw}-${monthRaw.padStart(2, '0')}-${dayRaw.padStart(2, '0')}`;
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return null;

    const matchesDate =
      parsed.getUTCFullYear() === year &&
      parsed.getUTCMonth() + 1 === month &&
      parsed.getUTCDate() === day;

    return matchesDate ? iso : null;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="crystal-card p-8 md:p-10"
    >
      <div className="space-y-6">
        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-charcoal mb-2">
            Birth Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              id="date"
              value={displayDate}
              onChange={(e) => {
                const rawValue = e.target.value;
                setDisplayDate(rawValue);

                const isoDate = toIsoDate(rawValue);
                setFormData({ ...formData, date: isoDate ?? '' });
                if (errors.date) {
                  setErrors((current) => ({ ...current, date: undefined }));
                }
              }}
              onBlur={() => {
                if (!displayDate) return;
                const isoDate = toIsoDate(displayDate);
                if (!isoDate) return;
                setDisplayDate(formatDisplayDate(isoDate));
              }}
              placeholder="MM/DD/YYYY"
              className={cn(
                'form-input pl-12 pr-4 py-4',
                errors.date 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-primary-200'
              )}
            />
          </div>
          {errors.date && (
            <p className="mt-2 text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        {/* Time Field */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-charcoal mb-2">
            Birth Time
          </label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => {
                setFormData({ ...formData, time: e.target.value });
                if (errors.time) {
                  setErrors((current) => ({ ...current, time: undefined }));
                }
              }}
              className={cn(
                'form-input pl-12 pr-4 py-4',
                errors.time 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-primary-200'
              )}
            />
          </div>
          {errors.time && (
            <p className="mt-2 text-sm text-red-500">{errors.time}</p>
          )}
          <p className="mt-2 text-xs text-charcoal/50">
            If you don&apos;t know your exact time, select 12:00 PM (noon) as an approximation.
          </p>
        </div>

        {/* Timezone Field */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-charcoal mb-2">
            Timezone
          </label>
          <div className="relative">
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => {
                setFormData({ ...formData, timezone: e.target.value });
                if (errors.timezone) {
                  setErrors((current) => ({ ...current, timezone: undefined }));
                }
              }}
              className={cn(
                'form-input pl-4 pr-12 py-4 appearance-none',
                errors.timezone 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-primary-200'
              )}
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40 pointer-events-none" />
          </div>
        </div>

        {/* Location Field (Optional) */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-charcoal mb-2">
            Birth Location <span className="text-charcoal/50">(Optional)</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              id="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input pl-12 pr-4 py-4"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full text-lg py-5"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Calculating Your Chart...
              </>
            ) : (
              'Reveal Your Element'
            )}
          </Button>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-charcoal/60">
            <span className="rounded-full bg-primary-50 px-2.5 py-1">No credit card</span>
            <span className="rounded-full bg-primary-50 px-2.5 py-1">No signup needed</span>
            <span className="rounded-full bg-primary-50 px-2.5 py-1">Instant result</span>
          </div>
        </div>

        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </p>
        )}

        {/* Privacy Note */}
        <p className="text-center text-xs text-charcoal/50">
          Your birth data is used solely for chart calculation and is never shared with third parties.
        </p>
      </div>
    </motion.form>
  );
}
