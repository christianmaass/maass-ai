import { clientEnv } from '@/lib/config/env.client';
import { serverEnv } from '@/lib/config/env.server';

export const siteConfig = {
  name: 'Navaa',
  description: 'Decision OS - Make better decisions. Every time.',
  url: clientEnv.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.jpg',
  links: {
    twitter: 'https://twitter.com/navaa',
    github: 'https://github.com/navaa/navaa',
  },
};

export const supabaseConfig = {
  url: clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: serverEnv.SUPABASE_SERVICE_ROLE_KEY,
};
