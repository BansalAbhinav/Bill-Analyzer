import { BillAnalysis } from "../models/bill.models.js";

/**
 * Middleware to check if user has reached the 4-bill limit
 * Users can only have max 4 bills at a time
 */
export const checkBillLimit = async (req, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Count current bills for this user
    const billCount = await BillAnalysis.countDocuments({ userId });

    // Check if user has reached the limit
    if (billCount >= 4) {
      return res.status(429).json({
        message:
          "You have reached the maximum limit of 4 bills. Please wait for automatic deletion after 24 hours before uploading more.",
        currentBills: billCount,
        maxLimit: 4,
      });
    }

    // User is within limit, proceed
    req.userBillCount = billCount;
    next();
  } catch (error) {
    console.error("Error checking bill limit:", error);
    return res.status(500).json({
      message: "Error checking bill limit",
    });
  }
};
