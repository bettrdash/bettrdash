import "dotenv-safe/config";
import gateway from "fast-gateway";
import {prisma} from "db";

const main = async () => {
  let services = await prisma.service.findMany();
  console.log(services)
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
      console.log(`Server is running on port ${process.env.PORT}`);
    });
};

main();
