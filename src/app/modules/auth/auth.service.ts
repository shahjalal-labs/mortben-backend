import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { City, User } from "@prisma/client";
import { uploadInSpace } from "../../../shared/uploadInSpace";
import { startOfDay, endOfDay, subMonths } from "date-fns";
import { paginationHelper } from "../../../shared/pagination";
import { Request } from "express";
import { sendSingleNotification } from "../notifications/notification.services";

//login user
const userLogin = async (payload: { phoneNo: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      phoneNo: payload.phoneNo,
    },
  });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.password as string,
  );
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, phoneNo: user.phoneNo, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  const isProfileComplete =
    user.dob !== null &&
    user.height !== 0 &&
    user.weight !== 0 &&
    user.activityLevel !== 0 &&
    user.goal !== null;

  return {
    accessToken,
    isProfileComplete,
  };
};

//login admin
const adminLogin = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      role: "ADMIN",
    },
  });

  if (!user) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password as string,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
  };
};

//verify user using otp for signup
// const adminLoginVerification = async (payload: {
//   phoneNo: string;
//   otp: string;
// }) => {
//   const { phoneNo, otp } = payload;

//   const user = await prisma.user.findUnique({
//     where: { phoneNo, role: "ADMIN" },
//   });
//   if (!user) {
//     throw new ApiError(404, "Admin not found");
//   }

//   const verifyData = await prisma.otp.findUnique({
//     where: {
//       phoneNo,
//     },
//   });

//   if (!verifyData) {
//     throw new ApiError(400, "Invalid or expired OTP.");
//   }

//   const { otpCode: savedOtp, expiresAt } = verifyData;

//   if (otp !== savedOtp) {
//     throw new ApiError(401, "Invalid OTP.");
//   }

//   if (Date.now() > expiresAt.getTime()) {
//     await prisma.otp.delete({
//       where: {
//         phoneNo,
//       },
//     }); // OTP has expired
//     throw new ApiError(410, "OTP has expired. Please request a new OTP.");
//   }

//   const accessToken = jwtHelpers.generateToken(
//     { id: user.id, phoneNo: user.phoneNo, role: user.role },
//     config.jwt.jwt_secret as string,
//     config.jwt.expires_in as string
//   );

//   return { accessToken };
// };

// update user profile only logged in user

const updateProfile = async (userId: string, userData: User) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "user not found for edit user");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData,
  });

  return updatedUser;
};

const updateProfileImage = async (
  userId: string,
  file: Express.Multer.File,
) => {
  if (file === undefined) {
    throw new ApiError(400, "Please select profile image");
  }
  const isExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isExist) {
    throw new ApiError(404, "user not found for edit");
  }
  const profileImage = await uploadInSpace(file, "users/file");

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileImage,
    },
  });

  const isProfileComplete =
    isExist.dob !== null &&
    isExist.height !== 0 &&
    isExist.weight !== 0 &&
    isExist.activityLevel !== 0 &&
    isExist.goal !== null;

  if (isProfileComplete) {
    await sendSingleNotification(
      userId,
      "Account Setup Successfull",
      `🎉 Your account creation is successful, you can now experience our services.`,
    );
  }

  return;
};

const myProfile = async (userId: string) => {
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      dob: true,
      height: true,
      weight: true,
      gender: true,
      phoneNo: true,
      email: true,
      city: true,
      address: true,
      bio: true,
      activityLevel: true,
      goal: true,
    },
  });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const dob = profile.dob;
  const birthYear = Number(dob?.split("/")[2]);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const weight = Number(profile.weight); // kg
  const height = Number(profile.height); // cm
  const heightInMeters = height / 100;

  // BMI calculation
  const BMI = weight / heightInMeters ** 2;

  const isProfileComplete =
    profile.dob !== null &&
    profile.height !== 0 &&
    profile.weight !== 0 &&
    profile.activityLevel !== 0 &&
    profile.goal !== null;

  return {
    ...profile,
    age,
    bmi: Number(BMI.toFixed(2)),
    isProfileComplete,
  };
};

