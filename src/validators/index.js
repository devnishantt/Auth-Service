import logger from "../config/loggerConfig.js";
import { sendError } from "../utils/response.js";

export function validateRequestBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errMessages =
        result.error.issues?.map((issue) => issue.message) || [];
      logger.warn(`Validation error in request body: ${errMessages}`);

      return sendError(res, "Validation Failed", 400, errMessages);
    }

    req.body = result.data;
    return next();
  };
}
