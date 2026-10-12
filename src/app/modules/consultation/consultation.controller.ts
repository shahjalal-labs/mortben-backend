import { Request, Response } from "express";
import { consultationServices } from "./consultation.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createConsultation = catchAsync(async (req, res) => {
  await consultationServices.createConsultation(req.user.id, req.params.slotId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The consultation has been created successfully",
  });
});

const getMyConsultations = catchAsync(async (req, res) => {
  const result = await consultationServices.getMyConsultations(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My all consultations has been retrived successfully",
    data: result,
  });
});

const allConsultations = catchAsync(async (req, res) => {
  const result = await consultationServices.allConsultations(req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All consultations has been retrived successfully",
    data: result,
  });
});

const getConsultationById = catchAsync(async (req, res) => {
  const result = await consultationServices.getConsultationById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "consultation has been retrived successfully",
    data: result,
  });
});

const updateConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await consultationServices.updateConsultation(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "consultation has been updated successfully",
    data: result,
  });
});

const deleteConsultation = catchAsync(async (req: Request, res: Response) => {
  await consultationServices.deleteConsultation(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "consultation has been deleted successfully",
  });
});

const createConsultationTime = catchAsync(async (req, res) => {
  await consultationServices.createConsultationTime(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "consultation time has been created successfully",
  });
});
const getConsultationTime = catchAsync(async (req, res) => {
  const results = await consultationServices.getConsultationTime(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "consultation time has been rertived successfully",
    data: results,
  });
});

const allConsultationTime = catchAsync(async (req, res) => {
  const results = await consultationServices.allConsultationTime();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "consultation time has been rertived successfully",
    data: results,
  });
});

const deleteConsultationTime = catchAsync(async (req, res) => {
  await consultationServices.deleteConsultationTime(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "consultation time has been deleted successfully",
  });
});

export const consultationControllers = {
  createConsultation,
  getMyConsultations,
  allConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  createConsultationTime,
  getConsultationTime,
  allConsultationTime,
  deleteConsultationTime,
};
