import db from '../models/index.js';

// Get comments for a specific joke
export const getJokeComments = async (req, res) => {
    try {
        const { jokeId } = req.params;
        
        const comments = await db.Comment.findAll({
            where: { joke_id: jokeId },
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                    as: 'User'
                }
            ],
            order: [['created_at', 'DESC']]
        });
        
        // Format comments to match frontend expectations
        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            user_id: comment.user_id,
            joke_id: comment.joke_id,
            author: comment.User ? comment.User.username : 'Unknown',
            created_at: comment.created_at
        }));
        
        res.json(formattedComments);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { jokeId } = req.params;
        const { content } = req.body;
        
        // Validate required fields
        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }
        
        // Get user ID from session
        const user_id = req.session.userId;
        
        // Verify the joke exists
        const joke = await db.Joke.findByPk(jokeId);
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        // Create the comment
        const comment = await db.Comment.create({
            content,
            user_id,
            joke_id: parseInt(jokeId)
        });
        
        // Get the username for the response
        const user = await db.User.findByPk(user_id, {
            attributes: ['username']
        });
        
        res.status(201).json({
            id: comment.id,
            content: comment.content,
            user_id: comment.user_id,
            joke_id: comment.joke_id,
            author: user ? user.username : 'Unknown',
            created_at: comment.created_at,
            message: "Comment added successfully"
        });
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(500).json({ error: "Failed to create comment" });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        // Find the comment
        const comment = await db.Comment.findByPk(commentId);
        
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        // Check if the user is the owner of the comment
        if (comment.user_id !== req.session.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this comment" });
        }
        
        // Delete the comment
        await comment.destroy();
        
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};
