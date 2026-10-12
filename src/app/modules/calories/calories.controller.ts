import {caloriesServices} from './calories.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from "../../../shared/catchAsync";

const createCalories = catchAsync (async (req, res) => {
  await caloriesServices.createCalories(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The calories has been created successfully"
  });
})

const getAllCaloriess = catchAsync(async (req, res) => {
  const result = await caloriesServices.getAllCaloriess();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All caloriess has been retrived successfully",
    data: result,
  });
})

const getCaloriesById = catchAsync(async (req, res) => {
  const result = await caloriesServices.getCaloriesById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "calories has been retrived successfully",
    data: result,
  });
})

const updateCalories = catchAsync(async (req, res) => {
  await caloriesServices.updateCalories(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "calories has been updated successfully"
  });
})

const deleteCalories = catchAsync(async (req, res) => {
  await caloriesServices.deleteCalories(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "calories has been deleted successfully",
  });
})

export const caloriesControllers = {
  createCalories,
  getAllCaloriess,
  getCaloriesById,
  updateCalories,
  deleteCalories,
}
  