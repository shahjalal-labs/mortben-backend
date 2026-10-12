import { Order, PrismaClient } from "@prisma/client";
import axios from "axios";
import ApiError from "../../../errors/ApiErrors";
import { Request } from "express";
import { paginationHelper } from "../../../shared/pagination";
import { sendSingleNotification } from "../notifications/notification.services";
import sendEmail from "../../../helpers/sendEmail";
import { orderEmailBody } from "../../../helpers/orderEmailBody";
const prisma = new PrismaClient();

const secret = "c61e51321a51416395dOafcb21ecb423";
const channel = "10195175";
const websiteUrl = "https://mortben.com";
const username = "340926246";
const password = "M@mortben1";

let accessToken: string | null = null;

const loginWhish = async () => {
  try {
    const response = await axios.post(
      "https://lb.sandbox.whish.money/itel-service/api/auth/login",
      {
        username: username,
        password: password,
      },
    );

    accessToken = response.data?.data?.accessToken;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error: any) {
    console.error("Whish Login Error:", error.response?.data || error.message);
    throw error;
  }
};

const getBalance = async () => {
  try {
    const response = await axios.get(
      "https://lb.sandbox.whish.money/itel-service/api/payment/account/balance",
      {
        headers: {
          "Content-Type": "application/json",
          channel: channel,
          secret: secret,
          websiteurl: websiteUrl,
        },
      },
    );

    const balance = response.data?.data?.balanceDetails?.balance;
    console.log("Whish Balance:", response);
    return balance;
  } catch (error: any) {
    console.error(
      "Whish Balance Fetch Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const initiateWhishW2W = async () => {
  try {
    const response = await axios.post(
      "https://lb.sandbox.whish.money/itel-service/api/payment/whish",
      {
        amount: 100, // in USD, LBP, or AED
        currency: "USD",
        invoice: "Payment for Order #1234",
        externalId: 123456789, // Unique ID from your system
        successCallbackUrl: "https://yourapp.com/api/whish/success",
        failureCallbackUrl: "https://yourapp.com/api/whish/failure",
        successRedirectUrl: "https://mortben.com",
        failureRedirectUrl: "https://yourapp.com/payment-failed",
      },
      {
        headers: {
          "Content-Type": "application/json",
          channel,
          secret,
          websiteurl: websiteUrl,
        },
      },
    );
    console.log(response);

    const whishUrl = response.data?.data?.whishUrl;

    if (whishUrl) {
      console.log("Redirect user to:", whishUrl);
      return whishUrl;
    } else {
      throw new Error("whishUrl not returned");
    }
  } catch (error: any) {
    console.error(
      "Whish W2W Payment Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const cashonDelivery = async (userId: string, packageId: string) => {
  const packageInfo = await prisma.adminPackage.findUnique({
    where: { id: packageId },
  });

  if (!packageInfo) throw new ApiError(404, "Package Not Found");

  let REQUIRED_MEAL_PLANS = [] as string[];

  if (packageInfo.packageName === "Full Package") {
    REQUIRED_MEAL_PLANS = ["breakfast", "lunch", "dinner", "snack"];
  } else if (packageInfo.packageName === "Lunch Package") {
    REQUIRED_MEAL_PLANS = ["lunch", "snack"];
  } else if (packageInfo.packageName === "Morning Half Board") {
    REQUIRED_MEAL_PLANS = ["breakfast", "lunch", "snack"];
  } else if (packageInfo.packageName === "Noon Half Board") {
    REQUIRED_MEAL_PLANS = ["lunch", "dinner", "snack"];
  }

  // Fetch ALL items regardless of status
  const allItems = await prisma.generatedPlanWithFood.findMany({
    where: {
      packageId,
      userId,
      // no status filter here
    },
    select: {
      mealPlan: true,
      createdAt: true,
      status: true,
      planName: true,
    },
  });

  if (allItems.length === 0)
    throw new ApiError(400, "No items found for the package.");

  // Verify unique planName consistency
  const uniquePlanNames = [...new Set(allItems.map((mp) => mp.planName))];
  if (uniquePlanNames.length !== 1) {
    throw new ApiError(
      400,
      "Inconsistent plan types found in items. Please ensure all are of the same type.",
    );
  }

  const toUTCDateString = (date: Date) => date.toISOString().split("T")[0];

  // Extract unique dates
  const uniqueDates = [
    ...new Set(
      allItems.map((item) => toUTCDateString(new Date(item.createdAt))),
    ),
  ]
    .sort() // sort ascending
    .slice(0, 7);

  // Check missing meal plans with status "Added_Cart" for each date
  const missingDays: { date: string; missingMealPlans: string[] }[] = [];

  for (const dateStr of uniqueDates) {
    const [year, month, day] = dateStr.split("-").map(Number);

    const dayStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const itemsForDay = allItems.filter((item) => {
      const created = new Date(item.createdAt);
      return created >= dayStart && created <= dayEnd;
    });

    // For each required meal plan, check if at least one item with status "Added_Cart" exists
    const missingMealPlans = REQUIRED_MEAL_PLANS.filter((mealPlan) => {
      return !itemsForDay.some(
        (item) => item.mealPlan === mealPlan && item.status === "Added_Cart",
      );
    });

    if (missingMealPlans.length > 0) {
      missingDays.push({
        date: dateStr,
        missingMealPlans,
      });
    }
  }

  if (missingDays.length > 0) {
    const messageLines = missingDays.map(
      (day) => `• ${day.date}: Missing ${day.missingMealPlans.join(", ")}`,
    );
    throw new ApiError(
      400,
      `Please add items with status "Added_Cart" for all required meal plans on the following day(s):\n${messageLines.join(
        "\n",
      )}`,
    );
  }

  // Now update status for items currently in Added_Cart to Payment_Completed
  await prisma.generatedPlanWithFood.updateMany({
    where: {
      packageId,
      userId,
      status: "Added_Cart",
    },
    data: {
      status: "Payment_Completed",
      paymentType: "CASH_ON_DELIVERY",
    },
  });

  // // Clean up unused items and cart
  // await prisma.generatedPlanWithFood.deleteMany({
  //   where: {
  //     packageId,
  //     userId,
  //     status: "Created",
  //   },
  // });

  await prisma.cart.deleteMany({
    where: {
      packageId,
      userId,
    },
  });

  await sendSingleNotification(
    userId,
    "Order Successful",
    `🎉 Your order has been placed successfully!`,
  );

  return;
};

const dietShopCOD = async (userId: string, mealId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const isExistMeal = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      food: {
        select: {
          id: true,
          foodName: true,
          total: true,
        },
      },
    },
  });
  if (!isExistMeal) {
    throw new ApiError(404, "Meal not found");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      foodId: isExistMeal.foodId,
      mealName: isExistMeal.mealType,
      status: "Payment_Completed",
      paymentType: "CASH_ON_DELIVERY",
    },
  });
  await prisma.dietCart.delete({
    where: {
      userId_mealId: {
        userId,
        mealId,
      },
    },
  });
  const emailBody = orderEmailBody({    
    mealName: order.mealName,
    foodName: isExistMeal.food.foodName,
    totalAmount: isExistMeal.food.total,
    paymentType: order.paymentType,
    location: user?.address || "N/A",
  });
  await sendEmail("mirhasan000034@gmail.com", "New Order", emailBody);

  await sendSingleNotification(
    userId,
    "Order Successful From Diet Shop",
    `🎉 Your order has been placed successfully from diet shop!\n\nMeal Name: ${isExistMeal?.mealName}\nFood: $${isExistMeal.food?.foodName}\nPrice: $${isExistMeal.food?.total}`,
  );

  return;
};

