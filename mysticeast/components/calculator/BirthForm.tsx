'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

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

interface FormData {
  date: string;
  time: string;
  timezone: string;
  location: string;
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
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.date) {
      newErrors.date = 'Please enter your birth date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please enter your birth time';
    }
    
    if (!formData.timezone) {
      newErrors.timezone = 'Please select your timezone';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Store form data in sessionStorage for result page
      sessionStorage.setItem('birthData', JSON.stringify(formData));
      
      // Simulate API call delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to result page
      router.push('/result');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
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
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="MM/DD/YYYY"
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-xl border bg-white/50 focus:bg-white transition-all duration-200 outline-none',
                errors.date 
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
                !formData.date && 'text-charcoal/50'
              )}
              max={new Date().toISOString().split('T')[0]}
              onFocus={(e) => e.target.classList.remove('text-charcoal/50')}
              onBlur={(e) => !formData.date && e.target.classList.add('text-charcoal/50')}
            />
            {!formData.date && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none">
                MM / DD / YYYY
              </span>
            )}
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
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-xl border bg-white/50 focus:bg-white transition-all duration-200 outline-none',
                errors.time 
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
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
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className={cn(
                'w-full pl-4 pr-12 py-4 rounded-xl border bg-white/50 focus:bg-white transition-all duration-200 outline-none appearance-none',
                errors.timezone 
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
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
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-primary-200 bg-white/50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none"
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
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-charcoal/50">
          Your birth data is used solely for chart calculation and is never shared with third parties.
        </p>
      </div>
    </motion.form>
  );
}
