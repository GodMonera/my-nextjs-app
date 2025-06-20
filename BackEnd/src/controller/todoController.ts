import { Request, Response } from "express";

// Example in-memory todo list
let todos: { id: number; title: string; completed: boolean }[] = [];
let nextId = 1;

// Get all todos
export const getTodos = (req: Request, res: Response) => {
  res.json(todos);
};

// Add a new todo
export const addTodo = (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTodo = { id: nextId++, title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// Update a todo
export const updateTodo = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
};

// Delete a todo
export const deleteTodo = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
};
