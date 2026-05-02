import { Router } from "express";
import { getTopCharts } from "../controllers/chart.controller.js";

const router = Router();

router.get("/top", getTopCharts);

export default router;