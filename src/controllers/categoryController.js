import {
  getCategory as getCategoryService,
  getQuizByCate as getQuizByCateService,
  createCategory as createCategoryService,
} from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const data = await createCategoryService(name);

    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const data = await getCategoryService();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getQuizByCate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getQuizByCateService(id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
