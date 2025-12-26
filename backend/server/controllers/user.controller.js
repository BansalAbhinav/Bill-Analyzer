import { Users } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { handleResponse } from "../helpers/helper.js";

export const userUpdate = async (req, res, next) => {
  const { userId } = req.userInfo;
  const { oldpassword, newPassword, username } = req.body;
  const user = await Users.findById(userId);
  if (!user) {
    return next(new Error("User Not Found"));
  }

  //check for username updation
  if (username) {
    user.username = username;
  }
  // check if old password is correct
  const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);
  if (!isPasswordMatch) {
    return next(new Error("Old Password is Wrong"));
  }
  //hash the new password
  const salt = await bcrypt.genSalt(10);
  const newhasedPassword = await bcrypt.hash(newPassword, salt);
  //update user password
  user.password = newhasedPassword;
  await user.save();
  handleResponse(res, 200, "Password Change Successfully");
};

export const getAllUsers = async (req, res) => {
  const user = await Users.find({});
  handleResponse(res, 200, "All Users", user);
};
