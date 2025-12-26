import { APIError } from "./errorHandler.js";

export const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "ADMIN") {
    return next(new APIError("Access Denied! You are not a ADMIN", 403));
  }
};
