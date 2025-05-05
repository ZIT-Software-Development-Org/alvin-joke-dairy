import db from '../models/index.js';

// Get all jokes with optional filtering
export const allJokes = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { sort = 'latest' } = req.query;
        
        let order = [];
        if (sort === 'latest') {
            order = [['created_at', 'DESC']];
        } else if (sort === 'trending') {
            // For trending, we could order by likes count or some combination of metrics
            order = [['likes_count', 'DESC'], ['created_at', 'DESC']];
        }
        
        const rows = await db.Joke.findAll({
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                    as: 'User'
                }
            ],
            order,
            attributes: {
                include: [
                    [db.sequelize.literal('(SELECT COUNT(*) FROM "comments" WHERE "comments"."joke_id" = "Joke"."id")'), 'comments_count'],
                    [db.sequelize.literal('(SELECT COUNT(*) FROM "likes" WHERE "likes"."joke_id" = "Joke"."id")'), 'likes_count']
                ]
            }
        });
        
        // Transform the data to match the frontend expectations
        const formattedJokes = rows.map(joke => ({
            id: joke.id,
            title: joke.title,
            content: joke.content,
            author: joke.User ? joke.User.username : 'Unknown',
            user_id: joke.user_id,
            likes: joke.dataValues.likes_count || 0,
            comments: joke.dataValues.comments_count || 0,
            createdAt: joke.created_at
        }));
        
        res.json(formattedJokes);
    } catch (error) {
        console.error("Error fetching jokes:", error.message);
        res.status(500).json({ error: "Failed to fetch jokes" });
    }
};

// Get a single joke by ID
export const getJoke = async (req, res) => {
    try {
        const { id } = req.params;
        
        const joke = await db.Joke.findByPk(id, {
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                    as: 'User'
                }
            ],
            attributes: {
                include: [
                    [db.sequelize.literal('(SELECT COUNT(*) FROM "comments" WHERE "comments"."joke_id" = "Joke"."id")'), 'comments_count'],
                    [db.sequelize.literal('(SELECT COUNT(*) FROM "likes" WHERE "likes"."joke_id" = "Joke"."id")'), 'likes_count']
                ]
            }
        });
        
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        const formattedJoke = {
            id: joke.id,
            title: joke.title,
            content: joke.content,
            author: joke.User ? joke.User.username : 'Unknown',
            user_id: joke.user_id,
            likes: joke.dataValues.likes_count || 0,
            comments: joke.dataValues.comments_count || 0,
            createdAt: joke.created_at
        };
        
        res.json(formattedJoke);
    } catch (error) {
        console.error("Error fetching joke:", error.message);
        res.status(500).json({ error: "Failed to fetch joke" });
    }
};

// Create a new joke
export const createJoke = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        
        // Get user ID from session
        const user_id = req.session.userId;
        
        const joke = await db.Joke.create({
            title,
            content,
            user_id
        });
        
        res.status(201).json({
            id: joke.id,
            title: joke.title,
            content: joke.content,
            user_id: joke.user_id,
            createdAt: joke.created_at,
            message: "Joke created successfully"
        });
    } catch (error) {
        console.error("Error creating joke:", error.message);
        res.status(500).json({ error: "Failed to create joke" });
    }
};

// Update a joke
export const updateJoke = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        // Validate required fields
        if (!title && !content) {
            return res.status(400).json({ error: "Title or content is required" });
        }
        
        // Find the joke
        const joke = await db.Joke.findByPk(id);
        
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        // Check if the user is the owner of the joke
        if (joke.user_id !== req.session.userId) {
            return res.status(403).json({ error: "Unauthorized to update this joke" });
        }
        
        // Update the joke
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        
        await joke.update(updateData);
        
        res.json({
            id: joke.id,
            title: joke.title,
            content: joke.content,
            message: "Joke updated successfully"
        });
    } catch (error) {
        console.error("Error updating joke:", error.message);
        res.status(500).json({ error: "Failed to update joke" });
    }
};

// Delete a joke
export const deleteJoke = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the joke
        const joke = await db.Joke.findByPk(id);
        
        if (!joke) {
            return res.status(404).json({ error: "Joke not found" });
        }
        
        // Check if the user is the owner of the joke
        if (joke.user_id !== req.session.userId) {
            return res.status(403).json({ error: "Unauthorized to delete this joke" });
        }
        
        // Delete the joke
        await joke.destroy();
        
        res.json({ message: "Joke deleted successfully" });
    } catch (error) {
        console.error("Error deleting joke:", error.message);
        res.status(500).json({ error: "Failed to delete joke" });
    }
};
