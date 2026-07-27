import express from "express";

import controllers from "@/auth/controller/auth";
import { verifyAuth } from "@/shared/middlewares/verify-auth";

const router = express.Router();

router.post("/sign-up", controllers.signUp);
router.post("/sign-in", controllers.signIn);
router.post("/sign-out", controllers.signOut);
router.post("/refresh-token", controllers.refreshToken);
router.get("/profile", verifyAuth, controllers.profile);

export default router;
