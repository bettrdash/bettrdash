"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.prisma = void 0;
require("dotenv-safe/config");
__exportStar(require("@prisma/client"), exports);
var client_1 = require("@prisma/client");
var prisma;
exports.prisma = prisma;
// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
    exports.prisma = prisma = new client_1.PrismaClient({ log: ["error"] });
    prisma.$connect();
}
else {
    if (!global.__db) {
        global.__db = new client_1.PrismaClient({ log: ["error", "warn"] });
        global.__db.$connect();
    }
    exports.prisma = prisma = global.__db;
}
