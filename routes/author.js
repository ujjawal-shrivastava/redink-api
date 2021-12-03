//express
const express = require("express");
const router = express.Router();

// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const AUTHOR_FIELDS = {
  id: true,
  name: true,
  email: true,
};

// Get all authors
router.get("/", async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany({
      select: AUTHOR_FIELDS,
    });
    res.status(200).send(authors);
  } catch (err) {
    next(err);
  }
});

// Get single author with id
router.get("/:id", async (req, res, next) => {
  try {
    const author = await prisma.author.findUnique({
      select: AUTHOR_FIELDS,
      where: {
        id: req.params.id,
      },
    });
    author
      ? res.status(200).send(author)
      : res.status(404).send({ error: "NOT FOUND" });
  } catch (err) {
    next(err);
  }
});

// Create new author
router.post("/", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!(email && name))
      return res.status(400).send({
        error: "email and name are required fields.",
      });
    const author = await prisma.author.create({
      data: { email, name },
      select: AUTHOR_FIELDS,
    });
    res.status(200).send(author);
  } catch (err) {
    next(err);
  }
});

// Delete author
router.delete("/:id", async (req, res, next) => {
  try {
    const author = await prisma.author.delete({
      select: AUTHOR_FIELDS,
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(author);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
