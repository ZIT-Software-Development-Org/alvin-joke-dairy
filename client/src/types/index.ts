// Define common types used throughout the application

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Joke {
  id: number;
  title: string;
  content: string;
  author: string;
  user_id: number;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  joke_id: number;
  author: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
