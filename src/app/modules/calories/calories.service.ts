import { Calories, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createCalories = async (data: Calories) => {
  await prisma.calories.create({
    data: {
      calories: Number(data.calories),
    },
  });
  return;
};

const getAllCaloriess = async () => {
  const results = await prisma.calories.findMany({
    orderBy: {
      calories: "asc",
    },
  });
  return results;
};

const getCaloriesById = async (id: string) => {
  const result = await prisma.calories.findUnique({ where: { id } });
  return result;
};

const updateCalories = async (id: string, data: any) => {
  await prisma.calories.update({ where: { id }, data });
  return;
};

const deleteCalories = async (id: string) => {
  await prisma.calories.delete({ where: { id } });
  return;
};

export const caloriesServices = {
  createCalories,
  getAllCaloriess,
  getCaloriesById,
  updateCalories,
  deleteCalories,
};
