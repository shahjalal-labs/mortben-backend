import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

//login user
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.userLogin(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Login Successfull",
    data: result,
  });
});

const adminOverview = catchAsync(async (req, res) => {
  const result = await authService.adminOverview();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin overview retrived successfully",
    data: result,
  });
});

//login admin
const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.adminLogin(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin Login Successfull",
    data: result,
  });
});

// const adminLoginVerification = catchAsync(async (req, res) => {
//   const result = await authService.adminLoginVerification(req.body);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Admin verification successful",
//     data: result,
//   });
// });

// update user profile only logged in user
const updateProfile = catchAsync(async (req: any, res: Response) => {
  const { id } = req.user;
  const updatedUser = await authService.updateProfile(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

const myProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const updatedUser = await authService.myProfile(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile retrived successfully",
    data: updatedUser,
  });
});

const updateProfileImage = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const { id } = req.user;
  await authService.updateProfileImage(id, file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile image has been updated successfully",
  });
});

const addWeightEntry = catchAsync(async (req, res) => {
  await authService.addWeightEntry(req.user.id, req.body.weight);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Weight updated successfully",
  });
});

const getWeightProgress = catchAsync(async (req, res) => {
  const { duration } = req.query as any;
  const result = await authService.getWeightProgress(req.user.id, duration);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Weight progress retrived successfully",
    data: result,
  });
});

const addCity = catchAsync(async (req, res) => {
  await authService.addCity(req.body.city);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "City added successfully",
  });
});

const getCities = catchAsync(async (req, res) => {
  const cities = await authService.getCities();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Cities retrived successfully",
    data: cities,
  });
});

const allCities = catchAsync(async (req, res) => {
  const cities = await authService.allCities(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "All Cities retrived successfully",
    data: cities,
  });
});

const updateCity = catchAsync(async (req, res) => {
  const { cityId } = req.params;
  await authService.updateCity(cityId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "City updated successfully",
  });
});

const deleteCity = catchAsync(async (req, res) => {
  const { cityId } = req.params;
  await authService.deleteCity(cityId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "City deleted successfully",
  });
});

export const authController = {
  userLogin,
  adminLogin,
  adminOverview,
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
