import { Router } from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controller/todoController";
// Uncomment the next line to protect routes with authentication
// import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// If you want to protect all routes, uncomment the next line
// router.use(authMiddleware);

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
