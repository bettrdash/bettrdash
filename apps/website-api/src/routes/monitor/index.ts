import { prisma } from "db";
import express from "express";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const user = req!.session!.user!;

  if (!user) {
    res.status(200).json({ success: false, message: "Unauthorized" });
    return;
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: req!.session!.user!.id,
    },
    orderBy: [
      {
        name: "desc",
      },
      {
        status: "desc",
      },
    ],
    select: {
      id: true,
      status: true,
      live_url: true,
      name: true,
    },
  });

  res.status(200).json({ success: true, projects });
});

router.post("/new", async (req: express.Request, res: express.Response) => {
  try {
    const { url, environment, projectId = null } = req.body;
    if (!url) {
      res.status(200).json({ success: false, message: "Missing fields" });
      return;
    } else {
      const website = await prisma.website.create({
        data: {
          url,
          environment,
          project: projectId
            ? {
                connect: {
                  id: projectId,
                },
              }
            : undefined,
        },
      });
      res.json({ success: true, website });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

export default router;
