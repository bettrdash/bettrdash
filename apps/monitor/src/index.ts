import express from "express";
import cron from "cron";
import "dotenv-safe/config";
import { prisma } from "db";
const main = () => {
  const app = express();

  //cron
  const CronJob = cron.CronJob;

  //run every 5 minutes
  const job = new CronJob(
    "*/5 * * * *",
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
        let status = await fetch(project.live_url as string);
        if (project.live_url !== "") {
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

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
};

main();
