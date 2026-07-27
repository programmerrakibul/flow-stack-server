import express from "express";

import controllers from "@/task/controller/task";
import { verifyAuth } from "@/shared/middlewares/verify-auth";

const router = express.Router();

router.use(verifyAuth);

router.post("/", controllers.create);
router.get("/", controllers.list);
router.get("/:id", controllers.getById);
router.patch("/:id", controllers.update);
router.patch("/:id/status", controllers.updateStatus);
router.delete("/:id", controllers.remove);

export default router;
