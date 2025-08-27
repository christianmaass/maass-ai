export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
