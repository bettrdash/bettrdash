import express from "express";
import { prisma } from "db";

const router = express.Router();

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (project) {
    res.status(200).json({ success: true, status: project.status });
  } else {
    res.status(200).json({ success: false, message: "Project not found" });
  }
});
export default router;
