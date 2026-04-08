'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ContactFormData } from '@/lib/types';
import { trackEvent } from '@/lib/tracking';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name required'),
  email: z.string().email('Invalid email address'),
  whatsapp: z
    .string()
    .min(10, 'Valid phone / WhatsApp is required')
    .regex(/^[+]?\d[\d\s-]{8,16}$/, 'Enter a valid phone / WhatsApp number'),
  projectType: z.string().min(2, 'Project type required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine((value) => value, {
    message: 'Please confirm consent before submitting',
  }),
});

const projectOptions = [
  'AI automation',
  'Business website',
  'Web app development',
  'Lead capture system',
  'WhatsApp automation',
  'Dashboard / internal tool',
  'Landing page',
  'Maintenance and support',
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      businessName: '',
      email: '',
      whatsapp: '',
      projectType: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        trackEvent('form_submit', { form: 'contact', source: 'contact_form_component', project_type: data.projectType });
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6 max-w-2xl"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business name</label>
          <input
            {...register('businessName')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Your company or brand"
          />
          {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label>
          <input
            {...register('whatsapp')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+91XXXXXXXXXX"
          />
          {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project type</label>
        <select
          {...register('projectType')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select one</option>
          {projectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Tell us about your interest..."
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input type="checkbox" className="mt-1" {...register('consent')} />
        <span>
          I consent to IgniteCore storing my details to contact me with recommendations and project follow-up.
        </span>
      </label>
      {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-500 rounded-lg p-4"
        >
          <p className="text-green-700 font-medium">✓ Message sent! We will get back to you within 24 hours.</p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-500 rounded-lg p-4"
        >
          <p className="text-red-700 font-medium">✗ Something went wrong. Please try again.</p>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </motion.button>
    </motion.form>
  );
}
