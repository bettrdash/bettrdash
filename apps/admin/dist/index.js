"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminjs_1 = __importDefault(require("adminjs"));
const express_1 = __importDefault(require("@adminjs/express"));
const express_2 = __importDefault(require("express"));
const prisma_1 = require("@adminjs/prisma");
const db_1 = require("db");
const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
const PORT = process.env.PORT || 5090;
adminjs_1.default.registerAdapter({
    Resource: prisma_1.Resource,
    Database: prisma_1.Database,
});
const authenticate = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield db_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (admin && admin.password === password && admin.role === "admin") {
        return admin;
    }
    return null;
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_2.default)();
    const dmmf = db_1.prisma._baseDmmf;
    const adminOptions = {
        resources: [
            {
                resource: { model: dmmf.modelMap.User, client: db_1.prisma },
                options: {},
            },
            {
                resource: { model: dmmf.modelMap.Project, client: db_1.prisma },
                options: {},
            },
            {
                resource: { model: dmmf.modelMap.Apikey, client: db_1.prisma },
                options: {},
            },
        ],
    };
    const admin = new adminjs_1.default(adminOptions);
    const adminRouter = express_1.default.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: "somepassword",
    }, null, {
        store: new RedisStore({ client: redisClient }),
        secret: "somepassword",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
        },
        name: "adminjs",
    });
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
});
start();
//# sourceMappingURL=index.js.map