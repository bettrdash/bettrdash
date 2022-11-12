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
      "*/1 * * * *",
      async () => {
        let projects = await prisma.project.findMany({
          select: {
            id: true,
            live_url: true,
          },
        });

        projects.forEach(async (project) => {
          console.log(`fetching project - ${project.id}`);
          if (isURL(project.live_url as string)) {
            await axios
              .get(project.live_url as string)
              .then((res) => {
                if (res.status === 200) {
                  prisma.project.update({
                    where: {
                      id: project.id,
                    },
                    data: {
                      status: "UP",
                    },
                  });
                } else {
                  prisma.project.update({
                    where: {
                      id: project.id,
                    },
                    data: {
                      status: "DOWN",
                    },
                  });
                }
              })
              .catch((e) => {
                prisma.project.update({
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
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
};

main();
