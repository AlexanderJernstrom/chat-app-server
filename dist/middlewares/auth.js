"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authorize = ({ context }, next) => {
    const token = context.req.headers["token"];
    if (!token) {
        throw new Error("Not authenticated");
    }
    try {
        const payload = jsonwebtoken_1.verify(token, process.env.SECRET);
        context.payload = payload;
    }
    catch (err) {
        console.log(err);
        throw new Error("Not authenticated");
    }
    return next();
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map