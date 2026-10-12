import express from "express";
import { paymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", paymentControllers.loginWhish);
router.get("/whish-balance", paymentControllers.getBalance);
router.post("/payment-initiate", auth(), paymentControllers.initiateWhishW2W);
router.post(
  "/cashon-delivery/:packageId",
  auth(),
  paymentControllers.cashonDelivery
);
router.post(
  "/diet-shop/cod/:mealId",
  auth(),
  paymentControllers.dietShopCOD
);
router.get("/", auth(UserRole.ADMIN), paymentControllers.getAllPayments);
router.get(
  "/diet-shop/orders",
  auth(UserRole.ADMIN),
  paymentControllers.dietShopOrders
);
router.get("/:id", paymentControllers.getPaymentById);
router.patch(
  "/update/diet-shop/:id",
  auth(UserRole.ADMIN),
  paymentControllers.updatePayment
);
router.delete("/:id", paymentControllers.deletePayment);

export const paymentRoutes = router;
