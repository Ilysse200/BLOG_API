"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = authorizeRole;
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const user = req.currentUser;
        console.log("Role check:", user === null || user === void 0 ? void 0 : user.role);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    };
}
