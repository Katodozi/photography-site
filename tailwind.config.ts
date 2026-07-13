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
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