const addWeightEntry = async (userId: string, weight: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found for update weight");
  }

  const dob = user.dob;
  const birthYear = Number(dob?.split("/")[2]);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const height = Number(user.height); // cm
  const heightInMeters = height / 100;
  const heightInInches = height / 2.54;

  // BMI calculation
  const BMI = weight / heightInMeters ** 2;

  // Calculate Adjusted Body Weight if BMI > 30
  let usedWeight = weight;
  if (BMI > 30) {
    const IBW =
      user.gender === "Female"
        ? 45.5 + 2.3 * (heightInInches - 60)
        : 50 + 2.3 * (heightInInches - 60);
    const AdjBW = IBW + 0.4 * (weight - IBW);
    usedWeight = AdjBW;
  }

  // Calculate BEE using Mifflin-St Jeor simplified
  let BEE: number;
  if (user.gender === "Female") {
    BEE = 10 * usedWeight + 6.25 * height - 5 * age - 161;
  } else {
    BEE = 10 * usedWeight + 6.25 * height - 5 * age + 5;
  }

  const AF = user.activityLevel;
  const TEE = BEE * AF;

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const existingEntry = await prisma.weightEntry.findFirst({
    where: {
      userId,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (existingEntry) {
    throw new ApiError(400, "Weight has already been recorded for today");
  }

  await prisma.$transaction([
    prisma.weightEntry.create({
      data: {
        userId,
        weight,
        calories: TEE,
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        weight,
      },
    }),
  ]);

  return;
};

const getWeightProgress = async (
  userId: string,
  duration: "1m" | "6m" | "1y",
) => {
  let monthsAgo: number;

  switch (duration) {
    case "1m":
      monthsAgo = 1;
      break;
    case "6m":
      monthsAgo = 6;
      break;
    case "1y":
      monthsAgo = 12;
      break;
    default:
      throw new Error("Invalid duration. Use '1m', '6m', or '1y'.");
  }

  const fromDate = subMonths(new Date(), monthsAgo);

  const weightEntries = await prisma.weightEntry.findMany({
    where: {
      userId,
      createdAt: {
        gte: fromDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (weightEntries.length < 1) {
    return {
      message: "Not enough data to calculate weight progress.",
      progress: null,
      entries: [],
    };
  }

  const initial = weightEntries[0];
  const latest = weightEntries[weightEntries.length - 1];

  const difference = +(latest.weight - initial.weight).toFixed(1);

  return {
    from: initial.createdAt,
    to: latest.createdAt,
    startWeight: initial.weight,
    currentWeight: latest.weight,
    progress: difference,
    status: difference > 0 ? "gained" : difference < 0 ? "lost" : "no change",
    entries: weightEntries, // ✅ Include all matching entries
  };
};

const addCity = async (city: string) => {
  const isExist = await prisma.city.findUnique({
    where: {
      city: city,
    },
  });
  if (isExist) {
    throw new ApiError(409, `${city} city already exist in your system`);
  }
  await prisma.city.create({
    data: {
      city: city,
    },
  });
  return;
};

const getCities = async () => {
  const cities = await prisma.city.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      city: true,
    },
    orderBy: {
      city: "asc",
    },
  });
  return cities;
};

const allCities = async (req: Request) => {
  const { page, limit, skip } = paginationHelper(req.query as any);
  const cities = await prisma.city.findMany({
    select: {
      id: true,
      city: true,
      createdAt: true,
      isAvailable: true,
    },
    orderBy: {
      city: "asc",
    },
    take: limit,
    skip,
  });
  const totalCount = await prisma.city.count();
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    cities,
  };
};

const updateCity = async (cityId: string, payload: City) => {
  const isExit = await prisma.city.findUnique({
    where: {
      id: cityId,
    },
  });
  if (!isExit) {
    throw new ApiError(404, "City not found");
  }
  await prisma.city.update({
    where: {
      id: cityId,
    },
    data: payload,
  });
  return;
};

const deleteCity = async (cityId: string) => {
  const isExit = await prisma.city.findUnique({
    where: {
      id: cityId,
    },
  });
  if (!isExit) {
    throw new ApiError(404, "City not found");
  }
  await prisma.city.delete({
    where: {
      id: cityId,
    },
  });
  return;
};

const adminOverview = async () => {
  // ---------------------------------------------------------
  // 1. Fetch Data for Top Cards & Charts
  // ---------------------------------------------------------
  const completedOrders = await prisma.generatedPlanWithFood.findMany({
    where: {
      status: "Payment_Completed",
    },
    select: {
      createdAt: true,
      package: {
        select: {
          price: true,
        },
      },
    },
  });

  const totalDeliveries = await prisma.generatedPlanWithFood.count({
    where: {
      status: "Delivered",
    },
  });

  const activeOrders = await prisma.generatedPlanWithFood.count({
    where: {
      status: "Order_Processing",
    },
  });

  const activeSubscriptions = await prisma.package.count({
    where: {
      status: true,
    },
  });

  const totalRevenue = completedOrders.reduce(
    (sum, item) => sum + item.package.price,
    0,
  );

  // ---------------------------------------------------------
  // 2. Format Data for Total Revenue Chart (Jan - Dec)
  // ---------------------------------------------------------
  const currentYear = new Date().getFullYear();

  const revenueChart = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];

  completedOrders.forEach((order) => {
    if (order.createdAt && order.createdAt.getFullYear() === currentYear) {
      const monthIndex = order.createdAt.getMonth();
      revenueChart[monthIndex].revenue += order.package.price;
    }
  });

  // ---------------------------------------------------------
  // 3. Format Data for Order Chart (Mon - Sun, Single Letter)
  // ---------------------------------------------------------
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentOrders = await prisma.generatedPlanWithFood.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Initialize the order chart strictly with your requested format (Monday = index 0, Sunday = index 6)
  const orderChart = [
    { day: "M", orders: 0 },
    { day: "T", orders: 0 },
    { day: "W", orders: 0 },
    { day: "T", orders: 0 },
    { day: "F", orders: 0 },
    { day: "S", orders: 0 },
    { day: "S", orders: 0 },
  ];

  recentOrders.forEach((order) => {
    if (order.createdAt) {
      // JavaScript getDay() returns 0 for Sunday, 1 for Monday, etc.
      const jsDayIndex = order.createdAt.getDay();

      // Map JS day index to our array index (where Monday is 0 and Sunday is 6)
      const arrayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1;

      orderChart[arrayIndex].orders += 1;
    }
  });

  // ---------------------------------------------------------
  // 4. Return Final Payload
  // ---------------------------------------------------------
  return {
    totalRevenue: totalRevenue,
    activeSubscriptions: activeSubscriptions,
    totalDeliveries: totalDeliveries,
    activeOrders: activeOrders,
    charts: {
      revenueChart: revenueChart,
      orderChart: orderChart,
    },
  };
};

export const authService = {
  userLogin,
  adminOverview,
  adminLogin,
  updateProfile,
  myProfile,
  updateProfileImage,
  addWeightEntry,
  getWeightProgress,
  addCity,
  getCities,
  allCities,
  updateCity,
  deleteCity,
};
