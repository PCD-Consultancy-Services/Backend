const httpStatus = require("http-status");

// Check if the user has the required permission for a route
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      // const user = await userServices.getUserById("6667fbdd8058a1514ac32c3d"); //TEMPORARY
      if (user && user.role && user.role.permissions) {
        const permissionsList = user.role.permissions.map(
          (permission) => permission.key
        );
        if (
          permissionsList.length > 0 &&
          permissionsList.includes(requiredPermission)
        ) {
          return next();
        } else {
          const statusCode = httpStatus.FORBIDDEN;
          return res.status(statusCode).json({
            success: false,
            code: statusCode,
            message: "Access denied",
          });
        }
      } else {
        const statusCode = httpStatus.FORBIDDEN;
        return res.status(statusCode).json({
          success: false,
          code: statusCode,
          message: "Access denied",
        });
      }
    } catch (error) {
      console.error(error);
      // return sendErrorResponse(httpStatus.INTERNAL_SERVER_ERROR,res,"Internal server error");
      const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).json({
        success: false,
        code: statusCode,
        message: "Internal server error",
      });
    }
  };
};

const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (user?.role) {
        if (!Array.isArray(requiredRoles)) {
          requiredRoles = requiredRoles.split(",");
        }
        // if (user.role.key === requiredRole) {
        if (requiredRoles.includes(user.role.key)) {
          return next();
        } else {
          // return sendErrorResponse(httpStatus.FORBIDDEN, res, "Access denied");
          const statusCode = httpStatus.FORBIDDEN;
          return res.status(statusCode).json({
            success: false,
            code: statusCode,
            message: "Access denied",
          });
        }
      } else {
        // return sendErrorResponse(httpStatus.FORBIDDEN, res, "Access denied");
        const statusCode = httpStatus.FORBIDDEN;
        return res.status(statusCode).json({
          success: false,
          code: statusCode,
          message: "Access denied",
        });
      }
    } catch (error) {
      console.error(error);
      // return sendErrorResponse(httpStatus.INTERNAL_SERVER_ERROR,res,"Internal server error");
      const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).json({
        success: false,
        code: statusCode,
        message: "Internal server error",
      });
    }
  };
};

module.exports = {
  checkRole,
  checkPermission,
};
