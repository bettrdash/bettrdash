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
          where: {
            active: true,
          },
          select: {
            id: true,
            live_url: true,
          },
        });

        projects.forEach(async (project) => {
          console.log(`fetching project - ${project.id}`);
          if (isURL(project.live_url as string)) {
            let status = await axios.get(project.live_url as string);
            if (status.status === 200) {
              await prisma.project.update({
                where: {
                  id: project.id,
                },
                data: {
                  status: "UP",
                },
              });
            } else {
              await prisma.project.update({
                where: {
                  id: project.id,
                },
                data: {
                  status: "DOWN",
                },
              });
            }
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
