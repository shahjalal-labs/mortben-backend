import { Request } from "express";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { uploadInSpace } from "../../../shared/uploadInSpace";
import { paginationHelper } from "../../../shared/pagination";
import { foodSearch } from "../../../shared/foodSearch";

const createFood = async (file: Express.Multer.File, payload: any) => {
  if (!file) {
    throw new ApiError(400, "No food image provided");
  }

  const isExistMeal = await prisma.food.findUnique({
    where: {
      foodName: payload.foodName,
    },
  });

  if (isExistMeal) {
    throw new ApiError(409, "This food already exist!");
  }

  const foodImage = await uploadInSpace(file, "/food/foodImage");

  return await prisma.food.create({
    data: {
      ...payload,
      foodImage,
    },
  });
};

const deleteFood = async (foodId: string) => {
  const existFood = await prisma.food.findUnique({
    where: {
      id: foodId,
    },
  });

  if (!existFood) {
    throw new ApiError(404, "Food not found for delete");
  }

  await prisma.food.delete({
    where: { id: foodId },
  });
  return;
};

const singleFood = async (foodId: string) => {
  const food = await prisma.food.findUnique({
    where: {
      id: foodId,
    },
  });

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  return food;
};

const updateFood = async (
  foodId: string,
  payload: any,
  file: Express.Multer.File
) => {
  const food = await prisma.food.findUnique({
    where: {
      id: foodId,
    },
  });

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  let foodImage;

  if (file) {
    foodImage = await uploadInSpace(file, "/food/foodImage");
  }

  return await prisma.food.update({
    where: {
      id: foodId,
    },
    data: {
      ...payload,
      foodImage: foodImage ? foodImage : food.foodImage,
    },
  });
};

const getFoods = async (req: Request) => {
  const { skip, take, limit, page, search } = paginationHelper(
    req.query as any
  );
  const searchFilter: any = search ? foodSearch(search) : {};
  const foods = await prisma.food.findMany({
    where: searchFilter,
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalFoods = await prisma.food.count({
    where: searchFilter,
  });

  return {
    totalFoods,
    totalPages: Math.ceil(totalFoods / limit),
    currentPage: page,
    foods,
  };
};

export const foodServices = {
  createFood,
  getFoods,
  deleteFood,
  singleFood,
  updateFood,
};
