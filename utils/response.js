export const successResponse = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Something went wrong", status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

export const notFoundResponse = (res, message = "Resource not found") => {
  return errorResponse(res, message, 404);
};

export const unauthorizedResponse = (res, message = "Unauthorized") => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (res, message = "Forbidden") => {
  return errorResponse(res, message, 403);
};
