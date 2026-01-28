import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

// const blogs = [
//   {
//     title: 'Building Scalable REST APIs with Node.js',
//     excerpt: 'Learn how to architect production-ready REST APIs using Express, middleware patterns, and best practices for enterprise deployment.',
//     date: 'Jan 15, 2026',
//     category: 'Backend',
//     readTime: '8 min read',
//     link: '#',
//   },
//   {
//     title: 'React Server Components: A Deep Dive',
//     excerpt: 'Understanding RSC architecture, streaming, and how they revolutionize data fetching in modern React applications.',
//     date: 'Jan 10, 2026',
//     category: 'React',
//     readTime: '12 min read',
//     link: '#',
//   },
//   {
//     title: 'TypeScript vs JavaScript in 2026',
//     excerpt: 'A comprehensive comparison of TypeScript and JavaScript, their ecosystems, and when to choose each for your projects.',
//     date: 'Jan 5, 2026',
//     category: 'TypeScript',
//     readTime: '10 min read',
//     link: '#',
//   },
//   {
//     title: 'Mastering Database Optimization',
//     excerpt: 'Step-by-step guide to optimizing PostgreSQL queries, indexing strategies, and connection pooling for high-traffic apps.',
//     date: 'Dec 28, 2025',
//     category: 'Database',
//     readTime: '15 min read',
//     link: '#',
//   },
//   {
//     title: 'Docker for Web Developers',
//     excerpt: 'Complete guide to containerizing web applications, multi-stage builds, and deployment with Docker Compose.',
//     date: 'Dec 20, 2025',
//     category: 'DevOps',
//     readTime: '11 min read',
//     link: '#',
//   },
//   {
//     title: 'Building Real-time Apps with WebSockets',
//     excerpt: 'Implementing real-time features in web applications using Socket.io, handling reconnection, and scaling strategies.',
//     date: 'Dec 15, 2025',
//     category: 'Full-Stack',
//     readTime: '9 min read',
//     link: '#',
//   },
// ];

const blogs = [
  {
    title: 'Architecting Multi-Vendor Systems in Laravel',
    excerpt: 'A deep dive into managing multiple dashboards (Admin, Vendor, Customer) and handling complex database relationships in a large-scale Laravel marketplace.',
    date: 'Jan 25, 2026',
    category: 'Backend',
    readTime: '12 min read',
    link: '#',
  },
  {
    title: 'Bridging Software and Hardware: IoT Parking Systems',
    excerpt: 'How I integrated PHP and MySQL with C++ embedded systems to create a real-time automatic car parking solution.',
    date: 'Jan 18, 2026',
    category: 'IoT',
    readTime: '10 min read',
    link: '#',
  },
  {
    title: 'Mastering the Laravel Admin Dashboard',
    excerpt: 'Best practices for building robust admin panels in Laravel, including role-based access control (RBAC) and efficient data filtering.',
    date: 'Jan 12, 2026',
    category: 'Full-Stack',
    readTime: '8 min read',
    link: '#',
  },
  {
    title: 'Text Manipulation in React: Beyond basic Hooks',
    excerpt: 'Lessons learned building TextUtils: How to handle complex string operations and real-time state updates in a React environment.',
    date: 'Jan 05, 2026',
    category: 'React',
    readTime: '6 min read',
    link: '#',
  },
  {
    title: 'Moving from Bootstrap to Tailwind CSS',
    excerpt: 'Why utility-first CSS is a game-changer for Laravel developers. Comparing workflow speed, bundle sizes, and design flexibility.',
    date: 'Dec 28, 2025',
    category: 'Design',
    readTime: '9 min read',
    link: '#',
  },
  {
    title: 'Scaling E-commerce Databases with MySQL',
    excerpt: 'A guide to optimizing database schemas for large inventory systems and tracking orders across multi-page e-commerce applications.',
    date: 'Dec 20, 2025',
    category: 'Database',
    readTime: '11 min read',
    link: '#',
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-20 px-4 relative group">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
      
      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 
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
            <span className="gradient-text-secondary">Blog & Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharing insights on web development, best practices, and software engineering
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.title} {...blog} />
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
            View All Articles
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

export default BlogSection;
