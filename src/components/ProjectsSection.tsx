import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

// const projects = [
//   {
//     title: 'Multi-vendor Platform',
//     description: 'Full-stack muli-vendor e-commerce solution with blade frontend, laravel backend, Stripe payments, and real-time inventory management.',
//     tech: ['HTML & CSS', 'JavaScript', 'Laravel', 'MySQL'],
//     image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
//     // github: 'https://github.com',
//     live: 'https://arslan.mjcheezain.com/',
//     category: 'Full-Stack',
//   },
//   {
//     title: 'E-Commerce Platform',
//     description: 'Full-stack e-commerce solution with React frontend, Node.js backend, Stripe payments, and real-time inventory management.',
//     tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
//     image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     live: 'https://demo.com',
//     category: 'Full-Stack',
//   },
//   {
//     title: 'Real-time Chat App',
//     description: 'WebSocket-powered chat application with private messaging, group chats, file sharing, and push notifications.',
//     tech: ['React', 'Socket.io', 'Express', 'MongoDB'],
//     image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     live: 'https://demo.com',
//     category: 'Real-time',
//   },
//   {
//     title: 'Project Management Dashboard',
//     description: 'Collaborative project management tool with Kanban boards, task tracking, team collaboration, and analytics.',
//     tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
//     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     live: 'https://demo.com',
//     category: 'SaaS',
//   },
//   {
//     title: 'Social Media Platform',
//     description: 'Feature-rich social network with user profiles, posts, comments, likes, follow system, and infinite scroll.',
//     tech: ['React', 'Node.js', 'Redis', 'AWS S3'],
//     image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     category: 'Social',
//   },
//   {
//     title: 'API Gateway Service',
//     description: 'Microservices API gateway with rate limiting, authentication, logging, and service discovery.',
//     tech: ['Node.js', 'Express', 'Docker', 'Redis'],
//     image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     live: 'https://demo.com',
//     category: 'Backend',
//   },
//   {
//     title: 'Portfolio Builder',
//     description: 'Drag-and-drop portfolio website builder with custom themes, SEO optimization, and one-click deployment.',
//     tech: ['Vue.js', 'Node.js', 'MongoDB', 'Vercel'],
//     image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
//     github: 'https://github.com',
//     category: 'Tool',
//   },
// ];

const projects = [
  {
    title: 'Multi-vendor E-Commerce Platform',
    description: 'A massive scale marketplace featuring three distinct dashboards (Admin, Vendor, and Customer). Built with Laravel, it handles complex product relations, vendor payouts, and real-time inventory management across multiple storefronts.',
    tech: ['Laravel', 'MySQL', 'JavaScript', 'HTML & CSS'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    live: 'https://arslan.mjcheezain.com/',
    category: 'Full-Stack',
  },
  {
    title: 'Al-Kuwait E-Commerce',
    description: 'A comprehensive online retail solution with a robust Admin panel for order processing and catalog management. This large-scale project features a multi-page architecture designed for high-performance shopping experiences.',
    tech: ['Laravel', 'MySQL', 'JavaScript', 'HTML & CSS'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    live: 'https://alkuwait.mjcheezain.com/',
    category: 'Full-Stack',
  },
  {
    title: 'BlogSphere',
    description: 'A sophisticated content management system and blogging platform. Includes an advanced Admin dashboard for content moderation, user management, and detailed analytics for tracking post engagement.',
    tech: ['Laravel', 'MySQL', 'JavaScript', 'HTML & CSS'],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    live: 'https://blogsphere.mjcheezain.com/',
    category: 'Web App',
  },
  {
    title: 'IoT Automatic Car Parking',
    description: 'A hardware-software hybrid project using Embedded Systems. Features automatic slot detection and entry control via C++ and PHP, with a web-based monitoring interface for real-time parking availability.',
    tech: ['Embedded C++', 'PHP', 'IoT', 'JavaScript', 'MySQL'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=400&fit=crop',
    category: 'Hardware/IoT',
  },
  {
    title: 'React TextUtils',
    description: 'A specialized React utility application for text manipulation. Features include real-time case conversion (Upper/Lower), extra space removal, reading time calculations, and text-to-speech capabilities.',
    tech: ['React', 'JavaScript', 'HTML5', 'CSS3'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    // github: 'https://github.com/arslanasif9t9/react-text',
    live: 'https://arslanasif9t9.github.io/react-text/',
    category: 'React Tool',
  },
  {
    title: 'iCoder Bootstrap Portal',
    description: 'A modern, responsive coding blog and educational template built using the Bootstrap framework. Focuses on high-quality UI components, clean typography, and mobile-first design principles.',
    tech: ['Bootstrap 5', 'HTML5', 'CSS3', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop',
    // github: 'https://github.com/Arslanasif9t9/iCoder_Bootstrap',
    live: 'https://arslanasif9t9.github.io/iCoder_Bootstrap/',
    category: 'Frontend',
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 px-4 relative group">
      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-secondary/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of full-stack web applications and developer tools I've built
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>



        {/* View All Button */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-full
                      border border-secondary/50 text-secondary hover:bg-secondary/10
                      transition-all duration-300"
          >
            View All Projects
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

export default ProjectsSection;
