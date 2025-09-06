import prisma from "../prismaClient.js";

export const createQuiz = async (quizData) => {
  try {
    const { title, description, image, isPublic, creatorId, categoryId } = quizData;
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        image,
        isPublic: !!isPublic,
        creatorId: Number(creatorId),
        categoryId: Number(categoryId)
      },
      include: {
        creator: {
            select: {id: true, username: true}
        },
        category: {
            select: {id: true, name:true}
        }
      }
    });

    return { quiz };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};


export const getQuiz = async (userId) => {
    try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        creatorId: Number(userId),
      },
    });

    return quizzes;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const getRetrieveQuiz = async (quizId) => {
    try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(quizId),
      },
      include: {
        questions: {
          include: {
            button: true,
            checkbox: true,
            reorder: true,
            range: true,
            typeAnswer: true,
            location: true,
            media: true,
            options: true,
          },
        },
        category: {
          select: {id: true, name:true}
        }
    }
    });

    return quiz;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};


export const getQuestionByQuiz = async (quizId) => {
    try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: Number(quizId),
      },
      include: {
        button: true,
        checkbox: true,
        reorder: true,
        range: true,
        typeAnswer: true,
        location: true,
        media: true,
        options: true
      }
    });

    return questions;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

