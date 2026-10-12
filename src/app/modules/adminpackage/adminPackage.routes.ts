import express from "express";
import { adminPackageControllers } from "./adminPackage.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  adminPackageControllers.createAdminPackage
);
router.get("/", adminPackageControllers.getPackages);
router.get(
  "/get-packages",
  auth(UserRole.ADMIN),
  adminPackageControllers.getAllAdminPackages
);
router.get(
  "/packages-amount",
  auth(UserRole.USER, UserRole.ADMIN),
  adminPackageControllers.packagesAmount
);
router.get("/:id", adminPackageControllers.getAdminPackageById);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  adminPackageControllers.updateAdminPackage
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  adminPackageControllers.deleteAdminPackage
);
router.get(
  "/package-list/user",
  auth(UserRole.USER),
  adminPackageControllers.packageList
);

export const adminPackageRoutes = router;
