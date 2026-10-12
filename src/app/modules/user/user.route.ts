import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import rateLimiter from "../../middlewares/rateLimiter";

const router = express.Router();

router.post("/create", userControllers.createUser);
router.post(
  "/signup-verification",
  validateRequest(userValidation.verificationSchema),
  userControllers.signupVerification
);
router.get("/", auth(UserRole.ADMIN), userControllers.getUsers);
router.get("/:id", rateLimiter(1, 100), auth(), userControllers.getSingleUser);
router.put("/:id", auth(UserRole.ADMIN), userControllers.updateUser);
router.delete("/delete/:id", auth(UserRole.ADMIN), userControllers.deleteUser);

export const userRoutes = router;
