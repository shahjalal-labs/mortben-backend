import { Gender } from "@prisma/client";
import { z } from "zod";

const authLoginSchema = z.object({
  username: z.string().min(10, "Phone number minimum 10 characters long"),
});

const updateProfileSchema = z.object({
  username: z.string().min(1, "user name minimum 1 characters long").optional(),
  email: z.string().email().optional(),
  city: z.string().min(1, "city minimum 1 characters long").optional(),
  address: z.string().min(1, "address minimum 1 characters long").optional(),
  bio: z.string().min(1, "bio minimum 1 characters long").optional(),
  gender: z
    .nativeEnum(Gender, {
      errorMap: () => ({
        message: "Gender must be one of Male or Female,",
      }),
    })
    .optional(),
  dob: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
      "Date of birth must be in MM/DD/YYYY format"
    )
    .optional(),
  height: z.number().min(1, "height minimum 1 digit long").optional(),
  weight: z.number().min(1, "weight minimum 1 digit long").optional(),
  activityLevel: z.number().min(1, "activity level minimum 1 digit").optional(),
  goal: z.string().min(1, "goal minimum 1 characters long").optional(),
  medicalConditions: z.array(z.string()).optional(),
  fcmToken: z
    .string()
    .min(1, "FCM Token must be lest then 1 chareacters long")
    .optional(),
});

export const authValidation = {
  updateProfileSchema,
  authLoginSchema,
};
