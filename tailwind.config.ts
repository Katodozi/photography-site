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
        glow: '0 0 48px rgba(143, 168, 136, 0.12)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'hero-fallback':
          'radial-gradient(ellipse at 30% 20%, #1a2219 0%, #0a0a0a 50%, #0a0a0a 100%)',
        'section-fade':
          'linear-gradient(180deg, var(--bg) 0%, var(--surface) 50%, var(--bg) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
