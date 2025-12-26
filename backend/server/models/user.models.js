import mongoose, { Schema } from "mongoose";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Users = mongoose.model("Users", userSchema);
