import express from "express";
import { createCategory, getCategory,  getQuizByCate} from "../controllers/categoryController.js";

const router = express.Router();

router.post('/', createCategory);
router.get('/', getCategory);
router.get('/quiz', getQuizByCate);

export default router;
