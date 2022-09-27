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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("db");
const router = express_1.default.Router();
const saltRounds = 10;
router.get("/current-session", (req, res) => {
    var _a;
    const user = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
    if (!user) {
        res.status(200).json({ success: false, message: "Unauthorized" });
        return;
    }
    res.status(200).json({ success: true, user });
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password || email === "" || password === "") {
            res
                .status(200)
                .json({ success: false, message: "Incorrect email or password" });
        }
        else {
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                res
                    .status(200)
                    .json({ success: false, message: "Incorrect email or password" });
            }
            else {
                const match = yield bcrypt_1.default.compare(password, user.password);
                if (match) {
                    let { password, createdAt, updatedAt } = user, other = __rest(user, ["password", "createdAt", "updatedAt"]);
                    req.session.user = other;
                    res.status(200).json({ success: true });
                }
                else {
                    res
                        .status(200)
                        .json({ success: false, message: "Incorrect email or password" });
                }
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name ||
            !email ||
            !password ||
            name === "" ||
            email === "" ||
            password === "") {
            res
                .status(200)
                .json({ success: false, message: "Missing required fields" });
        }
        else {
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                res
                    .status(200)
                    .json({ success: false, message: "Email in use" });
            }
            else {
                yield bcrypt_1.default.hash(password, saltRounds).then((hash) => __awaiter(void 0, void 0, void 0, function* () {
                    const newUser = yield db_1.prisma.user.create({
                        data: {
                            name,
                            email,
                            password: hash,
                        },
                    });
                    const { password, createdAt, updatedAt } = newUser, other = __rest(newUser, ["password", "createdAt", "updatedAt"]);
                    req.session.user = other;
                    res.status(200).json({ success: true });
                }));
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post("/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(200).json({ success: false, message: "Unable to logout" });
            }
            else {
                res.json({ success: true });
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ success: false, message: e.message });
    }
});
router.post("/update-profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, currentPassword, newPassword, profile_img } = req.body;
    try {
        if (!name || !email || name === "" || email === "") {
            res.status(200).json({ success: false, message: "Missing required fields" });
        }
        else {
            if (currentPassword && newPassword) {
                const user = yield db_1.prisma.user.findUnique({ where: { id: req.session.user.id } });
                if (user) {
                    const match = yield bcrypt_1.default.compare(currentPassword, user.password);
                    if (match) {
                        yield bcrypt_1.default.hash(newPassword, saltRounds).then((hash) => __awaiter(void 0, void 0, void 0, function* () {
                            const newUser = yield db_1.prisma.user.update({
                                where: {
                                    id: req.session.user.id,
                                },
                                data: {
                                    name,
                                    email,
                                    profile_img,
                                    password: hash,
                                },
                            });
                            const { password, createdAt, updatedAt } = newUser, other = __rest(newUser, ["password", "createdAt", "updatedAt"]);
                            req.session.user = other;
                            res.status(200).json({ success: true });
                        }));
                    }
                    else {
                        res.status(200).json({ success: false, message: "Incorrect password" });
                    }
                }
            }
            else {
                const newUser = yield db_1.prisma.user.update({
                    where: {
                        id: req.session.user.id,
                    },
                    data: {
                        name,
                        email,
                        profile_img
                    },
                });
                const { password, createdAt, updatedAt } = newUser, other = __rest(newUser, ["password", "createdAt", "updatedAt"]);
                req.session.user = other;
                res.status(200).json({ success: true });
            }
        }
    }
    catch (e) {
        console.log(e);
        res
            .status(500)
            .json({ success: false, message: "An error has occurred" });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map