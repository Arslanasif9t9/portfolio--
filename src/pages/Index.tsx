import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Eye } from 'lucide-react';
import Resume from '../components/Resume';
import DownloadCV from '../../public/Arslan_Ahmad_CV.pdf'

const Index = () => {
 const [isCvOpen, setIsCvOpen] = useState(false);
 const contentRef = useRef(null);
 const handleDownloadPdf = useReactToPrint({
  contentRef,
  documentTitle: 'Arslan_Ahmad_CV',
 });
 return (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
   {/* Particle Background */}
   <ParticleBackground />
   
   {/* Scanline Effect */}
   <div className="fixed inset-0 pointer-events-none scanline z-50 opacity-30" />
   
   {/* Navigation */}
   <Navbar 
    onViewCv={() => setIsCvOpen(true)} 
    onDownloadCv={handleDownloadPdf} 
   />
   
   {/* Main Content */}
   <main className="relative z-10">
    <HeroSection onViewCv={() => setIsCvOpen(true)} />
    <AboutSection />
    <SkillsSection />
    <ProjectsSection />
    <BlogSection />
    <ContactSection />
   </main>

   {/* Move the CV Modal here so it works globally */}
   <AnimatePresence>
    {isCvOpen && (
     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
       onClick={() => setIsCvOpen(false)}
       className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
       initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
       className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
       {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-800 uppercase tracking-tight hidden md:block">
              Curriculum Vitae
            </span>
            <a
              href={DownloadCV}
              download={true}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} />
              Download PDF
            </a>
            {/* <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} />
              Download PDF
            </button> */}
          </div>

          <button 
            onClick={() => setIsCvOpen(false)} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
       {/* Modal Body */}
       <div className="overflow-y-auto p-4 bg-gray-100">
        <div className="shadowlg"><Resume /></div>
       </div>
      </motion.div>
     </div>
    )}
   </AnimatePresence>

   {/* Hidden Download Ref */}
   <div style={{ display: "none" }}>
    <div ref={contentRef}><Resume /></div>
   </div>
   
   {/* Footer */}
   <Footer />
   {/* <CV /> */}
  </div>
 );
};

export default Index;

