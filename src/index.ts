import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { getEnv, NODE_ENV } from "@/config/env";
import prisma from "@/config/prisma";
import mountedRoutes from "./mounted-routes";

const app = express();
const env = getEnv();
const PORT = env.PORT;

const inProduction = env.NODE_ENV === NODE_ENV.PRODUCTION;

app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(cookieParser());

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    mountedRoutes(app);

    app.listen(PORT, () => {
      if (!inProduction) console.log(`Server listening on port: ${PORT}`);
    });
  } catch (error: unknown) {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

startServer();
