import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { foodServices } from "./food.service";

const createFood = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const result = await foodServices.createFood(file, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Food created successfully",
    data: result,
  });
});

const updateFood = catchAsync(async (req, res) => {
  const { foodId } = req.params;
  await foodServices.updateFood(
    foodId,
    req.body,
    req.file as Express.Multer.File
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Food has been updated successfully",
  });
});

const deleteFood = catchAsync(async (req, res) => {
  const { foodId } = req.params;
  await foodServices.deleteFood(foodId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Food has been deleted successfully",
  });
});

const singleFood = catchAsync(async (req, res) => {
  const { foodId } = req.params;
  const result = await foodServices.singleFood(foodId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Food has been retrived successfully",
    data: result,
  });
});

const getFoods = catchAsync(async (req, res) => {
  const result = await foodServices.getFoods(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Foods retrived successfully",
    data: result,
  });
});

export const foodControllers = {
  createFood,
  getFoods,
  updateFood,
  deleteFood,
  singleFood,
};
