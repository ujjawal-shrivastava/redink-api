const { sendMail } = require("../utils/mail");
//express
const express = require("express");
const router = express.Router();

// prisma
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const AUTHOR_FIELDS = {
  id: true,
  name: true,
  email: true,
};

const POST_FIELDS = {
  id: true,
  title: true,
  description: true,
  author: { select: AUTHOR_FIELDS },
  createdAt: true,
  updatedAt: true,
};

// Get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      select: POST_FIELDS,
    });
    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
});

// Get all posts with authorId
router.get("/author/:id", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      select: { ...POST_FIELDS, author: false },
      where: {
        authorId: req.params.id,
      },
    });

    posts.length > 0
      ? res.status(200).send(posts)
      : res.status(404).send({ error: "NOT FOUND" });
  } catch (err) {
    next(err);
  }
});

// Get single post with id
router.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      select: POST_FIELDS,
      where: {
        id: req.params.id,
      },
    });
    post
      ? res.status(200).send(post)
      : res.status(404).send({ error: "NOT FOUND" });
  } catch (err) {
    next(err);
  }
});

// Create new post
router.post("/", async (req, res, next) => {
  try {
    const { title, description, authorId } = req.body;
    if (!(title && authorId))
      return res.status(400).send({
        error: "title and authorId are required fields.",
      });
    const post = await prisma.post.create({
      data: { title, description, authorId },
      select: POST_FIELDS,
    });
    const authors = await prisma.author.findMany({
      where: {
        NOT: {
          id: {
            equals: authorId,
          },
        },
      },
      select: AUTHOR_FIELDS,
    });

    await sendMail(post, authors);
    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
});

// Update post
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: req.body,
      select: POST_FIELDS,
    });
    res.status(200).send(post);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(400).send({
          error: "Post does not exist!",
        });
      }
    }
    next(err);
  }
});

// Delete post
router.delete("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.delete({
      select: POST_FIELDS,
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
