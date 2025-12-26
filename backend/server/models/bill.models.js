import mongoose, { Schema } from "mongoose";

const billAnalysisSchema = Schema(
  {
    // Original file info
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "image"],
      required: true,
    },

    // Extraction details
    extractedText: {
      type: String,
      required: true,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    extractedVia: {
      type: String,
      enum: ["text", "ocr"],
      required: true,
    },

    // Analysis from LLM - using Mixed type for flexibility
    analysis: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // User reference (optional for now)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    // Processing status
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  },
);

export const BillAnalysis = mongoose.model("BillAnalysis", billAnalysisSchema);
