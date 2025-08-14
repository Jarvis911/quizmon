import { createQuiz, addMedia, getQuizByUser, getQuestionByQuiz, updateQuiz, deleteQuiz} from "../services/quizService.js"

export const createAQuiz = async (req, res) => {
    const {title, description, isPublic} = req.body;
    const userId = req.userId;

    try {
        const data = await createQuiz(title, description, isPublic, userId);
        return res.status(201).json(data);
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

export const updateMedia = async (req, res) => {
    const {type, url, startTime, duration} = req.body;
    const { id } = req.params;

    try {
        const data = await addMedia(type, url, startTime, duration, id);
        return res.status(200).json(data);
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

export const queryQuizOfUser = async (req, res) => {
    const { id } = req.userId;
    try {
        const data = await getQuizByUser(id);
        return res.status(200).json(data);
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

export const queryQuestionOfQuiz = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await getQuestionByQuiz(id);
        return res.status(200).json(data);
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

export const updateAQuiz = async (req, res) => {
    const {title, description, isPublic} = req.body;
    const { userId } = req.userId;
    const { id } = req.params;

    try {
        const data = await updateQuiz(title, description, isPublic, id, userId);
        return res.status(200).json(data);
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

export const deleteAQuiz = async (req, res) => {
    const { userId } = req.userId;
    const { id } = req.params;

    try {
        const data = await deleteQuiz(id, userId);
        return res.status(204)
    } catch (err) {
        return res.err(400).json({message: err.message});
    }
};

