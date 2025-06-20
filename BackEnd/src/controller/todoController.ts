import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all todos (ของ user คนเดียว)
export const getTodos = async (req: Request, res: Response) => {
  // ดึง userId จาก JWT (header: Authorization: Bearer <token>)
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  let userId = null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    userId = payload.userId;
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(todos);
};

// Add a new todo
export const addTodo = async (req: Request, res: Response) => {
  const { title } = req.body;
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  let userId = null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    userId = payload.userId;
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  const newTodo = await prisma.todo.create({ data: { title, userId } });
  res.status(201).json(newTodo);
};

// Update a todo
export const updateTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  });
  res.json(todo);
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  await prisma.todo.delete({ where: { id } });
  res.json({ success: true });
};
