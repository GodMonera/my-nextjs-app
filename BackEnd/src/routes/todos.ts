import { Router, Request, Response } from "express";

const router = Router();

// In-memory todos array for demonstration
let todos: { id: number; title: string; completed: boolean }[] = [];

// Get all todos
router.get("/", (req: Request, res: Response) => {
  res.json(todos);
});

// Add a new todo
router.post("/", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTodo = {
    id: Date.now(),
    title,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = todos.find((t) => t.id === Number(id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

// Delete a todo
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

export default router;
