import { Role } from "@/generated/prisma/enums";
import { authorize } from "@/shared/middlewares/authorize";
import { verifyAuth } from "@/shared/middlewares/verify-auth";
import controllers from "@/user/controller/user";
import express from "express";

const router = express.Router();

router.use(verifyAuth);
router.use(authorize(Role.ADMIN));

router.get("/", controllers.listUsers);
router.patch("/:id/status", controllers.toggleUserActive);
router.delete("/:id", controllers.deleteUser);

export default router;
