import { createQuestion as createQuestionService, getRetrieveQuestion as getRetrieveQuestionService } from "../services/questionService.js";
import cloudinary from "../utils/cloudinary.js";

// Upload multiple files
const uploadMedia = async (files, videos) => {
    const mediaData = [];

    // If image
    if (files) {
        for (const file of files) {
            if (!file.mimetype.startsWith('image/')) {
                throw new Error("Only image files are allowed for upload");
            }   
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(file.buffer);
            });
            mediaData.push({
                type: 'IMAGE',
                url: uploadResult.secure_url
            });
        }
    }

    // If video Youtube
    if (videos) {
        mediaData.push({
            type: 'VIDEO',
            url: videos.url,
            startTime: videos.startTime,
            duration: videos.duration
        });
    }

    return mediaData;
};

export const getRetrieveQuestion = async (req, res) => {
    const { id } = req.params
    try {
        const question = await getRetrieveQuestionService(id);

        return res.status(200).json(question);
    } catch (err) {
        return res.status(500).json({ message: "Server error during getting the question" });
    }
}

export const createButtonQuestion = async (req, res) => {
    const { quizId, text, options, videos } = req.body;
    const files = req.files;
    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "BUTTONS",
            media: questionMedia,
            options: JSON.parse(options)
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during button question creation" });
    }
};

export const createCheckboxQuestion = async (req, res) => {
    const { quizId, text, options, videos } = req.body;
    const files = req.files;

    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "CHECKBOXES",
            media: questionMedia,
            options: JSON.parse(options)
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during checkbox question creation" });
    }
}

export const createRangeQuestion = async (req, res) => {
    const { quizId, text, minValue, maxValue, correctValue, videos } = req.body;
    const files = req.files;

    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "RANGE",
            minValue: parseInt(minValue),
            maxValue: parseInt(maxValue),
            correctValue: parseInt(correctValue),
            media: questionMedia,
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during range question creation" });
    }
}

export const createReorderQuestion = async (req, res) => {
    const { quizId, text, options, videos } = req.body;
    const files = req.files;

    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "REORDER",
            media: questionMedia,
            options: JSON.parse(options)
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during reorder question creation" });
    }
}

export const createLocationQuestion = async (req, res) => {
    const { quizId, text, correctLatitude, correctLongitude, videos } = req.body;
    const files = req.files;

    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "LOCATION",
            correctLatitude: parseFloat(correctLatitude),
            correctLongitude: parseFloat(correctLongitude),
            media: questionMedia,
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during location question creation" });
    }
}

export const createTypeAnswerQuestion = async (req, res) => {
    const { quizId, text, correctAnswer, videos } = req.body;
    const files = req.files;

    try {
        const questionMedia = await uploadMedia(files ? files : null, videos ? JSON.parse(videos) : null);

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "TYPEANSWER",
            correctAnswer,
            media: questionMedia,
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during type answer question creation" });
    }
}
