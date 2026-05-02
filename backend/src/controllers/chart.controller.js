import asyncHandler from "../utils/asyncHandler.js";
import chartService from "../services/chart.service.js";

export const getTopCharts = asyncHandler(async (req, res) => {
  const { limit, genre } = req.query;
  const result = await chartService.top({ limit, genre });
  res.status(200).json(result);
});