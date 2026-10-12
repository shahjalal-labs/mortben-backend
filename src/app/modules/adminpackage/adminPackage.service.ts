import { Plan } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createAdminPackage = async (data: any) => {
  const mealsArray = data.meals
    .split(",")
    .map((meal: string) => meal.trim())
    .filter((meal: string) => meal !== "");

  await prisma.adminPackage.create({
    data: {
      ...data,
      price: Number(data.price),
      calories: Number(data.calories),
      meals: mealsArray,
    },
  });
  return;
};

const getAllAdminPackages = async () => {
  const results = await prisma.adminPackage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return results;
};

const getPackages = async () => {
  const results = await prisma.adminPackage.findMany({
    where: {
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return results;
};

const getAdminPackageById = async (id: string) => {
  const result = await prisma.adminPackage.findUnique({ where: { id } });
  return result;
};

const updateAdminPackage = async (id: string, data: any) => {
  const isExist = await prisma.adminPackage.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new ApiError(404, "Package not found for edit");
  }
  let mealsArray;
  if (data.meals) {
    mealsArray = data.meals
      .split(",")
      .map((meal: string) => meal.trim())
      .filter((meal: string) => meal !== "");
  }

  await prisma.adminPackage.update({
    where: { id },
    data: {
      ...data,
      meals: data.meals ? mealsArray : isExist.meals,
    },
  });
  return;
};

const deleteAdminPackage = async (id: string) => {
  await prisma.adminPackage.delete({ where: { id } });
  return;
};

const packagesAmount = async (query: any) => {
  const planName = query.planName as Plan;
  const calories = Number(query.calories);
  const packages = await prisma.adminPackage.findMany({
    where: {
      planName: planName,
      calories: calories,
    },
    select: {
      id: true,
      packageName: true,
      meals: true,
      price: true,
    },
  });
  return packages;
};

const packageList = async (userId: string) => {
  const meal = await prisma.generatedPlanWithFood.findFirst({
    where: { userId },
  });

  if (!meal) {
    const packages = await prisma.adminPackage.findMany({
      select: {
        id: true,
        packageName: true,
        planName: true,
        calories: true,
        meals: true,
        price: true,
      },
    });
    const packagesWithExistFlag = packages.map((pkg) => ({
      ...pkg,
      isExist: false,
    }));
    return {
      packages: packagesWithExistFlag,
    };
  }

  const existingPlan = await prisma.adminPackage.findUnique({
    where: {
      id: meal.packageId,
    },
    select: {
      id: true,
      packageName: true,
      planName: true,
      calories: true,
      meals: true,
      price: true,
    },
  });

  const packages = await prisma.adminPackage.findMany({
    select: {
      id: true,
      packageName: true,
      planName: true,
      calories: true,
      meals: true,
      price: true,
    },
  });

  const packagesWithExistFlag = packages
    .map((pkg) => ({
      ...pkg,
      isExist: pkg.id === existingPlan?.id,
    }))
    .sort((a, b) => Number(b.isExist) - Number(a.isExist)); // 👈 true on top

  return {
    packages: packagesWithExistFlag,
  };
};

export const adminPackageServices = {
  createAdminPackage,
  getAllAdminPackages,
  getAdminPackageById,
  updateAdminPackage,
  deleteAdminPackage,
  getPackages,
  packagesAmount,
  packageList,
};
