export const siteConfig = {
  name: 'Navaa',
  description: 'Your music learning platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.jpg',
  links: {
    twitter: 'https://twitter.com/navaa',
    github: 'https://github.com/navaa/navaa',
  },
};

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};
