import { z } from "zod";

const registrationSchema = z.object({
  phoneNo: z.string().min(10, "Phone number min 10 digit long"),
});

const verificationSchema = z.object({
  phoneNo: z.string().min(10, "Phone number min 10 digit long"),
  otp: z.string().min(4, "OTP must be at least 4 characters long"),
});

export const userValidation = {
  registrationSchema,
  verificationSchema,
};
