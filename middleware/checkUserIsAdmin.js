import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, forbiddenResponse } from "../utils/response.js";

function checkUserIsAdmin(req, res, next) {
  if (!req.user) {
    return unauthorizedResponse(res, 'Unauthorized');
  }

  if (req.user.role !== 'admin') {
    return forbiddenResponse(res, 'You cannot perform this action');
  }

  next();
}

export default checkUserIsAdmin;