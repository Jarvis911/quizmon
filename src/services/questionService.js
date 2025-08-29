import prisma from "../prismaClient.js";

// const createQuestionMedia = async (mediaData) => {
//   try {
//     const { type, url, startTime, duration, questionId } = mediaData;

//     const questionMedia = await prisma.questionMedia.create({
//       data: {
//         type,
//         url,
//         startTime,
//         duration,
//         questionId,
//       },
//     });

//     return questionMedia;
//   } catch (err) {
//     throw err;
//   }
// };

export const getRetrieveQuestion = async (questionId) => {
  try {
    const question = await prisma.question.findMany({
      where: {
        id: Number(questionId),
      },
      include: {
        button: true,
        checkbox: true,
        reorder: true,
        range: true,
        typeAnswer: true,
        location: true,
        media: true,
        options: true,
        quiz: {
          select: { id: true, title: true },
        },
    }});

    return question;
  } catch (err) {
    throw err;
  }
}

export const createQuestion = async (questionData) => {
  try {
    const {
      quizId,
      text,
      type,
      media,
      options,
      minValue,
      maxValue,
      correctValue,
      correctAnswer,
      correctLatitude,
      correctLongitude,
    } = questionData;

    const question = await prisma.question.create({
      data: {
        text,
        type,
        quizId,
        ...(type === "BUTTONS" && { button: { create: {} } }),
        ...(type === "CHECKBOXES" && { checkbox: { create: {} } }),
        ...(type === "REORDER" && { reorder: { create: {} } }),
        // If it is range, create child Range with additional value
        ...(type === "RANGE" && {
          range: {
            create: {
              minValue,
              maxValue,
              correctValue,
            },
          },
        }),
        // If it is type answer, create child TypeAnswer with additional value
        ...(type === "TYPEANSWER" && {
          typeAnswer: {
            create: { correctAnswer },
          },
        }),
        // If it is location, create child Location with additional value
        ...(type === "LOCATION" && {
          location: {
            create: {
              correctLatitude,
              correctLongitude,
            },
          },
        }),
        media: {
          // In case want to open to upload multiple images
          create: media.map((m) => ({
            type: m.type,
            url: m.url,
            startTime: m.startTime,
            duration: m.duration,
          })),
        },
        // Create options if options type
        options: options && {
          create: options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect || false,
            order: option.order,
          })),
        },
      },
      // Return following child 
      include: {
        button: true,
        checkbox: true,
        reorder: true,
        range: true,
        typeAnswer: true,
        location: true,
        media: true,
        options: true,
        quiz: {
          select: { id: true, title: true },
        },
      },
    });

    return question;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
