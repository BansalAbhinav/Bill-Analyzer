//custom Error Class

export class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; // set api type to API Error
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack); // log the error stack

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  //hanle mongoose validation=<
  else if (err.name === "validationError") {
    return res.status(400).json({
      status: "error",
      message: "validationError",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "An unexpected Error occured",
    });
  }
};
