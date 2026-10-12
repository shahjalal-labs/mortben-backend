import express from "express";
import { cartControllers } from "./cart.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create/:mealId/:packageId", auth(), cartControllers.createCart);
router.get("/my-carts", auth(), cartControllers.myCarts);
router.get("/:id", cartControllers.getCartById);
router.patch("/:id", cartControllers.updateCart);
router.delete("/:id", auth(), cartControllers.deleteCart);

export const cartRoutes = router;
