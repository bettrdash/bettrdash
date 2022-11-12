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
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield db_1.prisma.project.findMany({
            where: {
                ownerId: req.session.user.id,
            },
            orderBy: [
                {
                    active: 'desc'
                },
                {
                    name: "asc",
                }
            ]
        });
        res.status(200).json({ success: true, projects });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({ success: false, message: "An error has occurred" });
    }
}));
router.get('/single/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield db_1.prisma.project.findUnique({
            where: {
                id: parseInt(req.params.projectId),
            },
            include: { owner: { select: { id: true } } }
        });
        if (project) {
            if (project.owner.id === req.session.user.id && parseInt(req.params.id) === req.session.user.id) {
                res.status(200).json({ success: true, project });
            }
            else {
                res.status(200).json({ success: false, message: "Unauthorized" });
            }
        }
        else {
            res.status(200).json({ success: false, message: "Project not found" });
        }
    }
    catch (e) {
        res.status(200).json({ success: false, message: "An error has occurred" });
    }
}));
router.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, github_url, language, description, active, live_url, image_url } = req.body;
    try {
        const project = yield db_1.prisma.project.create({
            data: {
                live_url,
                name,
                github_url,
                language,
                description,
                active,
                image_url,
                owner: {
                    connect: { id: req.session.user.id }
                }
            }
        });
        res.status(200).json({ success: true, project });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, github_url, language, description, active, live_url, image_url } = req.body.project;
    try {
        const project = yield db_1.prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                name,
                github_url,
                language,
                description,
                active,
                live_url,
                image_url
            }
        });
        res.status(200).json({ success: true, project });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const project = yield db_1.prisma.project.findUnique({
            where: { id: parseInt(id) }
        });
        if (project) {
            if (project.ownerId === req.session.user.id) {
                yield db_1.prisma.project.delete({
                    where: { id: parseInt(id) }
                });
                res.status(200).json({ success: true });
            }
            else {
                res.status(200).json({ success: false, message: "You can only delete your own projects" });
            }
        }
        else {
            res.status(200).json({ success: false, message: "Project not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map