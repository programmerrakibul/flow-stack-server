import express from "express";

import controllers from "@/dashboard/controller/dashboard";
import { verifyAuth } from "@/shared/middlewares/verify-auth";
import { authorize } from "@/shared/middlewares/authorize";
import { Role } from "@/generated/prisma/enums";

const router = express.Router();

router.use(verifyAuth);

router.get("/user", controllers.getUserDashboard);

router.get("/admin", authorize(Role.ADMIN), controllers.getAdminDashboard);
router.get("/admin/users", authorize(Role.ADMIN), controllers.listUsers);
router.patch("/admin/users/:id/toggle-active", authorize(Role.ADMIN), controllers.toggleUserActive);
router.delete("/admin/users/:id", authorize(Role.ADMIN), controllers.deleteUser);

export default router;
