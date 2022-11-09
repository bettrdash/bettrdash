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
require("dotenv-safe/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan = require("morgan");
const auth_1 = __importDefault(require("./routes/auth"));
const project_1 = __importDefault(require("./routes/project"));
const auth_2 = __importDefault(require("./routes/api/auth"));
const noauth_1 = __importDefault(require("./routes/api/noauth"));
const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    morgan.token("body", (req) => JSON.stringify(req.body));
    app.use(morgan(":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"));
    app.use((req, res, next) => {
        const origin = req.headers.origin || "";
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        next();
    });
    app.use(express_1.default.json());
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 24 * 3,
            sameSite: "lax",
        },
    }));
    const authenticate = (req, res, next) => {
        if (!req.session || !req.session.user) {
            res.status(200).json({ success: false, message: "Unauthorized" });
            return;
        }
        next();
    };
    app.get("/", (_, res) => {
        res.send("Hello world");
    });
    app.use("/v1/auth", auth_1.default);
    app.use("/v1/api", noauth_1.default);
    app.use(authenticate);
    app.use("/v1/projects", project_1.default);
    app.use("/v1/api", auth_2.default);
    app.use((_, res) => {
        res.status(404).json({ status: "404" });
    });
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
    });
});
main();
//# sourceMappingURL=index.js.map