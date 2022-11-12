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
const db_1 = require("db");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.session.user;
    if (!user) {
        res.status(200).json({ success: false, message: "Unauthorized" });
        return;
    }
    const projects = yield db_1.prisma.project.findMany({
        where: {
            ownerId: req.session.user.id,
        },
        orderBy: [
            {
                name: "asc",
            },
            {
                status: "asc",
            },
        ],
        select: {
            id: true,
            status: true,
            live_url: true,
        },
    });
    res.status(200).json({ success: true, projects });
}));
exports.default = router;
//# sourceMappingURL=index.js.map