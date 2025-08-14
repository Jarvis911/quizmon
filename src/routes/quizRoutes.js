import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {createAQuiz, updateMedia, queryQuizOfUser, queryQuestionOfQuiz, updateAQuiz, deleteAQuiz} from "../controllers/quizController.js";

const router = express.Router();

router.post('/', authMiddleware, createAQuiz);
router.post('/:id/media', authMiddleware, upload.single("file"), updateMedia);
router.get('/', authMiddleware, queryQuizOfUser);
router.get('/:id/question', queryQuestionOfQuiz);
router.put('/:id', authMiddleware, updateAQuiz);
router.delete('/:id', authMiddleware, deleteAQuiz);

export default router;
