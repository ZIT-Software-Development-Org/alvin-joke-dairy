import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaFire, FaPlus, FaComment, FaUser, FaBars, FaEdit, FaTrash, FaShare, FaThumbsUp, FaSignOutAlt
} from 'react-icons/fa';
import { Joke, Comment, User } from '../types';
import * as authService from '../services/authService';
import * as jokeService from '../services/jokeService';

// Using types imported from '../types'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User state from session
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Additional state for creating and editing jokes
  const [newJokeTitle, setNewJokeTitle] = useState('');
  const [newJoke, setNewJoke] = useState('');
  const [editJokeId, setEditJokeId] = useState<number | null>(null);
  const [editJokeTitle, setEditJokeTitle] = useState('');
  const [editJokeContent, setEditJokeContent] = useState('');
  
  // Comment state
  const [commentText, setCommentText] = useState('');
  const [activeCommentJokeId, setActiveCommentJokeId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Check user session on component mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await authService.checkSession();
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    
    checkUserSession();
  }, []);

  // Fetch jokes from the API
  useEffect(() => {
    const fetchJokes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const jokesData = await jokeService.getAllJokes(activeTab);
        setJokes(jokesData);
      } catch (err: any) {
        console.error('Error fetching jokes:', err);
        setError('Failed to fetch jokes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJokes();
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Different API endpoints could be called based on tab
    // For now, we'll just use the same endpoint
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Create (POST): Add a new joke
  const handleNewJokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJokeTitle.trim() || !newJoke.trim()) {
      setError('Please provide both a title and content for your joke');
      return;
    }
    
    if (!isAuthenticated) {
      setError('You must be logged in to post a joke');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the joke via API
      await jokeService.createJoke(newJokeTitle, newJoke);
      
      // Refresh the jokes list to include the new joke
      const updatedJokes = await jokeService.getAllJokes(activeTab);
      setJokes(updatedJokes);
      
      setNewJokeTitle('');
      setNewJoke('');
      setActiveTab('latest'); // Switch to latest view after posting
    } catch (err: any) {
      console.error('Error creating joke:', err);
      setError('Failed to create joke. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete (DELETE): Remove a joke if it belongs to the current user
  const handleDeleteJoke = async (id: number) => {
    if (!isAuthenticated) {
      setError('You must be logged in to delete a joke');
      return;
    }
    
    setIsLoading(true);
    try {
      await jokeService.deleteJoke(id);
      const updatedJokes = jokes.filter(joke => joke.id !== id);
      setJokes(updatedJokes);
    } catch (err: any) {
      console.error('Error deleting joke:', err);
      setError('Failed to delete joke. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update (PUT): Start editing a joke
  const handleEditClick = (joke: Joke) => {
    setEditJokeId(joke.id);
    setEditJokeTitle(joke.title);
    setEditJokeContent(joke.content);
  };

  // Submit the edit update
  const handleEditSubmit = async (id: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!editJokeTitle.trim() || !editJokeContent.trim()) {
      setError('Please provide both a title and content for your joke');
      return;
    }
    
    if (!isAuthenticated) {
      setError('You must be logged in to edit a joke');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await jokeService.updateJoke(id, editJokeTitle, editJokeContent);
      
      const updatedJokes = jokes.map(joke => {
        if (joke.id === id) {
          return { ...joke, title: editJokeTitle, content: editJokeContent };
        }
        return joke;
      });
      
      setJokes(updatedJokes);
      setEditJokeId(null);
      setEditJokeTitle('');
      setEditJokeContent('');
    } catch (err: any) {
      console.error('Error updating joke:', err);
      setError('Failed to update joke. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditJokeId(null);
    setEditJokeContent('');
  };

  // Like a joke
  const handleLike = async (id: number) => {
    if (!isAuthenticated) {
      setError('You must be logged in to like a joke');
      return;
    }
    
    try {
      const response = await jokeService.likeJoke(id);
      
      const updatedJokes = jokes.map(joke => {
        if (joke.id === id) {
          return { ...joke, likes: response.likes };
        }
        return joke;
      });
      
      setJokes(updatedJokes);
    } catch (err: any) {
      console.error('Error liking joke:', err);
      setError('Failed to like joke. Please try again.');
    }
  };

  // Share a joke
  const handleShare = async (id: number) => {
    try {
      // Create a shareable link
      const shareableLink = `${window.location.origin}/jokes/${id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this joke!',
          text: 'I found this funny joke on JokeDiary',
          url: shareableLink,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareableLink);
        alert('Link copied to clipboard!');
      }
      
      // Track shares in the backend
      await jokeService.trackShare(id);
    } catch (err: any) {
      console.error('Error sharing joke:', err);
      // Don't show error for share cancellations
      if (err.name !== 'AbortError') {
        setError('Failed to share joke. Please try again.');
      }
    }
  };

  // Handle comment section toggle
  const handleComment = (id: number) => {
    if (activeCommentJokeId === id) {
      // If already open, close it
      setActiveCommentJokeId(null);
    } else {
      // Open comment section for this joke
      setActiveCommentJokeId(id);
      // Fetch comments for this joke
      fetchComments(id);
    }
  };
  
  // Fetch comments for a joke
  const fetchComments = async (jokeId: number) => {
    try {
      const commentsData = await jokeService.getJokeComments(jokeId);
      setComments(commentsData);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    }
  };
  
  // Add a comment to a joke
  const addComment = async (jokeId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }
    
    if (!isAuthenticated) {
      setError('You must be logged in to comment');
      return;
    }
    
    try {
      // Add the comment via API
      const newComment = await jokeService.addComment(jokeId, commentText);
      
      // Add the new comment to the state
      setComments([...comments, newComment]);
      
      // Update comment count in the joke
      const updatedJokes = jokes.map(joke => {
        if (joke.id === jokeId) {
          return { ...joke, comments: joke.comments + 1 };
        }
        return joke;
      });
      
      setJokes(updatedJokes);
      setCommentText('');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-teal-600">JokeDiary</h1>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaBars className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-teal-600 font-medium">
                    {currentUser?.username}
                  </span>
                  <button 
                    onClick={() => authService.logout().then(() => window.location.reload())}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  <FaUser className="mr-2" /> Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-teal-600 font-medium">
                    {currentUser?.username}
                  </div>
                  <button 
                    onClick={() => authService.logout().then(() => window.location.reload())}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <FaUser className="mr-2" /> Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          <button
            onClick={() => handleTabChange('latest')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'latest'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaHome className="mr-2" /> Latest
          </button>
          <button
            onClick={() => handleTabChange('trending')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'trending'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaFire className="mr-2" /> Trending
          </button>
          <button
            onClick={() => handleTabChange('post')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'post'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaPlus className="mr-2" /> Post Joke
          </button>
        </div>

        {/* Conditional content: either the Post form or the Jokes Feed */}
        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        )}
        
        {activeTab === 'post' ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create a New Joke</h2>
            <form onSubmit={handleNewJokeSubmit}>
              <div className="mb-4">
                <label htmlFor="jokeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="jokeTitle"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Give your joke a catchy title..."
                  value={newJokeTitle}
                  onChange={(e) => setNewJokeTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="jokeContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="jokeContent"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Write your joke here..."
                  value={newJoke}
                  onChange={(e) => setNewJoke(e.target.value)}
                  required
                  rows={4}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Joke'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {jokes.map((joke) => (
              <React.Fragment key={joke.id}>
                <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.01]">
                  <div className="flex items-start justify-between">
                    <div className="w-full">
                      {editJokeId === joke.id ? (
                        <form onSubmit={(e) => handleEditSubmit(joke.id, e)}>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md mb-2"
                              value={editJokeTitle}
                              onChange={(e) => setEditJokeTitle(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content
                            </label>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-md mb-2"
                              value={editJokeContent}
                              onChange={(e) => setEditJokeContent(e.target.value)}
                              required
                              rows={3}
                            ></textarea>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold text-teal-800 mb-2">{joke.title}</h3>
                          <p className="text-gray-900 text-lg">{joke.content}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-sm text-gray-500">By {joke.author}</span>
                            <span className="text-sm text-gray-500">• {joke.createdAt}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(joke.id)}
                      className="flex items-center text-gray-600 hover:text-teal-600"
                    >
                      <FaThumbsUp className="h-5 w-5 mr-1" />
                      {joke.likes}
                    </button>
                    <button 
                      onClick={() => handleComment(joke.id)}
                      className="flex items-center text-gray-600 hover:text-teal-600"
                    >
                      <FaComment className="h-5 w-5 mr-1" />
                      {joke.comments}
                    </button>
                    <button 
                      onClick={() => handleShare(joke.id)}
                      className="flex items-center text-gray-600 hover:text-teal-600"
                    >
                      <FaShare className="h-5 w-5 mr-1" />
                      Share
                    </button>
                    {/* Only allow edit and delete if the joke was created by the current user */}
                    {isAuthenticated && currentUser && joke.user_id === currentUser.id && (
                      <>
                        <button 
                          onClick={() => handleEditClick(joke)}
                          className="flex items-center text-gray-600 hover:text-teal-600"
                        >
                          <FaEdit className="h-5 w-5 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJoke(joke.id)}
                          className="flex items-center text-gray-600 hover:text-red-600"
                        >
                          <FaTrash className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Comment section */}
                {activeCommentJokeId === joke.id && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-lg font-medium mb-2">Comments</h4>
                    
                    {/* Comment list */}
                    <div className="space-y-3 mb-4">
                      {comments.length > 0 ? (
                        comments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-800">{comment.content}</p>
                            <div className="mt-1 flex items-center space-x-2">
                              <span className="text-xs text-gray-500">By {comment.author}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                      )}
                    </div>
                    
                    {/* Add comment form */}
                    <form onSubmit={(e) => addComment(joke.id, e)} className="mt-3">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        rows={2}
                      ></textarea>
                      <button
                        type="submit"
                        className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700"
                        disabled={!commentText.trim()}
                      >
                        Post Comment
                      </button>
                    </form>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
