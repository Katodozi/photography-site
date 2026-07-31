import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        gold: 'var(--gold)',
        'admin-bg': 'var(--admin-bg)',
        'admin-surface': 'var(--admin-surface)',
        'admin-border': 'var(--admin-border)',
        'admin-primary': 'var(--admin-primary)',
        'admin-accent': 'var(--admin-accent)',
        'admin-text': 'var(--admin-text)',
        'admin-muted': 'var(--admin-muted)',
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      boxShadow: {
        photo: '0 8px 32px rgba(0, 0, 0, 0.45)',
        glow: '0 0 48px rgba(94, 211, 61, 0.15)',
        'glow-gold': '0 0 40px rgba(216, 214, 109, 0.12)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        elevated: '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'hero-fallback':
          'radial-gradient(ellipse at 30% 20%, rgba(94,211,61,0.12) 0%, #050505 55%, #050505 100%)',
        'section-fade':
          'linear-gradient(180deg, var(--bg) 0%, var(--surface) 50%, var(--bg) 100%)',
        'mesh':
          'radial-gradient(at 40% 20%, rgba(94,211,61,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(216,214,109,0.06) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