const dietShopOrders = async (req: Request) => {
  const { limit, page, skip, status, paymentType } = paginationHelper(
    req.query as any,
  );
  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }
  if (paymentType) {
    whereClause.paymentType = paymentType;
  }
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            address: true,
            city: true,
          },
        },
        food: {
          select: {
            id: true,
            foodName: true,
            calories: true,
            total: true,
          },
        },
      },
    }),
    prisma.order.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalCount,
    totalPages,
    currentPage: page,
    orders,
  };
};

const getAllPayments = async (req: Request) => {
  const { limit, page, skip, status, paymentType } = paginationHelper(
    req.query as any,
  );
  const whereClause: any = {
    NOT: {
      status: "Created",
    },
  };
  if (status) {
    whereClause.status = status;
  }
  if (paymentType) {
    whereClause.paymentType = paymentType;
  }
  const [orders, totalCount] = await Promise.all([
    prisma.generatedPlanWithFood.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            address: true,
            city: true,
          },
        },
        package: {
          select: {
            id: true,
            packageName: true,
            price: true,
          },
        },
        food: {
          select: {
            id: true,
            foodName: true,
            calories: true,
            total: true,
          },
        },
      },
    }),
    prisma.generatedPlanWithFood.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    totalCount,
    totalPages,
    currentPage: page,
    orders,
  };
};

const getPaymentById = async (id: string) => {
  return await prisma.order.findUnique({ where: { id } });
};

const updatePayment = async (id: string, data: Order) => {
  await prisma.order.update({ where: { id }, data });
  return;
};

const deletePayment = async (id: string) => {
  return await prisma.order.delete({ where: { id } });
};

export const paymentServices = {
  loginWhish,
  getBalance,
  cashonDelivery,
  dietShopCOD,
  getAllPayments,
  dietShopOrders,
  getPaymentById,
  updatePayment,
  deletePayment,
  initiateWhishW2W,
};
