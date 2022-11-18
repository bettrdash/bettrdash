import express from "express";
import cron from "cron";
import "dotenv-safe/config";
import { prisma } from "db";
import status from "./routes/status";
import axios from "axios";
import { isURL } from "./utils/url";

const main = () => {
  const app = express();

  app.use("/v1/status", status);
  //cron
  const CronJob = cron.CronJob;

  //run every 5 minutes
  try {
    const job = new CronJob(
      "*/5 * * * *",
      async () => {
        let projects = await prisma.project.findMany({
          select: {
            id: true,
            live_url: true,
            name: true,
            status: true,
          },
        });
        projects.forEach(async (project) => {
          if (isURL(project.live_url as string)) {
            await axios
              .get(project.live_url!)
              .then(async (res) => {
                if (res.status === 200) {
                  if (project.status !== "ONLINE") {
                    await prisma.project.update({
                      where: {
                        id: project.id,
                      },
                      data: {
                        status: "ONLINE",
                      },
                    });
                  }
                } else {
                  if (project.status !== "DOWN") {
                    await prisma.project.update({
                      where: {
                        id: project.id,
                      },
                      data: {
                        status: "DOWN",
                      },
                    });
                  }
                }
              })
              .catch(async (e) => {
                await prisma.project.update({
                  where: {
                    id: project.id,
                  },
                  data: {
                    status: "INVALID URL",
                  },
                });
                console.log(e);
                return e;
              });
          } else {
            await prisma.project.update({
              where: {
                id: project.id,
              },
              data: {
                status: "NO LIVE URL",
              },
            });
          }
        });
      },
      null,
      true,
      "America/Los_Angeles"
    );
    job.start();
  } catch (e) {
    console.log(e);
  }

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Monitor API ready at http://localhost:${process.env.PORT}`);
  });
};

main();
