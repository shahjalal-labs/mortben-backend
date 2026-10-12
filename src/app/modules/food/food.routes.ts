import express from "express";
import auth from "../../middlewares/auth";
import { foodControllers } from "./food.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-food",
  auth(UserRole.ADMIN),
  fileUploader.foodImage,
  parseBodyData,
  foodControllers.createFood
);
router.get("/get-foods", auth(), foodControllers.getFoods);
router.get("/:foodId", foodControllers.singleFood);
router.delete("/:foodId", auth(UserRole.ADMIN), foodControllers.deleteFood);
router.patch(
  "/:foodId",
  auth(UserRole.ADMIN),
  fileUploader.foodImage,
  parseBodyData,
  foodControllers.updateFood
);

export const foodRoutes = router;
