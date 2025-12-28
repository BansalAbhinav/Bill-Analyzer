import { configDotenv } from "dotenv";
import { APIError } from "../middlewares/errorHandler.js";
import { OAuth2Client } from "google-auth-library";
import { Users } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

configDotenv();

export function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new APIError("ClientId or Client Secret Key is not present", 404);
  }

  // FIX 2: correct constructor usage
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export async function googleAuthStartHandler(req, res) {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.redirect(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function googleCallbackHandle(req, res) {
  try {
    const code = req.query.code;
    if (!code) {
      throw new APIError("Callback Code is Missing", 404);
    }

    const client = getGoogleClient();

    client.setCredentials({});

    const { tokens } = await client.getToken(code);

    if (!tokens?.id_token) {
      throw new APIError("Id token is Missing", 400);
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // cheing for payload send by google in callback
    // console.log("++++++++++++++++++");
    // console.log(payload);
    // console.log("++++++++++++++++++");

    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      throw new APIError("Google Email Account is not Verified", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await Users.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = "123213"; // placeholder (you know this)

      user = await Users.create({
        email: normalizedEmail,
        password: passwordHash,
        username: payload?.name,
        image: payload?.picture,
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" },
    );

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
