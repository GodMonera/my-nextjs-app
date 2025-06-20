import { Router } from "express";
import { register, login } from "../controller/authcontroller";

const router = Router();

// Helper to wrap async route handlers
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
