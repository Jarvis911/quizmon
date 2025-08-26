import { createQuestion as createQuestionService } from "../services/questionService.js";
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
