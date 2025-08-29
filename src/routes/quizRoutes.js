import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {getQuiz, createQuiz, getRetrieveQuiz} from "../controllers/quizController.js";
import { getQuestionByQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.post('/', authMiddleware, upload.single("file"), createQuiz);
router.get('/', authMiddleware, getQuiz);
router.get('/:id/question', getQuestionByQuiz);
router.get('/:id', getRetrieveQuiz);


// router.post('/:id/media', authMiddleware, upload.single("file"), updateMedia);
// router.put('/:id', authMiddleware, updateAQuiz);
// router.delete('/:id', authMiddleware, deleteAQuiz);

export default router;
