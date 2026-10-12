import { cartServices } from "./cart.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createCart = catchAsync(async (req, res) => {
  const { mealId, packageId } = req.params;
  const userId = req.user.id;
  await cartServices.createCart(userId, mealId, packageId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Add to cart has been successfully",
  });
});

const myCarts = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await cartServices.myCarts(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My carts has been retrived successfully",
    data: result,
  });
});

const getCartById = catchAsync(async (req, res) => {
  const result = await cartServices.getCartById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been retrived successfully",
    data: result,
  });
});

const updateCart = catchAsync(async (req, res) => {
  await cartServices.updateCart(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been updated successfully",
  });
});

const deleteCart = catchAsync(async (req, res) => {
  await cartServices.deleteCart(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been deleted successfully",
  });
});

export const cartControllers = {
  createCart,
  myCarts,
  getCartById,
  updateCart,
  deleteCart,
};
