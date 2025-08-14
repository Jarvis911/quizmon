import prisma from "../prismaClient.js";
import cloudinary from "../utils/cloudinary.js";
import { MediaType } from "@prisma/client";

export const createQuiz = async (title, description, isPublic, userId) => {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        isPublic: !!isPublic,
        creatorId: userId,
      },
    });

    return { quiz };
  } catch (err) {
    console.log(err.message);
    throw new err();
  }
};

export const addMedia = async (type, url, startTime, duration, quizId) => {
  try {
    if (type === MediaType.IMAGE) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "quiz-media" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const media = await prisma.quizMedia.create({
        data: {
          quizId: Number(quizId),
          type,
          url: uploadResult.secure_url,
        },
      });

      return { media };
    }

    if (type === MediaType.VIDEO) {
      const media = await prisma.quizMedia.create({
        data: {
          quizId: Number(id),
          type,
          url,
          startTime: Number(startTime),
          duration: Number(duration),
        },
      });

      return { media };
    }
  } catch (err) {
    console.log(err);
    throw new err;
  }
};

export const getQuizByUser = async (userId) => {
    try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        creatorId: userId,
      },
    });

    return { quizzes };
  } catch (err) {
    console.log(err.message);
    throw new err;
  }
};

export const getQuestionByQuiz = async (quizId) => {
    try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: Number(quizId),
      },
    });

    return { questions };
  } catch (err) {
    console.log(err.message);
    throw new err;
  }
};


export const updateQuiz = async (title, description, isPublic, quizId, userId) => {
    try {
    const quiz = await prisma.quiz.update({
      where: {
        id: Number(quizId),
        creatorId: userId,
      },
      data: {
        title: title,
        description: description,
        isPublic: !!isPublic,
      },
    });

    return { quiz };
  } catch (err) {
    console.log(err.message);
    throw new err;
  }
};


export const deleteQuiz = async (quizId, userId) => {
    try {
    await prisma.quiz.delete({
      where: {
        id: Number(quizId),
        creatorId: userId,
      },
    });

    return {message: "Deleted successful!"};
  } catch (err) {
    console.log(err.message);
    throw new err;
  }
};