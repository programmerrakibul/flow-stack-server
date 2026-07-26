import express from "express";

import controllers from "@/task/controller/task";
import { verifySessionId } from "@/shared/middlewares/verify-session-id";

const router = express.Router();

router.use(verifySessionId);

router.post("/", controllers.create);
router.get("/", controllers.list);
router.get("/:id", controllers.getById);
router.patch("/:id", controllers.update);
router.patch("/:id/status", controllers.updateStatus);
router.delete("/:id", controllers.remove);

export default router;
