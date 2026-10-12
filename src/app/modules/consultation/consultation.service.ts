import { Consultation, ConsultationTime, PrismaClient } from "@prisma/client";
import { Request } from "express";
import { paginationHelper } from "../../../shared/pagination";
import ApiError from "../../../errors/ApiErrors";
import { sendSingleNotification } from "../notifications/notification.services";
const prisma = new PrismaClient();

const createConsultation = async (userId: string, slotId: string) => {
  const slotInfo = await prisma.consultationTime.findUnique({
    where: {
      id: slotId,
      isAvailable: true,
    },
  });
  if (!slotInfo) {
    throw new ApiError(404, "Slot not available");
  }
  await prisma.$transaction(async (tx) => {
    await tx.consultation.create({
      data: {
        schedule: slotInfo.availableDate,
        time: slotInfo.availableTime,
        type: slotInfo.type,
        userId,
        slotId,
      },
    });

    await tx.consultationTime.update({
      where: { id: slotId },
      data: { isAvailable: false },
    });
  });

  await sendSingleNotification(
    userId,
    "Consultation Booked Successfully",
    `🎉 Your consultation has been booked!\n\nDate: ${slotInfo.availableDate}\nTime: ${slotInfo.availableTime}\nType: ${slotInfo.type}`
  );

  return;
};

const getMyConsultations = async (userId: string) => {
  const results = await prisma.consultation.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      schedule: true,
      time: true,
      type: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return results;
};

const allConsultations = async (req: Request) => {
  const { page, limit, skip } = paginationHelper(req.query as any);
  const results = await prisma.consultation.findMany({
    select: {
      id: true,
      schedule: true,
      time: true,
      type: true,
      status: true,
      user: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
          phoneNo: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
  });
  const totalCount = await prisma.consultation.count();
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    results,
  };
};

const createConsultationTime = async (payload: ConsultationTime) => {
  await prisma.consultationTime.create({
    data: payload,
  });
  return;
};

const getConsultationTime = async (req: Request) => {
  const { date, type } = req.query as any;

  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  // Parse date string to Date object (only YYYY-MM-DD part)
  const selectedDate = new Date(date);
  const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

  const conditions: any = {
    availableDate: {
      gte: startOfDay,
      lte: endOfDay,
    },
    isAvailable: true,
  };

  if (type) {
    conditions.type = type; // filter by Online or Offline if provided
  }

  const consultations = await prisma.consultationTime.findMany({
    where: conditions,
    select: {
      id: true,
      availableDate: true,
      availableTime: true,
      isAvailable: true,
      type: true,
    },
    orderBy: { availableTime: "asc" },
  });

  return consultations;
};

const allConsultationTime = async () => {
  const results = await prisma.consultationTime.findMany();
  return results;
};
const getConsultationById = async (id: string) => {
  return await prisma.consultation.findUnique({ where: { id } });
};

const updateConsultation = async (id: string, data: Consultation) => {
  await prisma.consultation.update({ where: { id }, data });
  return;
};

const deleteConsultation = async (id: string) => {
  const isExistConsultation = await prisma.consultation.findUnique({
    where: {
      id,
    },
  });
  if (!isExistConsultation) {
    throw new ApiError(404, "Consultation not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.consultation.delete({
      where: { id },
    });

    await tx.consultationTime.update({
      where: {
        id: isExistConsultation.slotId,
      },
      data: {
        isAvailable: true,
      },
    });
  });
  return;
};

const deleteConsultationTime = async (id: string) => {
  await prisma.consultationTime.delete({ where: { id } });
  return;
};

export const consultationServices = {
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
