import "dotenv-safe/config";
import gateway from "fast-gateway";
import registry from "./utils/registry.json";
console.log(registry)
gateway({
  routes: registry.map((service: any) => {
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
