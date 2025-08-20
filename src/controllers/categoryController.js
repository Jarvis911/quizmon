import { createCategory as createCategoryService } from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const data = await createCategoryService(name);

    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
