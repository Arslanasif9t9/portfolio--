import React from 'react';

const Resume = () => {
  return (
    <>
      {/* CSS to force layout preservation on Mobile */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --cv-width: 210mm;
        }

        @media screen and (max-width: 768px) {
          .mobile-wrapper {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background-color: transparent; 
            padding: 0;
            overflow: hidden;
            width: 100%;
          }
          .resume-container {
            transform: scale(0.42); 
            transform-origin: top center;
            margin: 0 !important;
            flex-shrink: 0;
            box-shadow: none !important;
            border: none !important;
          }
          /* FIX: Adjust the height of the wrapper to match the scaled content */
          /* Without this, the wrapper stays 297mm high even if the CV is scaled */
          .mobile-wrapper {
            height: calc(297mm * 0.42); 
          }

          @media (max-width: 400px) {
            .resume-container { transform: scale(0.35); }
            .mobile-wrapper { height: calc(297mm * 0.35); }
          }
        }

        @media print {
          @page { size: A4; margin: 0; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .mobile-wrapper { height: auto !important; background: white; }
          .resume-container {
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
          }
        }
      `}} />

      <div className="mobile-wrapper">
        <div className="resume-container w-[210mm] min-h-[297mm] mx-auto p-[12mm] bg-white shadow-2xl my-10 font-sans text-gray-800 leading-tight box-border border border-gray-100">
          
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-900">Arslan Ahmad</h1>
            <h2 className="text-xl font-medium text-blue-700 mt-1">Ideator & Senior Web Developer</h2>
            
            <div className="text-center flex justify-center flex-wrap gap-x-6 text-sm mt-3 text-gray-600">
              <span><i className="fas fa-envelope mr-1"></i> arslanahmad4506@gmail.com</span>
              <span><i className="fas fa-phone mr-1"></i> +92 345 0778252</span>
              <span><i className="fas fa-map-marker-alt mr-1"></i> Narowal, Punjab, Pakistan</span>
            </div>

            <div className="flex justify-center gap-x-6 text-sm mt-2 text-blue-600 font-semibold">
              <a href="https://linkedin.com/in/arslan-ahmad-983834343/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span className="text-gray-300">|</span>
              <a href="https://facebook.com/arslan.asif.70412" target="_blank" rel="noreferrer">Portfolio / Social</a>
            </div>
          </header>

          <hr className="border-t-2 border-gray-800 mb-5" />

          {/* Professional Summary */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Professional Summary</h3>
            <p className="text-[14px] text-justify leading-relaxed text-gray-700">
              Innovative Web Developer with 3+ years of experience in architecting high-performance, user-centric applications. 
              Expertise in modern front-end frameworks and robust back-end systems using PHP and Laravel. 
              A strong problem solver with a deep foundation in C++, Object-Oriented Programming (OOP), and Data Structures (DSA). 
              Proven track record of leading projects from conceptual wireframing to full-scale deployment, consistently delivering 
              scalable and maintainable code for diverse client needs.
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-3 uppercase text-base tracking-wide text-gray-900">Professional Experience</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <span className="text-gray-900">Senior Web Designer & Developer (Team Lead)</span>
                <span className="text-gray-600 text-xs">Nov 2025 – Present</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">Mazain Solution, Narowal</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Lead end-to-end development of complex web applications, ensuring 99.9% uptime and high performance.</li>
                <li>Orchestrate project lifecycles, translating stakeholder business requirements into technical roadmaps.</li>
                <li>Mentor junior developers through rigorous code reviews and implementation of industry best practices.</li>
                <li>Optimize web performance and SEO, resulting in improved user engagement for corporate clients.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <span className="text-gray-900">Full-Stack Developer (Academic & Freelance)</span>
                <span className="text-gray-600 text-xs">Jan 2021 – Oct 2025</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">Project-Based Solutions</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Delivered 10+ custom web solutions for local clients using HTML5, CSS3, JavaScript, and PHP.</li>
                <li>Developed complex algorithmic systems in C++ utilizing advanced DSA to solve technical challenges.</li>
                <li>Managed a digital business venture, mastering the intersection of technology and digital marketing.</li>
                <li>Implemented responsive design principles ensuring seamless experiences across mobile and desktop.</li>
              </ul>
            </div>
          </section>

          {/* Technical Skills - 3 Column Layout Preserved */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Technical Competencies</h3>
            <div className="grid grid-cols-3 gap-4 text-[13px] leading-snug">
              <div>
                <p className="font-bold text-blue-800 mb-1">Web Technologies</p>
                <p>HTML5, CSS3, JavaScript (ES6+), Bootstrap, Tailwind CSS, Basic React, PHP, Laravel</p>
              </div>
              <div>
                <p className="font-bold text-blue-800 mb-1">Core Programming</p>
                <p>C, C++, Object Oriented Programming (OOP), Data Structures (DSA), MySQL</p>
              </div>
              <div>
                <p className="font-bold text-blue-800 mb-1">Tools & DevOps</p>
                <p>Git, GitHub, VS Code, SQL Workbench, XAMPP, Command Prompt</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Education</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <div>
                  <span className="font-bold">The Sahara University</span> <span className="text-gray-600">| Bachelor’s in Information Technology</span>
                </div>
                <span className="font-semibold text-gray-600 text-xs">2023 – Present</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <div>
                  <span className="font-bold">Punjab Group of College</span> <span className="text-gray-600">| Intermediate in ICS</span>
                </div>
                <span className="font-semibold text-gray-600 text-xs">2021 – 2022</span>
              </div>
            </div>
          </section>

          {/* Awards & Languages - 2 Column Layout Preserved */}
          <div className="grid grid-cols-2 gap-8">
            <section>
              <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-sm tracking-wide text-gray-900">Honors & Awards</h3>
              <div className="text-[13px] text-gray-700">
                <p className="font-bold text-gray-900">Best Programmer Award (2024)</p>
                <p className="italic mb-1">Project Lead - IT Department</p>
                <p>Achieved 1st Prize in a cross-semester programming competition among all CS students.</p>
              </div>
            </section>
            <section>
              <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-sm tracking-wide text-gray-900">Languages & Interests</h3>
              <ul className="text-[13px] text-gray-700 space-y-1">
                <li><strong>Languages:</strong> English (Professional), Urdu (Native)</li>
                <li><strong>Interests:</strong> Logical Functionality, Algorithmic Optimization, Problem Solving</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;