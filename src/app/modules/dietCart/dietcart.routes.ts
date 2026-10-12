import express from "express";
import { dietcartControllers } from "./dietcart.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create/:mealId", auth(), dietcartControllers.createCart);
router.get("/my-carts", auth(), dietcartControllers.myCarts);
router.get("/:id", dietcartControllers.getCartById);
router.patch("/:id", dietcartControllers.updateCart);
router.delete("/:id", auth(), dietcartControllers.deleteCart);

export const dietcartRoutes = router;
