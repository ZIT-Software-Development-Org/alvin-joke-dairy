import db from '../models/index.js';

// Like a joke
export const likeJoke = async (req, res) => {
    try {
        const { jokeId } = req.params;
        const user_id = req.session.userId;
        
        // Verify the joke exists
        const joke = await db.Joke.findByPk(jokeId);
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        // Check if the user has already liked this joke
        const existingLike = await db.Like.findOne({
            where: {
                user_id,
                joke_id: jokeId
            }
        });
        
        if (existingLike) {
            return res.status(400).json({ error: "You have already liked this joke" });
        }
        
        // Create the like
        await db.Like.create({
            user_id,
            joke_id: parseInt(jokeId)
        });
        
        // Get the updated like count
        const likeCount = await db.Like.count({
            where: { joke_id: jokeId }
        });
        
        res.status(201).json({
            message: "Joke liked successfully",
            likes: likeCount
        });
    } catch (error) {
        console.error("Error liking joke:", error.message);
        res.status(500).json({ error: "Failed to like joke" });
    }
};

// Unlike a joke
export const unlikeJoke = async (req, res) => {
    try {
        const { jokeId } = req.params;
        const user_id = req.session.userId;
        
        // Find the like
        const like = await db.Like.findOne({
            where: {
                user_id,
                joke_id: jokeId
            }
        });
        
        if (!like) {
            return res.status(404).json({ error: "Like not found" });
        }
        
        // Delete the like
        await like.destroy();
        
        // Get the updated like count
        const likeCount = await db.Like.count({
            where: { joke_id: jokeId }
        });
        
        res.json({
            message: "Joke unliked successfully",
            likes: likeCount
        });
    } catch (error) {
        console.error("Error unliking joke:", error.message);
        res.status(500).json({ error: "Failed to unlike joke" });
    }
};

// Check if a user has liked a joke
export const checkLikeStatus = async (req, res) => {
    try {
        const { jokeId } = req.params;
        const user_id = req.session.userId;
        
        const like = await db.Like.findOne({
            where: {
                user_id,
                joke_id: jokeId
            }
        });
        
        res.json({
            liked: !!like
        });
    } catch (error) {
        console.error("Error checking like status:", error.message);
        res.status(500).json({ error: "Failed to check like status" });
    }
};

// Track joke shares (for analytics)
export const trackShare = async (req, res) => {
    try {
        const { jokeId } = req.params;
        
        // Verify the joke exists
        const joke = await db.Joke.findByPk(jokeId);
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        // In a real application, you might have a Share model to track shares
        // For now, we'll just return a success message
        
        res.json({
            message: "Share tracked successfully"
        });
    } catch (error) {
        console.error("Error tracking share:", error.message);
        res.status(500).json({ error: "Failed to track share" });
    }
};
