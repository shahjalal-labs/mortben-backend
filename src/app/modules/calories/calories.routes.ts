import express from "express";
import { caloriesControllers } from "./calories.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  caloriesControllers.createCalories
);
router.get("/get-calories", caloriesControllers.getAllCaloriess);
router.get("/:id", caloriesControllers.getCaloriesById);
router.patch("/:id", caloriesControllers.updateCalories);
router.delete("/:id", auth(UserRole.ADMIN), caloriesControllers.deleteCalories);

export const caloriesRoutes = router;
