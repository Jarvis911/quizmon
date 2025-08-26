import {
  createQuiz as createQuizService,
  getQuiz as getQuizService
} from "../services/quizService.js";
import cloudinary from "../utils/cloudinary.js";

export const createQuiz = async (req, res) => {
  const { title, description, isPublic, categoryId } = req.body;
  const imageFile = req.file;
  let imageUrl = null;

  try {
    if (imageFile) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(imageFile.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const data = await createQuizService({
      title,
      description,
      image: imageUrl,
      isPublic,
      creatorId: req.userId,
      categoryId,
    });
    
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const data = await getQuizService(req.userId);
    return res.status(200).json(data);
  } catch (err) {
    return res.err(400).json({ message: err.message });
  }
};


// export const updateMedia = async (req, res) => {
//   const { type, url, startTime, duration } = req.body;
//   const { id } = req.params;

//   try {
//     const data = await addMedia(type, url, startTime, duration, id);
//     return res.status(200).json(data);
//   } catch (err) {
//     return res.err(400).json({ message: err.message });
//   }
// };



// export const queryQuestionOfQuiz = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const data = await getQuestionByQuiz(id);
//     return res.status(200).json(data);
//   } catch (err) {
//     return res.err(400).json({ message: err.message });
//   }
// };

// export const updateAQuiz = async (req, res) => {
//   const { title, description, isPublic } = req.body;
//   const { userId } = req.userId;
//   const { id } = req.params;

//   try {
//     const data = await updateQuiz(title, description, isPublic, id, userId);
//     return res.status(200).json(data);
//   } catch (err) {
//     return res.err(400).json({ message: err.message });
//   }
// };

// export const deleteAQuiz = async (req, res) => {
//   const { userId } = req.userId;
//   const { id } = req.params;

//   try {
//     const data = await deleteQuiz(id, userId);
//     return res.status(204);
//   } catch (err) {
//     return res.err(400).json({ message: err.message });
//   }
// };
