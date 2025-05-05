import axios from 'axios';
import { User } from '../types';

// Configure axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;

// Base URL for API requests
const API_URL = '/api/auth';

/**
 * Check if user is currently logged in by validating session
 * @returns Promise with user data or null if not logged in
 */
export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/session`);
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with user data
 */
export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

/**
 * Register a new user
 * @param username User's full name
 * @param email User email
 * @param password User password
 * @returns Promise with user data
 */
export const register = async (username: string, email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/signup`, { fullname: username, email, password });
  return response.data;
};

/**
 * Logout the current user
 * @returns Promise that resolves when logout is complete
 */
export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/logout`);
};
