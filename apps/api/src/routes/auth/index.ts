import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "db";

const router = express.Router();

const saltRounds = 10;

router.get(
  "/current-session",
  (req: express.Request, res: express.Response) => {
    const user = req.session?.user;
    (req.session)
    if (!user) {
      res.status(200).json({ success: false, message: "Unauthorized" });
      return;
    }
    res.status(200).json({ success: true, user });
  }
);

router.post("/login", async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password || email === "" || password === "") {
      res
        .status(200)
        .json({ success: false, message: "Incorrect email or password" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res
          .status(200)
          .json({ success: false, message: "Incorrect email or password" });
      } else {
        const match = await bcrypt.compare(password, user.password!);
        if (match) {
          let { password, createdAt, updatedAt, ...other } = user;
          req.session.user = other;
          res.status(200).json({ success: true });
        } else {
          res
            .status(200)
            .json({ success: false, message: "Incorrect email or password" });
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

router.post("/signup", async (req: express.Request, res: express.Response) => {
  const { name, email, password } = req.body;
  try {
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    ) {
      res
        .status(200)
        .json({ success: false, message: "Missing required fields" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        res
          .status(200)
          .json({ success: false, message: "Email in use" });
      } else {
        await bcrypt.hash(password, saltRounds).then(async (hash) => {
          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hash,
            },
          });
          const { password, createdAt, updatedAt, ...other } = newUser;
          /* 
          Needs testing to see if this works
          // await prisma.apikey.create({
          //   data: {
          //     key: v1(),
          //     user: {
          //       connect: {
          //         id: req.session!.user!.id,
          //       },
          //     },
          //   },
          // });
          */
          req.session.user = other;
          res.status(200).json({ success: true });
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

router.post("/logout", (req: express.Request, res: express.Response) => {
  try {
    req.session!.destroy((err) => {
      if (err) {
        res.status(200).json({ success: false, message: "Unable to logout" });
      } else {
        res.json({ success: true });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: e.message });
  }
});

//update user data
router.post(
  "/update-profile",
  async (req: express.Request, res: express.Response) => {
    const { name, email, currentPassword, newPassword, profile_img } = req.body;
    try {
      if (!name || !email || name === "" || email === "" ) {
        res.status(200).json({ success: false, message: "Missing required fields" });
      } else {
        if (currentPassword && newPassword) {
          const user = await prisma.user.findUnique({where: {id: req!.session!.user!.id}})
          if (user) {
            const match = await bcrypt.compare(currentPassword, user.password!);
            if (match) {
              await bcrypt.hash(newPassword, saltRounds).then(async (hash) => {
                const newUser = await prisma.user.update({
                  where: {
                    id: req!.session!.user!.id,
                  },
                  data: {
                    name,
                    email,
                    profile_img,
                    password: hash,
                  },
                });
                const { password, createdAt, updatedAt, ...other } = newUser;
                req.session.user = other;
                res.status(200).json({ success: true });
              });
            } else {
              res.status(200).json({ success: false, message: "Incorrect password" });
            }
          }
        } else {
          const newUser = await prisma.user.update({
            where: {
              id: req!.session!.user!.id,
            },
            data: {
              name,
              email,
              profile_img
            },
          });
          const { password, createdAt, updatedAt, ...other } = newUser;
          req.session.user = other;
          res.status(200).json({ success: true });
        } 
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "An error has occurred" });
    }
  }
);

export default router;
