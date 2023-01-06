import express from "express";
import { prisma } from "db";

const router = express.Router();

router.get("/", async (req, res) => {
  const key = req.query.key as string;
  try {
    if (key) {
      let apiKey = await prisma.apikey.findUnique({
        where: { key },
        include: {
          user: true,
        },
      });

      if (apiKey) {
        let projects = [] as any;
        const activeProjects = await prisma.project.findMany({
          where: {
            ownerId: apiKey.user.id,
            active: true,
          },
          orderBy: {
            name: "desc",
          },
          select: {
            live_url: true,
            name: true,
            github_url: true,
            language: true,
            description: true,
            active: true,
            image_url: true,
            createdAt: true,
            updatedAt: true,
            websites: {
              where: {
                default: true
              }
            }
          },
        });
        if (apiKey.user.show_inactive_projects) {
          console.log("hi");
          let inactiveProjects = await prisma.project.findMany({
            where: {
              ownerId: apiKey.user.id,
              active: false,
            },
            orderBy: {
              name: "desc",
            },
            select: {
              name: true,
              live_url: true,
              github_url: true,
              language: true,
              description: true,
              active: true,
              image_url: true,
              createdAt: true,
              updatedAt: true,
              websites: {
                where: {
                  default: true
                }
              }
            },
          });
          projects = [...inactiveProjects, ...activeProjects];
          res.json({ projects }).status(200);
          return;
        }
        projects = [...activeProjects];
        res.json({ projects }).status(200);
      } else {
        res.status(404).json({ success: false, message: "Invalid api key" });
      }
    } else {
      res.status(404).json({ success: false, message: "Invalid api key" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

export default router;
