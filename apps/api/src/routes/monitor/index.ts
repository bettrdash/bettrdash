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
    },
  });

  res.status(200).json({ success: true, projects });
});

export default router