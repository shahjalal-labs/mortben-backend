import { dietcartServices } from "./dietcart.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createCart = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  const userId = req.user.id;
  await dietcartServices.createCart(userId, mealId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Add to cart has been successfully",
  });
});

const myCarts = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await dietcartServices.myCarts(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My carts has been retrived successfully",
    data: result,
  });
});

const getCartById = catchAsync(async (req, res) => {
  const result = await dietcartServices.getCartById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been retrived successfully",
    data: result,
  });
});

const updateCart = catchAsync(async (req, res) => {
  await dietcartServices.updateCart(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been updated successfully",
  });
});

const deleteCart = catchAsync(async (req, res) => {
  await dietcartServices.deleteCart(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "cart has been deleted successfully",
  });
});

export const dietcartControllers = {
  createCart,
  myCarts,
  getCartById,
  updateCart,
  deleteCart,
};
