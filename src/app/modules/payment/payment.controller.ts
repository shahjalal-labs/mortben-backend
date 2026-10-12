import { paymentServices } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const loginWhish = catchAsync(async (req, res) => {
  const result = await paymentServices.loginWhish();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The payment has been created successfully",
    data: result,
  });
});

const getBalance = catchAsync(async (req, res) => {
  const result = await paymentServices.getBalance();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "balance has been created successfully",
    data: result,
  });
});

const initiateWhishW2W = catchAsync(async (req, res) => {
  const result = await paymentServices.initiateWhishW2W();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "payment has been successfully",
    data: result,
  });
});

const cashonDelivery = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { packageId } = req.params;
  await paymentServices.cashonDelivery(userId, packageId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "cashon delivery has been successfully",
  });
});

const dietShopCOD = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { mealId } = req.params;
  await paymentServices.dietShopCOD(userId, mealId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "cashon delivery has been successfully",
  });
});

const dietShopOrders = catchAsync(async (req, res) => {
  const result = await paymentServices.dietShopOrders(req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Diet shop orders has been retrived successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await paymentServices.getAllPayments(req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All payments has been retrived successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const result = await paymentServices.getPaymentById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "payment has been retrived successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  await paymentServices.updatePayment(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "diet shop has been updated successfully",
  });
});

const deletePayment = catchAsync(async (req, res) => {
  await paymentServices.deletePayment(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "payment has been deleted successfully",
  });
});

export const paymentControllers = {
  loginWhish,
  getBalance,
  initiateWhishW2W,
  cashonDelivery,
  dietShopCOD,
  getAllPayments,
  dietShopOrders,
  getPaymentById,
  updatePayment,
  deletePayment,
};
