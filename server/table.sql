-- Users Table
CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- joke tabe
CREATE TABLE jokes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    joke_id INT REFERENCES jokes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes Table (Many-to-Many)
CREATE TABLE likes (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    joke_id INT REFERENCES jokes(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, joke_id)
);