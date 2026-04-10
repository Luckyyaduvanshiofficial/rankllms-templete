import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  header: {
    main: [
      { label: 'Leaderboards', href: '/leaderboards/top-10' },
      { label: 'Best for Coding', href: '/leaderboards/coding' },
      { label: 'Offline / Local', href: '/leaderboards/offline' },
      { label: 'Cost Effective', href: '/leaderboards/cost-effective' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    cta: [{ label: 'Browse 300+ Models', href: '/leaderboards/top-50', variant: 'primary' }],
  },
  footer: {
    product: [
      { label: 'All Models (Top 50)', href: '/leaderboards/top-50' },
      { label: 'Best Coding Models', href: '/leaderboards/coding' },
      { label: 'Best Offline Models', href: '/leaderboards/offline' },
      { label: 'Most Cost Effective', href: '/leaderboards/cost-effective' },
    ],
    solutions: [
      { label: 'Methodology', href: '/about#methodology' },
      { label: 'Submit a Model', href: '/contact' },
    ],
    resources: [
      { label: 'Blog', href: '/blog', feature: 'blog' },
      { label: 'Documentation', href: '/docs', feature: 'docs' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
};
