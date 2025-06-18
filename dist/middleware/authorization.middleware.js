"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = authorizeRole;
const error_1 = require("../utils/error");
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        console.log("Role check:", user === null || user === void 0 ? void 0 : user.role);
        if (!user) {
            throw new error_1.NotFoundError("User");
        }
        if (!allowedRoles.includes(user.role)) {
            throw new error_1.ForbiddenError("No access allowed for you");
        }
        next();
    };
}
