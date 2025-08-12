import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, description } = req.body;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        creatorId: req.userId
      }
    });

    res.json(quiz);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.get("/", async (req, res) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            where: {
                creatorId: req.userId
            }
        })

        res.json(quizzes)
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        await prisma.quiz.delete({
            where: {
                id: Number(id),
                creatorId: req.userId
            }
        })

        res.sendStatus(204)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router;
