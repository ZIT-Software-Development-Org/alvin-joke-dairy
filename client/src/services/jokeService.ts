import axios from 'axios';
import { Joke, Comment } from '../types';

// Configure axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;

// Base URL for API requests
const API_URL = '/api';

/**
 * Get all jokes with optional sorting
 * @param sort Sort order ('latest' or 'trending')
 * @returns Promise with array of jokes
 */
export const getAllJokes = async (sort: string = 'latest'): Promise<Joke[]> => {
  const response = await axios.get(`${API_URL}/jokes`, { params: { sort } });
  return response.data;
};

/**
 * Get a single joke by ID
 * @param id Joke ID
 * @returns Promise with joke data
 */
export const getJokeById = async (id: number): Promise<Joke> => {
  const response = await axios.get(`${API_URL}/jokes/${id}`);
  return response.data;
};

/**
 * Create a new joke
 * @param title Joke title
 * @param content Joke content
 * @returns Promise with created joke data
 */
export const createJoke = async (title: string, content: string): Promise<Joke> => {
  const response = await axios.post(`${API_URL}/new-joke`, { title, content });
  return response.data;
};

/**
 * Update an existing joke
 * @param id Joke ID
 * @param title Updated joke title
 * @param content Updated joke content
 * @returns Promise with updated joke data
 */
export const updateJoke = async (id: number, title: string, content: string): Promise<Joke> => {
  const response = await axios.put(`${API_URL}/jokes/${id}`, { title, content });
  return response.data;
};

/**
 * Delete a joke
 * @param id Joke ID
 * @returns Promise that resolves when deletion is complete
 */
export const deleteJoke = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/jokes/${id}`);
};

/**
 * Get comments for a joke
 * @param jokeId Joke ID
 * @returns Promise with array of comments
 */
export const getJokeComments = async (jokeId: number): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/jokes/${jokeId}/comments`);
  return response.data;
};

/**
 * Add a comment to a joke
 * @param jokeId Joke ID
 * @param content Comment content
 * @returns Promise with created comment data
 */
export const addComment = async (jokeId: number, content: string): Promise<Comment> => {
  const response = await axios.post(`${API_URL}/jokes/${jokeId}/comments`, { content });
  return response.data;
};

/**
 * Like a joke
 * @param jokeId Joke ID
 * @returns Promise with updated like count
 */
export const likeJoke = async (jokeId: number): Promise<{ likes: number }> => {
  const response = await axios.post(`${API_URL}/jokes/${jokeId}/like`);
  return response.data;
};

/**
 * Unlike a joke
 * @param jokeId Joke ID
 * @returns Promise with updated like count
 */
export const unlikeJoke = async (jokeId: number): Promise<{ likes: number }> => {
  const response = await axios.delete(`${API_URL}/jokes/${jokeId}/like`);
  return response.data;
};

/**
 * Check if the current user has liked a joke
 * @param jokeId Joke ID
 * @returns Promise with like status
 */
export const checkLikeStatus = async (jokeId: number): Promise<{ liked: boolean }> => {
  const response = await axios.get(`${API_URL}/jokes/${jokeId}/like`);
  return response.data;
};

/**
 * Track when a joke is shared
 * @param jokeId Joke ID
 * @returns Promise that resolves when share is tracked
 */
export const trackShare = async (jokeId: number): Promise<void> => {
  await axios.post(`${API_URL}/jokes/${jokeId}/share`);
};
