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
const cron_1 = __importDefault(require("cron"));
require("dotenv-safe/config");
const db_1 = require("db");
const status_1 = __importDefault(require("./routes/status"));
const axios_1 = __importDefault(require("axios"));
const url_1 = require("./utils/url");
const main = () => {
    const app = (0, express_1.default)();
    app.use("/v1/status", status_1.default);
    const CronJob = cron_1.default.CronJob;
    try {
        const job = new CronJob("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            let projects = yield db_1.prisma.project.findMany({
                select: {
                    id: true,
                    live_url: true,
                    name: true,
                    status: true,
                },
            });
            projects.forEach((project) => __awaiter(void 0, void 0, void 0, function* () {
                if ((0, url_1.isURL)(project.live_url)) {
                    yield axios_1.default
                        .get(project.live_url)
                        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res.status === 200) {
                            yield db_1.prisma.project.update({
                                where: {
                                    id: project.id,
                                },
                                data: {
                                    status: "UP",
                                },
                            });
                        }
                        else {
                            yield db_1.prisma.project.update({
                                where: {
                                    id: project.id,
                                },
                                data: {
                                    status: "DOWN",
                                },
                            });
                        }
                    }))
                        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                        yield db_1.prisma.project.update({
                            where: {
                                id: project.id,
                            },
                            data: {
                                status: "INVALID URL",
                            },
                        });
                        console.log(e);
                        return e;
                    }));
                }
                else {
                    yield db_1.prisma.project.update({
                        where: {
                            id: project.id,
                        },
                        data: {
                            status: "NO LIVE URL",
                        },
                    });
                }
            }));
        }), null, true, "America/Los_Angeles");
        job.start();
    }
    catch (e) {
        console.log(e);
    }
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Monitor API ready at http://localhost:${process.env.PORT}`);
    });
};
main();
//# sourceMappingURL=index.js.map