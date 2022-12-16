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
        let websites = await prisma.website.findMany();
        websites.forEach(async (website) => {
          if (isURL(website.url as string)) {
            let url = website.url;
            if (website.url.substring(0, 4) !== "http") {
              url = "https://" + website.url;
            }
            await axios
              .get(url)
              .then(async (res) => {
                if (res.status === 200) {
                  if (website.status !== "UP") {
                    await prisma.website.update({
                      where: {
                        id: website.id,
                      },
                      data: {
                        status: "UP",
                      },
                    });
                  }
                } else {
                  if (website.status !== "DOWN") {
                    await prisma.website.update({
                      where: {
                        id: website.id,
                      },
                      data: {
                        status: "UP",
                      },
                    });
                  }
                }
              })
              .catch(async (e) => {
                await prisma.website.update({
                  where: {
                    id: website.id,
                  },
                  data: {
                    status: "INVALID URL",
                  },
                });
                console.log(e);
                return e;
              });
          } else {
            await prisma.website.update({
              where: {
                id: website.id,
              },
              data: {
                status: "INVALID URL",
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
