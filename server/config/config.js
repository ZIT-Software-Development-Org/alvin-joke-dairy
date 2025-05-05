//config.js
// This file contains the configuration settings for the database connection.
// The configuration settings are stored in an object and exported as a default module.

import dotenv from "dotenv";
dotenv.config();

// Determine the current environment if NODE_ENV is not avaliable, (default to 'development')
const env = process.env.NODE_ENV || "development";
const config = {
  development: {
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
     
  },
};

export default config;