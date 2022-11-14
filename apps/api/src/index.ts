import "dotenv-safe/config";
import "reflect-metadata";
import express from "express";
const morgan = require("morgan");

//routes
import auth from "./routes/auth";
import project from "./routes/project";
import apiAuth from "./routes/api/auth";
import apiNoAuth from "./routes/api/noauth";
import monitor from './routes/monitor'

const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
  const app = express();

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
    )
  );

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const origin = req.headers.origin || "";
      res.setHeader("Access-Control-Allow-Origin", origin as string);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); //@ts-ignore
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    }
  );

  app.use(express.json());

  //redis
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        secure: true,
        // secure: process.env.NODE_ENV === 'production' ? true : false, // if true: only transmit cookie over https, in prod, always activate this
        // httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 60 * 60 * 1000 * 24 * 3, // session max age in milliseconds (3 days)
        // explicitly set cookie to lax
        // to make sure that all cookies accept it
        // you should never use none anyway
        // sameSite: "none",
      },
    })
  );

  const authenticate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.session || !req.session.user) {
      req
      res.status(200).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  };

  app.get("/", (_, res: express.Response) => {
    res.send("Hello world");
  });

  app.use("/v1/auth", auth);
  app.use("/v1/api", apiNoAuth);

  app.use(authenticate);
  app.use("/v1/projects", project);
  app.use("/v1/api", apiAuth);
  app.use('/v1/monitor', monitor)

  app.use((_, res: express.Response) => {
    res.status(404).json({ status: "404" });
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
};

main();
