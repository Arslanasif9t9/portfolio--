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
            <h2 className="text-xl font-medium text-blue-700 mt-1">Senior Full-Stack Developer & AI Systems Engineer</h2>
            
            <div className="text-center flex justify-center flex-wrap gap-x-6 text-sm mt-3 text-gray-600">
              <span><i className="fas fa-envelope mr-1"></i> arslanahmadt58@gmail.com</span>
              <span><i className="fas fa-phone mr-1"></i> +92 345 0776252</span>
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
              Senior Full-Stack Developer with 5+ years of experience building high-performance web applications and, over the past year,
              architecting AI-driven systems and agentic workflows. Skilled in developing and integrating AI agents, chatbots, and automation
              pipelines using tools like Claude Code and Lovable, alongside strong foundations in React, Laravel, Node.js, and modern databases.
              Proven track record of leading projects end-to-end — from system architecture to deployment — for both local and international clients.
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-3 uppercase text-base tracking-wide text-gray-900">Professional Experience</h3>

            <div className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <span className="text-gray-900">AI Systems Developer & Integration Lead</span>
                <span className="text-gray-600 text-xs">Jan 2026 – Present</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">EIA (USA, Remote)</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Develop and integrate AI agents, chatbots, and MCP-based systems into enterprise web applications for US-based clients.</li>
                <li>Architect natural-language automation pipelines that connect AI models with business workflows and databases.</li>
                <li>Lead technical project execution end-to-end, from system design to deployment and client delivery.</li>
              </ul>
            </div>

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

            <div className="mb-4">
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <span className="text-gray-900">Full-Stack Developer (Freelance & Client Projects)</span>
                <span className="text-gray-600 text-xs">2021 – 2025</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">Project-Based Solutions</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Delivered 10+ custom web solutions for local and international clients using HTML5, CSS3, JavaScript, and PHP.</li>
                <li>Developed complex algorithmic systems in C++ utilizing advanced DSA to solve technical challenges.</li>
                <li>Implemented responsive design principles ensuring seamless experiences across mobile and desktop.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-baseline font-bold text-[15px]">
                <span className="text-gray-900">Web Development Intern</span>
                <span className="text-gray-600 text-xs">1 Month</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">Climax Solutions</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Hands-on foundational development in PHP, Laravel backend structures, and database workflows.</li>
              </ul>
            </div>
          </section>

          {/* Key Projects */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-3 uppercase text-base tracking-wide text-gray-900">Key Projects & Agentic Solutions</h3>

            <div className="mb-3">
              <p className="font-bold text-[14px] text-gray-900">AI-Powered Project Management System (PMS)</p>
              <p className="text-[13.5px] text-gray-700">Complex Monday.com-style board architecture featuring AI Agents, MCP Servers, role-based admin locks, real-time state tracking, form builder, and publishing features.</p>
            </div>
            <div className="mb-3">
              <p className="font-bold text-[14px] text-gray-900">Enterprise Multi-Vendor E-Commerce Platform</p>
              <p className="text-[13.5px] text-gray-700">Scalable Amazon-like multi-vendor ecosystem with real-time order tracking, vendor management, and complex database logic.</p>
            </div>
            <div className="mb-3">
              <p className="font-bold text-[14px] text-gray-900">AI Media Transcriber & Social Workflow Engine</p>
              <p className="text-[13.5px] text-gray-700">Automated video/reel transcript extraction pipeline integrated with MCP Protocol for seamless data querying.</p>
            </div>
            <div>
              <p className="font-bold text-[14px] text-gray-900">Smart IoT Parking Management System</p>
              <p className="text-[13.5px] text-gray-700">Live hardware-software synchronization using Python vision/camera models and web management dashboard.</p>
            </div>
            <p className="text-[12.5px] italic text-gray-500 mt-2">Additional Projects: Single-Vendor Portals, CMS Platforms, and Custom API Integrations.</p>
          </section>

          {/* Technical Skills */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Technical Competencies</h3>
            <div className="space-y-3 text-[13px] leading-snug">
              <div>
                <p className="font-bold text-blue-800 mb-1">Full-Stack Web Development</p>
                <p>React, Laravel, Node.js, Express.js, Next.js (AI-Assisted), PHP, JavaScript (ES6+), MySQL, Supabase, MongoDB (Basic), REST APIs, WebSockets, Tailwind CSS, Bootstrap, HTML5, CSS3</p>
              </div>
              <div>
                <p className="font-bold text-blue-800 mb-1">AI Systems Development & Integration</p>
                <p>Claude Code, Lovable, AI Agents, MCP Servers & Tools, AI Chatbots, AI-Powered Application Integration, Workflow Automation, Twilio API, SMTP Services, AI-Driven Data Operations</p>
              </div>
              <div>
                <p className="font-bold text-blue-800 mb-1">Software Engineering & Core</p>
                <p>Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), C, C++, Git, GitHub</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Education</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <div>
                  <span className="font-bold">Government College University Faisalabad (GCUF)</span> <span className="text-gray-600">| Bachelor of Science in Information Technology</span>
                </div>
                <span className="font-semibold text-gray-600 text-xs">2023 – 2027 (Present)</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <div>
                  <span className="font-bold">Punjab Group of College</span> <span className="text-gray-600">| Intermediate in ICS</span>
                </div>
                <span className="font-semibold text-gray-600 text-xs">2021 – 2022</span>
              </div>
            </div>
          </section>

          {/* Awards & Languages */}
          <div className="grid grid-cols-2 gap-8">
            <section>
              <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-sm tracking-wide text-gray-900">Honors & Awards</h3>
              <div className="text-[13px] text-gray-700">
                <p className="font-bold text-gray-900">Best Programmer Award (2024)</p>
                <p className="italic mb-1">Project Lead - IT Department</p>
                <p>Achieved 1st Prize in a cross-semester programming competition among all CS & IT students.</p>
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
