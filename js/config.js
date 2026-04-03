/* ============================================
   CONFIG — Site-wide configuration
   ============================================ */

const CONFIG = {
  site: {
    name: 'Louis',
    title: 'Louis — Developer Portfolio',
    description: 'Developer, builder, problem solver.',
    tagline: 'Building things that matter.',
  },

  // Social links
  socials: {
    github: 'https://github.com/toastaspiring',
    linkedin: 'https://linkedin.com/in/',
  },

  // Navigation
  nav: [
    { label: 'Home', path: '#/', key: 'home' },
    { label: 'Blog', path: '#/blog', key: 'blog' },
    { label: 'Projects', path: '#/projects', key: 'projects' },
    { label: 'About', path: '#/about', key: 'about' },
  ],

  // Blog settings
  blog: {
    postsPerPage: 10,
    excerptLength: 160,
  },

  // Available posts (add new posts here)
  posts: [
    'hello-world',
    'building-with-yolo',
  ],

  // Projects (add your projects here)
  projects: [
    {
      id: 'spixer',
      title: 'Spixer',
      description: 'AI-powered event photography platform with automated athlete identification and smart photo matching.',
      tags: ['AI/ML', 'Computer Vision', 'Full-Stack'],
      image: null,
      link: 'https://github.com/toastaspiring',
      featured: true,
    },
    {
      id: 'portfolio',
      title: 'This Portfolio',
      description: 'Zero-dependency static portfolio with custom SPA router, markdown blog engine, and advanced CSS animations.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: null,
      link: 'https://github.com/toastaspiring',
      featured: true,
    },
  ],
};
