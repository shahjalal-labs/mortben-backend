import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createCart = async (
  userId: string,
  mealId: string,
  packageId: string
) => {
  const isExist = await prisma.cart.findUnique({
    where: {
      mealId_userId: {
        mealId,
        userId,
      },
    },
  });
  if (isExist) {
    throw new ApiError(400, "Already added to cart");
  }
  await prisma.$transaction(async (tx) => {
    await tx.cart.create({
      data: { mealId, userId, packageId },
    });

    await tx.generatedPlanWithFood.update({
      where: { id: mealId },
      data: { status: "Added_Cart" },
    });

    return;
  });

  return;
};

const myCarts = async (userId: string) => {
  const results = await prisma.cart.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      packageId: true,
      meal: {
        select: {
          id: true,
          mealPlan: true,
          calories: true,
          paymentType: true,
          food: {
            select: {
              id: true,
              foodImage: true,
              foodName: true,
              total: true,
            },
          },
        },
      },
    },
  });
  return results;
};

const getCartById = async (id: string) => {
  const result = await prisma.cart.findUnique({ where: { id } });
  return result;
};

const updateCart = async (id: string, data: any) => {
  await prisma.cart.update({ where: { id }, data });
  return;
};

const deleteCart = async (id: string) => {
  const cartInfo = await prisma.cart.findUnique({ where: { id } });
  if (!cartInfo) throw new ApiError(404, "Cart not found");

  await prisma.$transaction(async (tx) => {
    await tx.generatedPlanWithFood.update({
      where: { id: cartInfo.mealId },
      data: { status: "Created" },
    });

    await tx.cart.delete({ where: { id: cartInfo.id } });

    return;
  });

  return;
};

export const cartServices = {
  createCart,
  myCarts,
  getCartById,
  updateCart,
  deleteCart,
};
