import express from "express";
import { prisma } from "db";

const router = express.Router();

//get users projects
router.get("/all", async (req: express.Request, res: express.Response) => {
  try {
    const { filter } = req.query;
    console.log(filter);
    
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req!.session!.user!.id,
      },
      orderBy:
        filter === "name"
          ? { name: "asc" }
          : filter === "active"
          ? { active: "desc" }
          : { status: "desc" },
      include: {
        websites: {
          where: {
            default: true,
          },
          // orderBy: {
          //   environment: "asc",
          // },
        },
      },
    });
    res.status(200).json({ success: true, projects });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

//get single project by id
router.get(
  "/single/:projectId",
  async (req: express.Request, res: express.Response) => {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id: parseInt(req.params.projectId),
        },
        include: {
          owner: { select: { id: true } },
          websites: {
            orderBy: {
              url: "asc",
            },
          },
        },
      });
      if (project) {
        if (project.ownerId === req!.session!.user!.id) {
          res
            .status(200)
            .json({ success: true, project, websites: project.websites });
        } else {
          res.status(200).json({ success: false, message: "Unauthorizedsss" });
        }
      } else {
        res.status(200).json({ success: false, message: "Project not found" });
      }
    } catch (e) {
      res
        .status(200)
        .json({ success: false, message: "An error has occurred" });
    }
  }
);

//new project
router.post("/new", async (req: express.Request, res: express.Response) => {
  const {
    name,
    github_url,
    language,
    description,
    active,
    url,
    environment,
    image_url,
  } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        github_url,
        language,
        description,
        active,
        image_url,
        owner: {
          connect: { id: req!.session!.user!.id },
        },
      },
    });

    if (url) {
      await prisma.website.create({
        data: {
          url,
          environment,
          project: {
            connect: {
              id: project.id,
            },
          },
          owner: { connect: { id: req!.session!.user!.id } },
        },
      });
    }
    res.status(200).json({ success: true, project });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

//update project
router.post("/update", async (req: express.Request, res: express.Response) => {
  const { id, name, github_url, language, description, active, image_url } =
    req.body.project;
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        github_url,
        language,
        description,
        active,
        image_url,
      },
    });

    res.status(200).json({ success: true, project });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

//delete project
router.post("/delete", async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (project) {
      if (project.ownerId === req!.session!.user!.id) {
        await prisma.project.delete({
          where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({
          success: false,
          message: "You can only delete your own projects",
        });
      }
    } else {
      res.status(200).json({ success: false, message: "Project not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

export default router;
