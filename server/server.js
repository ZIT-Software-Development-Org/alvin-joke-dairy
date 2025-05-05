import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import db from './models/index.js';
import router from './Router/authRoute.js';
import jokesRouter from './Router/JokeRoute.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
const { Pool } = pkg;  // Destructure Pool from CommonJS export of pg



const app = express();
const PORT = process.env.PORT ; // Match the port in your image URL
// Set up native PostgreSQL pool for session store

// Validate SESSION_SECRET
const SESSION_SECRET = process.env.SESSION_SECRET;


// Initialize PostgreSQL connection pool for sessions
const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 20000,
});
// Session store configuration
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,  // Use validated SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  })
);

// Middleware
app.use(cors({
  origin: "http://localhost:4000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/", jokesRouter);
app.use('/api/auth', router);
app.get('/test', (req, res) => res.json({ message: 'Server is running!' }));
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', uptime: process.uptime() }));

// Database connection test
const testDatabaseConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Start server
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    testDatabaseConnection();
  });
};

startServer();