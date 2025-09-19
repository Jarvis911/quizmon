import prisma from "../prismaClient.js";

export const postRating = async (req, res) => {
  const userId = req.userId;
  const { quizId, rating, text } = req.body;

  try {
    const isPlayed = await prisma.matchResult.findFirst({
      where: {
        userId: userId,
        match: {
            quizId: quizId,
        }
      }, include: {
        match: true
      }
    });

    if (!isPlayed) {
      return res.status(400).json({ message: "Bạn chưa từng chơi quiz này" });
    }

    const existingRating = await prisma.quizRating.findFirst({
      where: {
        userId: userId,
        quizId: quizId,
      },
    });

    if (existingRating) {
      return res.status(400).json({ message: "Bạn đã đánh giá quiz này rồi" });
    }

    const quiz_rating = await prisma.quizRating.create({
      data: {
        userId: userId,
        quizId: quizId,
        rating: rating,
        text: text 
      },
    });

    return res.status(201).json(quiz_rating);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

