import { asyncHandler } from "../helpers/helper.js";
import { handleResponse } from "../helpers/helper.js";
import { BillAnalysis } from "../models/bill.models.js";

/**
 * Get all bill analyses
 */
export const getAllBillAnalyses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const analyses = await BillAnalysis.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select("-extractedText"); // Don't send full text in list

  const count = await BillAnalysis.countDocuments(query);

  handleResponse(res, 200, "Bill analyses retrieved successfully", {
    analyses,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

/**
 * Get single bill analysis by ID
 */
export const getBillAnalysisById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const analysis = await BillAnalysis.findById(id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: "Bill analysis not found",
    });
  }

  handleResponse(res, 200, "Bill analysis retrieved successfully", analysis);
});

/**
 * Delete bill analysis
 */
export const deleteBillAnalysis = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const analysis = await BillAnalysis.findByIdAndDelete(id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: "Bill analysis not found",
    });
  }

  handleResponse(res, 200, "Bill analysis deleted successfully", { id });
});

/**
 * Get analysis summary statistics
 */
export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const totalAnalyses = await BillAnalysis.countDocuments();
  const completedAnalyses = await BillAnalysis.countDocuments({
    status: "completed",
  });
  const failedAnalyses = await BillAnalysis.countDocuments({
    status: "failed",
  });

  const recentAnalyses = await BillAnalysis.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("originalFileName createdAt status analysis.overall_summary");

  handleResponse(res, 200, "Analytics retrieved successfully", {
    total: totalAnalyses,
    completed: completedAnalyses,
    failed: failedAnalyses,
    recent: recentAnalyses,
  });
});
