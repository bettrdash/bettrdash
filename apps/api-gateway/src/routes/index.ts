// import express from "express";
// import registry from "../utils/registry.json";
// import axios from "axios";

// interface Service {
//   apiName: string;
//   host: string;
//   port: number;
//   url: string;
// }

// const router = express.Router();

// router.all(
//   "/:apiName/:path/:route1/:route2",
//   (req: express.Request, res: express.Response) => {
//     const { apiName, path, route1, route2 } = req.params;
//     console.log(req.url);
//     //check if apiName exists in registry
//     if (registry[apiName as keyof typeof registry]) {
//       const { url } = registry[apiName as keyof typeof registry] as Service;
//       console.log(path);
//       axios({
//         method: req.method,
//         url: `${url}/${path}/${route1}/${route2}`,
//         data: req.body,
//       })
//         .then((response) => {
//           res.send(response.data);
//         })
//         .catch((error) => {
//           res.send(error.message);
//         });
//     } else {
//       res.send("API not found");
//     }
//   }
// );

// export default router;
