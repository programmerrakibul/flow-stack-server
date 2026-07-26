import express from "express";

import controllers from "@/auth/controller/auth";
import { verifySessionId } from "@/shared/middlewares/verify-session-id";

const router = express.Router();

router.post("/sign-up", controllers.signUp);
router.post("/sign-in", controllers.signIn);
router.post("/sign-out", controllers.signOut);
router.get("/profile", verifySessionId, controllers.profile);

export default router;
