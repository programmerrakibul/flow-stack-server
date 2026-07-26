import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cors from "cors";
import express from "express";
import expressSession from "express-session";

import { getEnv, NODE_ENV } from "@/config/env";
import prisma from "@/config/prisma";
import mountedRoutes from "./mounted-routes";

const app = express();
const env = getEnv();
const PORT = env.PORT;

app.use(express.json());
app.use(cors());

const inProduction = env.NODE_ENV === NODE_ENV.PRODUCTION;

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      secure: inProduction,
      httpOnly: true,
      sameSite: inProduction ? "none" : "lax",
    },
    name: "flow_stack_sid",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma as any, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      ttl: 30 * 24 * 60 * 60,
      sessionModelName: "session",
    }),
  }),
);

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
