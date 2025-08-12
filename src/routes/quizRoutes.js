import express from "express";
import prisma from "../prismaClient.js";
import cloudinary from "../utils/cloudinary.js";
import { MediaType } from "@prisma/client";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, description, isPublic } = req.body;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        isPublic: !!isPublic,
        creatorId: req.userId,
      },
    });

    res.json(quiz);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post("/:id/media", async (req, res) => {
  const { type, url, startTime, duration } = req.body;
  const { id } = req.params;

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
          quizId: Number(id),
          type,
          url: uploadResult.secure_url,
        },
      });

      res.json(media);
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

      res.json(media);
    }
  } catch (err) {
    console.log(err);
    res.status(503);
  }
});

router.get("/", async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        creatorId: req.userId,
      },
    });

    res.json(quizzes);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.get("/:id/question", async (req, res) => {
  const { id } = req.params;
  try {
    const questions = await prisma.findMany({
      where: {
        quizId: Number(id),
      },
    });

    res.json(questions);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.put("/:id", async (req, res) => {
  const { title, description, isPublic } = req.body;
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.update({
      where: {
        id: Number(id),
        creatorId: req.userId,
      },
      data: {
        title: title,
        description: description,
        isPublic: !!isPublic,
      },
    });

    res.json(quiz);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.quiz.delete({
      where: {
        id: Number(id),
        creatorId: req.userId,
      },
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
