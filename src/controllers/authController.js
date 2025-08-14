import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await registerUser(username, password);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await loginUser(username, password);
        return res.json(data);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
