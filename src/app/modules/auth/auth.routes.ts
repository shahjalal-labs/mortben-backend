import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "../user/user.validation";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserRole } from "@prisma/client";

const router = express.Router();

//login user
router.post("/login", authController.adminLogin);
router.post("/user-login", authController.userLogin);
// router.post(
//   "/admin-verification",
//   validateRequest(userValidation.verificationSchema),
//   authController.adminLoginVerification
// );
router.patch("/profile", auth(), authController.updateProfile);
router.get("/profile", auth(), authController.myProfile);
router.patch(
  "/profile-image",
  auth(),
  fileUploader.profileImage,
  authController.updateProfileImage,
);
router.post("/weight-entry", auth(), authController.addWeightEntry);
router.get("/weight-progress", auth(), authController.getWeightProgress);
router.post("/add-city", auth(UserRole.ADMIN), authController.addCity);
router.get("/cities", authController.getCities);
router.get("/all-cities", auth(UserRole.ADMIN), authController.allCities);
router.patch(
  "/update-city/:cityId",
  auth(UserRole.ADMIN),
  authController.updateCity,
);
router.delete(
  "/delete-city/:cityId",
  auth(UserRole.ADMIN),
  authController.deleteCity,
);
router.get(
  "/admin-overview",
  auth(UserRole.ADMIN),
  authController.adminOverview,
);

export const authRoute = router;
