import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { mealRoutes } from "../modules/meal/meal.routes";
import { foodRoutes } from "../modules/food/food.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { consultationRoutes } from "../modules/consultation/consultation.routes";
import { notificationsRoute } from "../modules/notifications/notification.route";
import { cartRoutes } from "../modules/cart/cart.routes";
import { dietcartRoutes } from "../modules/dietCart/dietcart.routes";
import { caloriesRoutes } from "../modules/calories/calories.routes";
import { adminPackageRoutes } from "../modules/adminpackage/adminPackage.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/meals",
    route: mealRoutes,
  },
  {
    path: "/foods",
    route: foodRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/consultations",
    route: consultationRoutes,
  },
  {
    path: "/notifications",
    route: notificationsRoute,
  },
  {
    path: "/carts",
    route: cartRoutes,
  },
  {
    path: "/diet-carts",
    route: dietcartRoutes,
  },
  {
    path: "/calories",
    route: caloriesRoutes,
  },
  {
    path: "/admin-package",
    route: adminPackageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
