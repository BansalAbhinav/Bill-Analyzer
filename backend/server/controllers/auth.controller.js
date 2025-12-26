import { Users } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleResponse } from "../helpers/helper.js";
import { APIError } from "../middlewares/errorHandler.js";
export const userRegister = async (req, res, next) => {
  const { username, email, password } = req.body;
  const userExist = await Users.findOne({ email });
  //  $or: [{ username }, { email }],
  if (userExist) {
    return next(new APIError("User already exists"));
  }
  //hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create a new user
  const newUser = new Users({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  if (newUser) {
    handleResponse(res, 200, "User Created Successfully", newUser);
  }
};
export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await Users.findOne({ email });
  if (!userExist) {
    return next(new APIError("User not Exist! PLease SignUp."));
  }
  const isPasswordMatch = await bcrypt.compare(password, userExist.password);
  if (!isPasswordMatch) {
    return next(new APIError("Password not matched"));
  }
  //create ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      userId: userExist._id,
      username: userExist.username,
      role: userExist.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "60m",
    },
  );
  handleResponse(res, 200, "here is your access token", accessToken);
};
