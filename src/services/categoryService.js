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
