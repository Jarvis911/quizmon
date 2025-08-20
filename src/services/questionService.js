import prisma from "../prismaClient.js";

export const createQuestion = async (questionData) => {
    try {
        const { quizId, text, type, media, options, minValue, maxValue, correctValue, correctAnswer, correctLatitude, correctLongitude } = questionData;

        const question = await prisma.question.create({
            data: {
                text,
                type,
                quizId,
                ...(type === "BUTTONS" && { button: { create: {} }}),
                ...(type === "CHECKBOXES" && { checkbox: { create: {} }}),
                ...(type === "REORDER" && { reorder: { create: {} }}),
                ...(type === "RANGE" && {
                    range: {
                        create: {
                            minValue,
                            maxValue,
                            correctValue
                        }
                    }
                }),
                ...(type === "TYPE_ANSWER" && {
                    typeAnswer: {
                        create: { correctAnswer }
                    }
                }),
                ...(type === "LOCATION" && {
                    location: {
                        create: {
                            correctLatitude,
                            correctLongitude
                        }
                    }
                }),
                media: {
                    // Potential bug
                    create: media.map(m => ({
                        type: m.type,
                        url: m.url,
                        startTime: m.startTime,
                        duration: m.duration
                    }))
                },
                options: options && {
                    create: options.map(option => ({
                        text: option.text,
                        isCorrect: option.isCorrect || false,
                        order: option.order
                    }))
                }
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
                    select: { id: true, title: true }
                }
            }
        });

        return question;
    } catch (err) {
        console.error(err.message)
        throw err;
    }
}