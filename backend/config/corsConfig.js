import cors from "cors";
export const configureCors = () => {
  return cors({
    //origin Tell which origin you want user can access/allowed to use/access your api
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", //local dev
        "http://localhost:5173", //vite dev server
        "https://bill-analyzer-dpgo.vercel.app",
        "https://bill-analyzer-rfzy.vercel.app",
        process.env.FRONTEND_URL, //production frontend URL
      ].filter(Boolean); // Remove undefined values

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        // !origin=> for postman
        callback(null, true); // giving permisson so that req can be allowed
      } else {
        callback(new Error("Not Allowed by cors"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true, // enable support for cookies
    preflightContinue: false,
    maxAge: 600, //cache pre flight responses for 10 min (600 seconds) => avoid sending opton request multiple time
    optionsSuccessStatus: 204,
  });
};
