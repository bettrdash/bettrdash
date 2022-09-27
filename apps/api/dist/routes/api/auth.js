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
const express_1 = __importDefault(require("express"));
const db_1 = require("db");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.get("/key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = yield db_1.prisma.apikey.findUnique({
            where: { userId: req.session.user.id },
        });
        if (apiKey) {
            res.status(200).json({ success: true, apiKey: apiKey.key });
        }
        else {
            res.status(200).json({ success: false, message: "No api key" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post("/generate-key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: { id: req.session.user.id },
            include: { api_key: true },
        });
        if (user && user.api_key) {
            yield db_1.prisma.apikey.delete({ where: { id: user.api_key.id } });
        }
        const apiKey = yield db_1.prisma.apikey.create({
            data: {
                key: (0, uuid_1.v1)(),
                user: {
                    connect: {
                        id: req.session.user.id,
                    },
                },
            },
        });
        res.status(200).json({ success: true, apiKey: apiKey.key });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get("/settings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: { id: req.session.user.id },
            include: { api_key: true },
        });
        if (user) {
            const settings = {
                show_inactive_projects: user.show_inactive_projects,
                authorized_urls: new Array('user.api_key.authorized_urls', 'fs')
            };
            res.status(200).json({ success: true, settings });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post("/settings/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { show_inactive_projects } = req.body.settings;
    console.log(show_inactive_projects);
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: { id: req.session.user.id },
            include: { api_key: true },
        });
        if (user) {
            yield db_1.prisma.user.update({
                where: { id: user.id },
                data: { show_inactive_projects: show_inactive_projects },
            });
            res.status(200).json({ success: true });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map