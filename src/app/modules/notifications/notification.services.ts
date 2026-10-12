import ApiError from "../../../errors/ApiErrors";
import admin from "../../../helpers/firebaseAdmin";
import prisma from "../../../shared/prisma";

// Send notification to a single user
export const sendSingleNotification = async (
  userId: string,
  title: string,
  body: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.fcmToken) {
    await prisma.notification.create({
      data: {
        userId,
        title: title,
        body: body,
      },
    });
    return;
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: user.fcmToken,
  };

  await prisma.notification.create({
    data: {
      userId,
      title: title,
      body: body,
    },
  });

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error: any) {
    return;
  }
};

const getNotificationsFromDB = async (req: any) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
};

const getSingleNotificationFromDB = async (
  req: any,
  notificationId: string
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId: req.user.id,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found for the user");
  }

  const updateNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updateNotification;
};

export const notificationServices = {
  getNotificationsFromDB,
  getSingleNotificationFromDB,
};
