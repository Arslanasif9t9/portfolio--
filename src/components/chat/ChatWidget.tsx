import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/** Floating AI chat: bottom-right launcher + panel on desktop, full-screen sheet on mobile
 *  (opened from the mobile bottom navbar — the launcher itself is hidden there). */
const ChatWidget = ({ isOpen, onToggle, onClose }: ChatWidgetProps) => {
  return (
    <>
      {/* Desktop floating launcher */}
      <motion.button
        onClick={onToggle}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-6 right-6 z-[85] w-14 h-14 rounded-full items-center justify-center
                   bg-gradient-to-br from-primary to-secondary text-primary-foreground
                   shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_45px_hsl(var(--primary)/0.7)]
                   transition-shadow"
      >
        {isOpen ? <X size={26} /> : <Bot size={26} />}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping [animation-duration:2.5s]" />
        )}
      </motion.button>

      {/* Chat panel: full-screen on mobile, floating card on desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[90] inset-0 md:inset-auto md:bottom-24 md:right-6
                       md:w-[380px] md:h-[560px] md:max-h-[calc(100vh-8rem)]"
          >
            <ChatPanel onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
