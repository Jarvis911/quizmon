import {
  createQuiz as createQuizService,
  getQuiz as getQuizService,
  getQuestionByQuiz as getQuestionByQuizService,
  getRetrieveQuiz as getRetrieveQuizService
} from "../services/quizService.js";
import cloudinary from "../utils/cloudinary.js";
import prisma from "../prismaClient.js";

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
    return res.status(400).json({ message: err.message });
  }
};

export const getRetrieveQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getRetrieveQuizService(id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};



export const getQuestionByQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await getQuestionByQuizService(id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getQuizRating = async (req, res) => {
  const { id } = req.params;

  try {
    const ratings = await prisma.quizRating.findMany({
      where: { quizId: Number(id) },
      select: {
        id: true,
        userId: true,
        rating: true,
        text: true
      },
    });

    const avgScore =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return res.status(200).json({
      average: avgScore,
      count: ratings.length,
      ratings,
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const checkUserRateQuiz = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const existingRating = await prisma.quizRating.findFirst({
      where: {
        userId: Number(userId),
        quizId: Number(id),
      },
    });

    return res.status(200).json({ rated: !!existingRating });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


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
