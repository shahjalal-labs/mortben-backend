import { PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
const prisma = new PrismaClient();

const createCart = async (userId: string, mealId: string) => {
  const isExist = await prisma.dietCart.findUnique({
    where: {
      userId_mealId: {
        userId,
        mealId,
      },
    },
  });
  if (isExist) {
    throw new ApiError(400, "Already added to diet shop cart");
  }
  await prisma.dietCart.create({
    data: {
      mealId,
      userId,
    },
  });
  return;
};

const myCarts = async (userId: string) => {
  const results = await prisma.dietCart.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      meal: {
        select: {
          id: true,
          calories: true,
          mealType: true,
          status: true,
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
  const result = await prisma.dietCart.findUnique({ where: { id } });
  return result;
};

const updateCart = async (id: string, data: any) => {
  await prisma.dietCart.update({ where: { id }, data });
  return;
};

const deleteCart = async (id: string) => {
  await prisma.dietCart.delete({ where: { id } });
  return;
};

export const dietcartServices = {
  createCart,
  myCarts,
  getCartById,
  updateCart,
  deleteCart,
};
