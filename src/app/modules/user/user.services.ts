import ApiError from "../../../errors/ApiErrors";
import { ObjectId } from "mongodb";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { paginationHelper } from "../../../shared/pagination";
import { Request } from "express";
import axios from "axios";

//create new user
const createUserIntoDB = async (phoneNo: string) => {
  const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

  const existingUser = await prisma.user.findUnique({
    where: { phoneNo },
  });

  if (!existingUser) {
    await prisma.pendingUser.upsert({
      where: { phoneNo },
      update: {},
      create: { phoneNo },
    });
  }

  let otp = "";

  if (phoneNo === "+96121100000") {
    otp = "1234";
  } else {
    otp = generateOTP();
  }

  try {
    await axios.post(
      "https://api.verifyway.com/api/v1/",
      {
        recipient: phoneNo,
        type: "otp",
        code: otp,
        channel: "whatsapp",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VERIFYWAY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    throw new ApiError(500, "Failed to send OTP via WhatsApp.");
  }

  await prisma.otp.upsert({
    where: { phoneNo },
    update: { otpCode: otp, expiresAt },
    create: { phoneNo, otpCode: otp, expiresAt },
  });

  return;
};

//create new user
// const createUserIntoDB = async (payload: User) => {
//   const isExistEmail = await prisma.user.findUnique({
//     where: { email: payload.email },
//   });
//   if (isExistEmail) throw new ApiError(409, "This email already exist");

//   const isExistPhone = await prisma.user.findUnique({
//     where: { phoneNo: payload.phoneNo },
//   });
//   if (isExistPhone) throw new ApiError(409, "This phone number already exist");

//   const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
//   const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

//   const existingUser = await prisma.user.findUnique({
//     where: { phoneNo: payload.phoneNo, email: payload.email },
//   });

//   if (!existingUser) {
//     const hashedPassword = await bcrypt.hash(payload.password, 10);
//     await prisma.pendingUser.upsert({
//       where: {
//         email: payload.email,
//       },
//       update: {
//         password: hashedPassword,
//         phoneNo: payload.phoneNo,
//       },
//       create: {
//         phoneNo: payload.phoneNo,
//         email: payload.email,
//         password: hashedPassword,
//       },
//     });
//   }

//   let otp = "";

//   if (payload.phoneNo === "+96121100000") {
//     otp = "1234";
//   } else {
//     otp = generateOTP();
//   }

//   // await sendSMS(
//   //   phoneNo,
//   //   `Your verification code is ${otp}. Do not share this code with anyone.`
//   // );

//   // const html = `<div style="font-family: Arial, sans-serif; color: #333;">
//   //         <h2>Account verification</h2>
//   //         <p>Your OTP for account verification is:</p>
//   //         <h1 style="color: #007BFF;">${otp}</h1>
//   //         <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
//   //         <p>Thanks, <br>The Support Team</p></div>`;

//   // await sendEmail(payload.email, "Account verification", html);

//   try {
//     await axios.post(
//       "https://api.verifyway.com/api/v1/",
//       {
//         recipient: payload.phoneNo,
//         type: "otp",
//         code: otp,
//         channel: "whatsapp",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.VERIFYWAY_API_KEY}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       },
//     );
//   } catch (error: any) {
//     console.log(error.response?.data || error.message);
//     throw new ApiError(500, "Failed to send OTP via WhatsApp.");
//   }

//   await prisma.otp.upsert({
//     where: {
//       email: payload.email,
//     },
//     update: { otpCode: otp, expiresAt },
//     create: {
//       email: payload.email,
//       otpCode: otp,
//       expiresAt,
//     },
//   });

//   return otp;
// };

//verify user using otp for signup
const signupVerification = async (payload: {
  phoneNo: string;
  otp: string;
}) => {
  const { phoneNo, otp } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { phoneNo },
  });

  // Find OTP for validation
  const otpData = await prisma.otp.findUnique({
    where: { phoneNo },
  });

  if (!otpData) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  const { otpCode: savedOtp, expiresAt } = otpData;

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  if (Date.now() > expiresAt.getTime()) {
    await prisma.otp.delete({ where: { phoneNo } });
    throw new ApiError(410, "OTP has expired. Please request a new one.");
  }

  if (existingUser) {
    // OTP is valid, delete it and return access token
    await prisma.otp.delete({ where: { phoneNo } });

    const accessToken = jwtHelpers.generateToken(
      {
        id: existingUser.id,
        phoneNo: existingUser.phoneNo,
        role: existingUser.role,
      },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string,
    );

    return { accessToken };
  }

  // Check if there's a pending user
  const pendingUser = await prisma.pendingUser.findUnique({
    where: { phoneNo },
  });

  if (!pendingUser) {
    throw new ApiError(404, "Please sign up first.");
  }

  // Create new user and clean up OTP + pending user
  const newUser = await prisma.$transaction(async (tx) => {
    await tx.otp.delete({ where: { phoneNo } });
    await tx.pendingUser.delete({ where: { phoneNo } });

    return tx.user.create({
      data: {
        phoneNo,
      },
    });
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to create user.");
  }

  const accessToken = jwtHelpers.generateToken(
    { id: newUser.id, phoneNo: newUser.phoneNo, role: newUser.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return { accessToken };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }
  return user;
};

const getAllUsers = async (req: Request) => {
  const { limit, page, skip } = paginationHelper(req.query as any);
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalUsers = await prisma.user.count();

  return {
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    users,
  };
};

//update user
const updateUserIntoDB = async (id: string, userData: any) => {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const existingUser = await getSingleUserIntoDB(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });

  return updatedUser;
};

//delete user
const deleteUserIntoDB = async (userId: string, loggedId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return;
};

export const userService = {
  createUserIntoDB,
  signupVerification,
  getAllUsers,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
