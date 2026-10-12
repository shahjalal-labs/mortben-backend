import express, { Application } from "express";
import httpStatus from "http-status";
import cors from "cors";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import path from "path";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import { xssSanitizerMiddleware } from "./helpers/sanitizer";
import prisma from "./shared/prisma";

const app: Application = express();

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    const hashedPassword = await bcrypt.hash("123456", 10);
    const isAdminExist = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
    if (!isAdminExist) {
      await prisma.user.create({
        data: {
          email: "admin@gmail.com",
          password: hashedPassword,
          phoneNo: "+88012345678",
          fullName: "Admin",
          role: "ADMIN",
        },
      });
      console.log("✅ Admin created successfully");
    }
  } catch (error) {
    console.error("Failed to connect to services:", error);
    process.exit(1); // exit app if connection fails
  }
})();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//nosql injection protection
app.use(xssSanitizerMiddleware);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.get("/", (req, res) => {
  res.send({
    Message: "Welcome to api main route",
  });
});

// Router setup
app.use("/api/v1", router);

// Global Error Handler
app.use(GlobalErrorHandler);

// API Not found handler
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
