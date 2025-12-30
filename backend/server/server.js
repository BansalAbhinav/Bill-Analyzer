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
import {
  startBillCleanupJob,
  runStartupCleanup,
} from "./services/billCleanup.service.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 4000;

// Server status for cold start detection
let serverStatus = "warming";

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
// Health check endpoint for cold start detection
app.get("/health", (req, res) => {
  res.status(200).json({ status: serverStatus });
});

app.use("/test",(req,res)=>{
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
    
    // Run cleanup immediately on startup (important for serverless/sleeping servers)
    await runStartupCleanup();
    
    // Start scheduled cleanup job (runs every hour while server is active)
    startBillCleanupJob();
    
    // Mark server as ready after DB connection and service initialization
    serverStatus = "ready";
    console.info("Server is Running - status: ready");
    app.listen(PORT, () => console.info(`Server listening on ${PORT}`));
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1);
  }
})();
