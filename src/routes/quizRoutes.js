import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {getQuiz, createQuiz} from "../controllers/quizController.js";

const router = express.Router();

router.post('/', authMiddleware, upload.single("file"), createQuiz);
router.get('/', authMiddleware, getQuiz);
// router.post('/:id/media', authMiddleware, upload.single("file"), updateMedia);
// router.get('/:id/question', queryQuestionOfQuiz);
// router.put('/:id', authMiddleware, updateAQuiz);
// router.delete('/:id', authMiddleware, deleteAQuiz);

export default router;
