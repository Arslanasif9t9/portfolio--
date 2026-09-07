import React, { useEffect, useRef, useState } from 'react';

// A4 page width in pixels at 96dpi (210mm)
const PAGE_WIDTH_PX = 793.7;

const Resume = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState('auto');

  useEffect(() => {
    const recalc = () => {
      if (!outerRef.current || !innerRef.current) return;

      const containerWidth = outerRef.current.clientWidth;
      // offsetHeight/scrollHeight are layout-based and are NOT affected by
      // CSS transform, so this always reflects the TRUE unscaled content height
      // no matter how many pages the resume grows to.
      const naturalHeight = innerRef.current.offsetHeight;

      if (containerWidth <= 0) return;

      if (containerWidth >= PAGE_WIDTH_PX) {
        // Plenty of room (desktop / tablet landscape) — show at full size
        setScale(1);
        setWrapperHeight('auto');
        return;
      }

      const s = containerWidth / PAGE_WIDTH_PX;
      setScale(s);
      setWrapperHeight(naturalHeight * s);
    };

    recalc();

    // Watch BOTH the outer container (width changes) and the inner content
    // (height changes as fonts/content load) continuously — no fragile
    // one-off timers.
    const ro = new ResizeObserver(recalc);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);

    window.addEventListener('resize', recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white; -webkit-print-color-adjust: exact; }
        }
      `}} />

      <div
        ref={outerRef}
        className="w-full flex justify-center print:!h-auto print:!overflow-visible print:!block"
        style={{ height: wrapperHeight, overflow: 'hidden' }}
      >
        <div
          ref={innerRef}
          className="resume-container w-[210mm] min-h-[297mm] mx-auto p-[12mm] bg-white shadow-2xl font-sans text-gray-800 leading-tight box-border border border-gray-100 print:!transform-none print:!shadow-none print:!border-none flex-shrink-0"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >

          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-900">Arslan Ahmad</h1>
            <h2 className="text-xl font-medium text-blue-700 mt-1">Senior Full-Stack Developer & AI Systems Engineer</h2>
            
            <div className="text-center flex justify-center flex-wrap gap-x-6 text-sm mt-3 text-gray-600">
              <span><i className="fas fa-envelope mr-1"></i> arslanahmadt58@gmail.com</span>
              <span><i className="fas fa-phone mr-1"></i> +92 345 0776252</span>
              <span><i className="fas fa-map-marker-alt mr-1"></i> Narowal, Pakistan / Remote</span>
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
                <span className="text-gray-900">AI Web Systems Developer & Integration Lead</span>
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
                <span className="text-gray-900">Senior Web Designer & Developer (Team Lead & Instructor)</span>
                <span className="text-gray-600 text-xs">Nov 2025 – Present</span>
              </div>
              <div className="text-blue-700 italic text-sm mb-1">Mazain Solution, Narowal</div>
              <ul className="list-disc ml-5 text-[13.5px] text-gray-700 space-y-1">
                <li>Lead end-to-end development of complex web applications, ensuring 99.9% uptime and high performance.</li>
                <li>Orchestrate project lifecycles, translating stakeholder business requirements into technical roadmaps.</li>
                <li>Mentor and train students as an instructor, conducting hands-on sessions in web development fundamentals.</li>
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
                <li>Delivered 10+ custom web solutions for local and international clients using HTML5, CSS3, JavaScript, PHP, and Laravel.</li>
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

          {/* Technical Skills - 2 Column Layout */}
          <section className="mb-6">
            <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2 uppercase text-base tracking-wide text-gray-900">Technical Competencies</h3>
            <div className="grid grid-cols-2 gap-x-6 text-[13px] leading-snug">
              <div>
                <p className="font-bold text-blue-800 mb-1">Full-Stack Web Development</p>
                <p>React, Laravel, Node.js, Express.js, Next.js, PHP, JavaScript (ES6+), MySQL, Supabase, MongoDB, REST APIs, WebSockets, Twilio, SMTP, Tailwind CSS, Bootstrap, HTML5, CSS3</p>
              </div>
              <div>
                <p className="font-bold text-blue-800 mb-1">AI Systems & Automation</p>
                <p>Claude Code, Lovable, AI Agents, MCP Servers & Tools, AI Chatbots, AI-Powered App Integration, Workflow Automation, AI-Driven Data Operations, React Native & Expo</p>
              </div>
            </div>
            <div className="mt-3 text-[13px] leading-snug">
              <p className="font-bold text-blue-800 mb-1">Software Engineering & Tools</p>
              <p>Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), C, C++, Git, GitHub, VS Code, Cursor, SQL Workbench, XAMPP, Postman, Command Prompt</p>
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
                <span className="font-semibold text-gray-600 text-xs">2023 – 2027</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <div>
                  <span className="font-bold">Punjab Group of College</span> <span className="text-gray-600">| Intermediate in ICS</span>
                </div>
                <span className="font-semibold text-gray-600 text-xs">2021 – 2022</span>
              </div>
            </div>
          </section>

          {/* Awards & Languages - 2 Column Layout */}
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
