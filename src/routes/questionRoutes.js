import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import logMiddleware from "../middleware/logMiddleware.js"
import upload from "../middleware/uploadMiddleware.js";
import { createButtonQuestion,
        createCheckboxQuestion, 
        createRangeQuestion,
        createReorderQuestion,
        createLocationQuestion, 
        createTypeAnswerQuestion,
        getRetrieveQuestion } from "../controllers/questionController.js";

const router = express.Router();

router.post('/buttons', authMiddleware, logMiddleware, upload.array('files', 5), createButtonQuestion);
router.post('/checkboxes', authMiddleware, logMiddleware, upload.array('files', 5), createCheckboxQuestion);
router.post('/range', authMiddleware, logMiddleware, upload.array('files', 5), createRangeQuestion);
router.post('/reorder', authMiddleware, logMiddleware, upload.array('files', 5), createReorderQuestion);
router.post('/location', authMiddleware, logMiddleware, upload.array('files', 5), createLocationQuestion);
router.post('/typeanswer', authMiddleware, logMiddleware, upload.array('files', 5), createTypeAnswerQuestion);
router.get('/:id', getRetrieveQuestion);


export default router;
