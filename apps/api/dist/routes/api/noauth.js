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
const router = express_1.default.Router();
router.get("/projects", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.query.key;
    try {
        if (key) {
            let apiKey = yield db_1.prisma.apikey.findUnique({
                where: { key },
                include: {
                    user: true,
                },
            });
            if (apiKey) {
                let projects = [];
                const activeProjects = yield db_1.prisma.project.findMany({
                    where: {
                        ownerId: apiKey.user.id,
                        active: true,
                    },
                    orderBy: {
                        name: "desc",
                    },
                    select: {
                        live_url: true,
                        name: true,
                        github_url: true,
                        language: true,
                        description: true,
                        active: true,
                        image_url: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });
                if (apiKey.user.show_inactive_projects) {
                    console.log("hi");
                    let inactiveProjects = yield db_1.prisma.project.findMany({
                        where: {
                            ownerId: apiKey.user.id,
                            active: false,
                        },
                        orderBy: {
                            name: "desc",
                        },
                        select: {
                            name: true,
                            live_url: true,
                            github_url: true,
                            language: true,
                            description: true,
                            active: true,
                            image_url: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    });
                    projects = [...inactiveProjects, ...activeProjects];
                    res.json({ projects }).status(200);
                    return;
                }
                projects = [...activeProjects];
                res.json({ projects }).status(200);
            }
            else {
                res.status(404).json({ success: false, message: "Invalid api key" });
            }
        }
        else {
            res.status(404).json({ success: false, message: "Invalid api key" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
exports.default = router;
//# sourceMappingURL=noauth.js.map