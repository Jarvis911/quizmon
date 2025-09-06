import prisma from "../prismaClient.js";

export const createMatchService = async ({ quizId, hostId }) => {
  return prisma.match.create({
    data: {
      quizId: Number(quizId),
      hostId: Number(hostId),
    },
  });
};

export const getMatchService = async (id) => {
  return prisma.match.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      quiz: {
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
            select: { id: true, name: true },
          },
        },
      },
       host: true,
        matchResults: true,
    },
  });
};

export const updateMatchService = async (matchId, data) => {
  return prisma.match.update({
    where: {
      id: Number(matchId)
    },
    data,
    include: {
      quiz: {
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
            select: { id: true, name: true },
          },
        },
      },
      host: true,
      matchResults: true,
  }})
}
