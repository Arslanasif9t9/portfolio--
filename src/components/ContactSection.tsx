import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Phone, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { getSupabase } from '@/lib/supabase';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  // Honeypot: real users never fill this hidden field
  website: z.string().max(0).optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const COOLDOWN_KEY = 'contact-last-sent';
const COOLDOWN_MS = 60_000;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Honeypot filled → silently pretend success (bot)
    if (values.website) {
      reset();
      return;
    }

    const lastSent = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (Date.now() - lastSent < COOLDOWN_MS) {
      toast.error('Please wait a minute before sending another message.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      toast.error('Contact form is not available right now. Please email me directly!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: values.name,
        email: values.email,
        message: values.message,
      });
      if (error) throw error;

      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      toast.success("Message sent! I'll get back to you soon. 🚀");
      reset();
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Something went wrong. Please try again or email me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <FaWhatsapp size={24} />, href: 'https://wa.me/923450776252', label: 'WhatsApp' },
    { icon: <FaFacebook size={24} />, href: 'https://www.facebook.com/arslan.asif.70412', label: 'Facebook' },
    { icon: <FaLinkedin size={24} />, href: 'https://www.linkedin.com/in/arslan-ahmad-983834343/', label: 'LinkedIn' },
    { icon: <FaGithub size={24} />, href: 'https://github.com/Arslanasif9t9', label: 'GitHub' },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative group">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none
                    transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none
                    transition-all duration-500 group-hover:bg-secondary/20 group-hover:scale-110" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Let's connect!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">
              Let's Build Something Amazing
            </h3>
            <p className="text-muted-foreground mb-8">
              I'm always excited to work on innovative web projects and
              full-stack applications. Whether you have a specific project
              in mind or just want to chat about technology, feel free to reach out.
            </p>

            <div className="space-y-4 mb-8">
              <motion.div
                className="flex items-center gap-4 text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 glass-card rounded-lg text-primary">
                  <Mail size={20} />
                </div>
                <span>arslanahmadt58@gmail.com</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 glass-card rounded-lg text-primary">
                  <Phone size={20} />
                </div>
                <span>+92 345 0776252</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-4 text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <div className="p-3 glass-card rounded-lg text-primary">
                  <MapPin size={20} />
                </div>
                <span>Lahore, Punjab, Pakistan</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 30px hsl(var(--primary) / 0.5)',
                  }}
                  className="p-4 glass-card rounded-xl text-muted-foreground
                            hover:text-primary hover:border-primary/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Honeypot — hidden from real users, bots fill it */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              {...register('website')}
            />

            <div className="relative group">
              <input
                type="text"
                placeholder="Your Name"
                className="floating-input w-full"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="relative group">
              <input
                type="email"
                placeholder="Your Email"
                className="floating-input w-full"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="relative group">
              <textarea
                placeholder="Your Message"
                className="floating-input w-full min-h-[150px] resize-none"
                aria-invalid={!!errors.message}
                {...register('message')}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
              {errors.message && (
                <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full py-4 font-medium rounded-full bg-gradient-to-r from-primary to-secondary
                        text-primary-foreground flex items-center justify-center gap-2
                        shadow-[0_0_30px_hsl(var(--primary)/0.4)]
                        hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-shadow duration-300
                        disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
