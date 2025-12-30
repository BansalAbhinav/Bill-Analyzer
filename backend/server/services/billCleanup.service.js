import cron from "node-cron";
import { BillAnalysis } from "../models/bill.models.js";
import fs from "fs";
import path from "path";

/**
 * Core cleanup function - deletes bills older than 24 hours
 */
const performCleanup = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    console.log(
      `Running bill cleanup... Deleting bills older than ${twentyFourHoursAgo.toISOString()}`,
    );

    // Find and delete bills older than 24 hours
    const result = await BillAnalysis.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (result.deletedCount > 0) {
      console.log(
        `Cleanup complete: ${result.deletedCount} bills deleted from database`,
      );
    } else {
      console.log("Cleanup complete: No old bills to delete");
    }

    return result.deletedCount;
  } catch (error) {
    console.error("❌ Error during bill cleanup:", error);
    return 0;
  }
};

/**
 * Start scheduled cleanup job (runs every hour)
 * This keeps the DB clean while server is active
 */
export const startBillCleanupJob = () => {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", performCleanup);

  console.log("📅 Bill cleanup job scheduled (runs every hour)");
};

/**
 * Run cleanup immediately on server startup
 * Critical for Render free tier where server sleeps
 */
export const runStartupCleanup = async () => {
  console.log("Running startup cleanup check...");
  await performCleanup();
};

/**
 * Manually trigger cleanup (useful for testing or API endpoints)
 */
export const cleanupOldBills = async () => {
  return await performCleanup();
};
