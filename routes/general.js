import express from "express";
import { signup, login, logout } from "../controllers/general.js";

const router = express.Router();

// Route for signing up a new user
router.post("/signup", signup);

// Route for logging in a user
router.post("/login", login);

// Route for logging out a user
router.post("/logout", logout);

export default router;
