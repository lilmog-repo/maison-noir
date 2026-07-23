import React, { useState } from 'react';
import { AnimatedSection } from '@/components/ui/custom/AnimatedSection';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export function Newsletter() {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSuccess(true);
    form.reset();
  };

  return (
    <section className="py-32 bg-[#111111] text-white w-full border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        <AnimatedSection>
          <h2 className="font-serif text-4xl lg:text-6xl mb-6 tracking-wide">Stay Close</h2>
        </AnimatedSection>
        
        <AnimatedSection delay={0.1}>
          <p className="text-white/60 font-light text-lg max-w-md mx-auto mb-12">
            New arrivals, stories, and rare invitations — for those who prefer to know first.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...form.register('email')}
                    className="w-full bg-transparent border-b border-white/30 py-4 px-2 text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors text-center font-light"
                    data-testid="input-newsletter-email"
                  />
                  {form.formState.errors.email && (
                    <span className="absolute -bottom-6 left-0 w-full text-xs text-destructive text-center">
                      {form.formState.errors.email.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-6 w-full bg-white text-black py-4 text-sm uppercase tracking-widest font-medium hover:bg-accent hover:text-black transition-colors disabled:opacity-50"
                  data-testid="btn-newsletter-submit"
                >
                  {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center text-accent">
                  <Check className="w-6 h-6" />
                </div>
                <p className="font-serif text-2xl">Welcome to Maison Noir.</p>
                <p className="text-white/60 font-light text-sm">You are now on the list.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>
      </div>
    </section>
  );
}
