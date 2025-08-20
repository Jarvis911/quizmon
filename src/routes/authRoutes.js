import express from "express";
import logMiddleware from "../middleware/logMiddleware.js"
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', logMiddleware, login);

export default router;