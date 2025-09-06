import { createMatchService, getMatchService, updateMatchService } from "../services/matchService.js";

export const createMatch = async (req, res) => {
    try {
        const { quizId } = req.body;
        const hostId = req.userId;
        const match = await createMatchService({quizId, hostId});

        res.status(201).json(match);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await getMatchService(id);
        res.status(200).json(match);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await updateMatchService({matchId: id, data: req.body});
        res.status(200).json(match);
    } catch (err) {
        res.status(500).json(err);
    }
}

