import prisma from "../prismaClient.js";

export const createCategory = async (name) => {
  try {
    const newCategory = await prisma.quizCategory.create({
      data: {
        name
      },
    });

    return newCategory ;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};


export const getCategory = async () => {
  try {
    const categories = await prisma.quizCategory.findMany();

    return categories;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}


export const getQuizByCate = async(categoryId) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        categoryId: Number(categoryId),
        isPublic: true
      },
      include: {
        creator: {
            select: {id: true, username: true}
        }
      }
    })

    return quizzes;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
