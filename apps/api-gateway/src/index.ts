import "dotenv-safe/config";
import gateway from "fast-gateway";
import {prisma} from "db";

const main = async () => {
  let services = await prisma.service.findMany();
  gateway({
    routes:services.map((service: any) => {
      return {
        prefix: service.prefix,
        target: service.target,
      };
    }),
  })
    .start(process.env.PORT)
    .then(() => {
      console.log(`API Gateway is running on port ${process.env.PORT}`);
    });
};

main();
