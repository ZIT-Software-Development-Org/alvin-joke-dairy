import express from "express";
import { isAuthenticated, isOwnerOrAdmin } from "../middleware/auth.js";

// Import controllers
import { allJokes, getJoke, createJoke, updateJoke, deleteJoke } from "../Controller/jokeController.js";
import { getJokeComments, createComment, deleteComment } from "../Controller/commentController.js";
import { likeJoke, unlikeJoke, checkLikeStatus, trackShare } from "../Controller/likeController.js";

const jokesRouter = express.Router();

// Joke routes
jokesRouter.get("/jokes", allJokes); // Get all jokes (public)
jokesRouter.get("/jokes/:id", getJoke); // Get a specific joke by ID (public)
jokesRouter.post("/new-joke", isAuthenticated, createJoke); // Create a new joke (authenticated)
jokesRouter.put("/jokes/:id", isAuthenticated, updateJoke); // Update a joke (authenticated + ownership check)
jokesRouter.delete("/jokes/:id", isAuthenticated, deleteJoke); // Delete a joke (authenticated + ownership check)

// Comment routes
jokesRouter.get("/jokes/:jokeId/comments", getJokeComments); // Get comments for a joke (public)
jokesRouter.post("/jokes/:jokeId/comments", isAuthenticated, createComment); // Add a comment to a joke (authenticated)
jokesRouter.delete("/comments/:commentId", isAuthenticated, deleteComment); // Delete a comment (authenticated + ownership check)

// Like routes
jokesRouter.post("/jokes/:jokeId/like", isAuthenticated, likeJoke); // Like a joke (authenticated)
jokesRouter.delete("/jokes/:jokeId/like", isAuthenticated, unlikeJoke); // Unlike a joke (authenticated)
jokesRouter.get("/jokes/:jokeId/like", isAuthenticated, checkLikeStatus); // Check if user has liked a joke (authenticated)

// Share tracking
jokesRouter.post("/jokes/:jokeId/share", trackShare); // Track when a joke is shared (public)

export default jokesRouter;