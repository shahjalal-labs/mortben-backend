import { adminPackageServices } from "./adminPackage.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createAdminPackage = catchAsync(async (req, res) => {
  await adminPackageServices.createAdminPackage(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The adminPackage has been created successfully",
  });
});

const getAllAdminPackages = catchAsync(async (req, res) => {
  const result = await adminPackageServices.getAllAdminPackages();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All adminPackages has been retrived successfully",
    data: result,
  });
});

const getPackages = catchAsync(async (req, res) => {
  const result = await adminPackageServices.getPackages();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All packages has been retrived successfully",
    data: result,
  });
});

const getAdminPackageById = catchAsync(async (req, res) => {
  const result = await adminPackageServices.getAdminPackageById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "adminPackage has been retrived successfully",
    data: result,
  });
});

const updateAdminPackage = catchAsync(async (req, res) => {
  await adminPackageServices.updateAdminPackage(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "adminPackage has been updated successfully",
  });
});

const deleteAdminPackage = catchAsync(async (req, res) => {
  await adminPackageServices.deleteAdminPackage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "adminPackage has been deleted successfully",
  });
});

const packagesAmount = catchAsync(async (req, res) => {
  const data = await adminPackageServices.packagesAmount(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Packages has been retrived successfully",
    data,
  });
});

const packageList = catchAsync(async (req, res) => {
  const data = await adminPackageServices.packageList(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Packages has been retrived successfully",
    data,
  });
});

export const adminPackageControllers = {
  createAdminPackage,
  getAllAdminPackages,
  getAdminPackageById,
  updateAdminPackage,
  deleteAdminPackage,
  getPackages,
  packagesAmount,
  packageList,
};
