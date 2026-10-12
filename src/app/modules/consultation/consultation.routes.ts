import express from "express";
import { consultationControllers } from "./consultation.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import rateLimiter from "../../middlewares/rateLimiter";

const router = express.Router();

router.post("/:slotId", auth(), consultationControllers.createConsultation);
router.get(
  "/my-consultations",

  auth(),
  consultationControllers.getMyConsultations
);
router.get(
  "/",

  auth(UserRole.ADMIN),
  consultationControllers.allConsultations
);
router.get(
  "/:id",

  consultationControllers.getConsultationById
);
router.patch(
  "/:id",

  auth(UserRole.ADMIN),
  consultationControllers.updateConsultation
);
router.delete(
  "/:id",

  auth(UserRole.ADMIN),
  consultationControllers.deleteConsultation
);
router.post(
  "/create-consultaion/time",

  auth(UserRole.ADMIN),
  consultationControllers.createConsultationTime
);
router.get(
  "/get-consultation/time",

  consultationControllers.getConsultationTime
);
router.get(
  "/all-consultation/time",

  auth(UserRole.ADMIN),
  consultationControllers.allConsultationTime
);
router.delete(
  "/delete-consultation/time/:id",

  auth(UserRole.ADMIN),
  consultationControllers.deleteConsultationTime
);

export const consultationRoutes = router;
