import express from "express";

import controllers from "@/dashboard/controller/dashboard";
import { Role } from "@/generated/prisma/enums";
import { authorize } from "@/shared/middlewares/authorize";
import { verifyAuth } from "@/shared/middlewares/verify-auth";

const router = express.Router();

router.use(verifyAuth);

router.get("/user", authorize(Role.USER), controllers.getUserDashboard);
router.get("/admin", authorize(Role.ADMIN), controllers.getAdminDashboard);

export default router;
