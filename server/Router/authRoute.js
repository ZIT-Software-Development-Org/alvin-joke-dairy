import express from "express";
import { handleLogin, handleSignUp, checkSession, handleLogout } from "../Controller/authController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Authentication routes
router.post("/login", handleLogin);
router.post("/signup", handleSignUp);
router.post("/logout", handleLogout);

// Session check route
router.get("/session", isAuthenticated, checkSession);

export default router