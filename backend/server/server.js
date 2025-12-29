import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./db/db.js";
import router from "./routes/index.js";
import { addTimeStamp, requestLogger } from "./middlewares/customMiddleware.js";
// import { configureCors } from "./config/corsConfig.js";
// import { createBasicRateLimiter } from "./middlewares/rateLimit.js";
// import { urlVersioning } from "./middlewares/apiVersioning.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { configureCors } from "../config/corsConfig.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 4000;

// express json middleware
app.use(requestLogger);
app.use(addTimeStamp);

//CORS & Rate limiting

app.use(configureCors());
// app.use(createBasicRateLimiter(100, 15 * 60 * 1000)); //100 request per 15 minutes

app.use(express.json());
// // API Versioning Check
// app.use(urlVersioning("v1"));

//Routes
app.use("/",(req,res)=>{
  res.status(200).json({
    message:"Backend is running!!☆*: .｡. o(≧▽≦)o .｡.:*☆"
  })
})
app.use("/api/v1", router);
// app.use("/", router);
//Error Handling
app.use(globalErrorHandler);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.info(`Server listening on ${PORT}`));
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", err);
    process.exit(1);
  }
})();
