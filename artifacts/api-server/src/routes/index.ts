import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import tenantsRouter from "./tenants";
import uploadRouter from "./upload";
import aiOcrRouter from "./ai-ocr";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(tenantsRouter);
router.use(uploadRouter);
router.use(aiOcrRouter);

export default router;
