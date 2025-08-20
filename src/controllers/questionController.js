import { createQuestion as createQuestionService } from "../services/questionService.js";
import cloudinary from "../utils/cloudinary.js";

// Upload multiple files
const uploadMedia = async (files) => {
    const mediaUrls = [];
    if (files && files.length > 0) {
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
            mediaUrls.push({
                type: 'IMAGE',
                url: uploadResult.secure_url
            });
        }
    }
    return mediaUrls;
};

export const createButtonQuestion = async (req, res) => {
    const { quizId, text, options } = req.body;
    const mediaFiles = req.files;

    try {
        const imageMedia = await uploadMedia(mediaFiles);

        const media = [
            ...imageMedia,
            
        ]

        const questionData = {
            quizId: parseInt(quizId),
            text,
            type: "BUTTONS",
            media: mediaUrls,
            options: JSON.parse(options)
        };

        const newQuestion = await createQuestionService(questionData, req.userId);
        return res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error during button question creation" });
    }
};
