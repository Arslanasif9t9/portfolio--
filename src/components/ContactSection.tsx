import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Phone } from 'lucide-react';
import { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const socialLinks = [
    { icon: <FaWhatsapp size={24} />, href: 'https://wa.me/923450776252', label: 'WhatsApp' },
    { icon: <FaFacebook size={24} />, href: 'https://www.facebook.com/arslan.asif.70412', label: 'Facebook' },
    { icon: <FaLinkedin size={24} />, href: 'https://www.linkedin.com/in/arslan-ahmad-983834343/', label: 'LinkedIn' },
    { icon: <FaGithub size={24} />, href: 'https://github.com/Arslanasif9t9', label: 'GitHub' },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative group" style={{zIndex: -1}}>
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
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="floating-input w-full"
                required
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
            </div>

            <div className="relative group">
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="floating-input w-full"
                required
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
            </div>

            <div className="relative group">
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="floating-input w-full min-h-[150px] resize-none"
                required
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                             bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none
                             transition-opacity duration-300" />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 font-medium rounded-full bg-gradient-to-r from-primary to-secondary
                        text-primary-foreground flex items-center justify-center gap-2
                        shadow-[0_0_30px_hsl(var(--primary)/0.4)]
                        hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-shadow duration-300"
            >
              <Send size={20} />
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
