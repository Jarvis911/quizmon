import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createButtonQuestion } from "../controllers/questionController.js";

const router = express.Router();

router.post('/buttons', authMiddleware, upload.array('files', 5), createButtonQuestion);


export default router;
