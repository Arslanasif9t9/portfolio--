import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Eye } from 'lucide-react';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Resume from './Resume';
import DownloadCV from '../../public/Arslan_Ahmad_CV.pdf'

const Navbar = ({ onViewCv, onDownloadCv }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isCvOpen, setIsCvOpen] = useState(false);

  // 1. Create the reference
  // const contentRef = useRef(null);

  // // 2. Updated hook for version 3.0+
  // const handleDownloadPdf = useReactToPrint({
  //   contentRef, // Pass the ref directly here
  //   documentTitle: 'Arslan_Ahmad_CV',
  //   onAfterPrint: () => console.log("PDF generated"),
  // });

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-2"
      >
        <div className="max-w-6xl mx-auto glass-card rounded-full px-6 py-3 flex items-center justify-between">
          <a href="#" className="font-display font-bold text-xl gradient-text">
            {'<Arslan.Dev />'}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CV Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onViewCv}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-primary/50 rounded-full text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Eye size={16} />
              View CV
            </button>
            <a
              href={DownloadCV}
              download={true}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-secondary rounded-full text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
            >
              <Download size={16} />
              Download CV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 glass-card rounded-2xl p-6 mx-4"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary py-2">
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  <button
                    onClick={onViewCv}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border border-primary/50 rounded-full text-primary"
                  >
                    <Eye size={16} />
                    View CV
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* --- CV MODAL SECTION --- */}
      {/* <AnimatePresence>
        {isCvOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCvOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-gray-800 uppercase tracking-tight">Curriculum Vitae</span>
                <button 
                  onClick={() => setIsCvOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto p-4 bg-gray-100">
                <div className="shadow-lg">
                   <Resume />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
      
      {/* <div style={{ display: "none" }}>
        <div ref={contentRef}>
          <Resume />
        </div>
      </div> */}
    </>
  );
};

export default Navbar;