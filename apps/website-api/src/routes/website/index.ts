import { prisma } from "db";
import express from "express";

const router = express.Router();

router.get("/all", async (req: express.Request, res: express.Response) => {
  try {
    const websites = await prisma.website.findMany({
      where: { owner: { id: req!.session!.user!.id } },
    });

    res.status(200).json({ success: true, websites });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

router.get(
  "/all/:projectId",
  async (_req: express.Request, res: express.Response) => {
    try {
      let project = await prisma.project.findUnique({
        where: { id: parseInt(_req.params.projectId) },
        include: { websites: true },
      });
      if (project) {
        if (project?.ownerId === _req!.session!.user!.id) {
          res.status(200).json({
            success: true,
            websites: project.websites,
            projectName: project.name,
          });
        } else {
          res.status(200).json({ success: false, message: "Unauthorized" });
        }
      } else {
        res.status(200).json({ success: false, message: "Project not found" });
      }
    } catch (e) {
      console.log(e);
      res
        .status(200)
        .json({ success: false, message: "An error has occurred" });
    }
  }
);

router.post("/new", async (req: express.Request, res: express.Response) => {
  const { url, environment, projectId } = req.body;
  console.log(projectId);
  try {
    if (url) {
      const website = await prisma.website.create({
        data: {
          url,
          environment,
          project: projectId ? { connect: { id: projectId } } : undefined,
          owner: { connect: { id: req!.session!.user!.id } },
        },
      });
      res.status(200).json({ success: true, website });
    } else {
      res.status(200).json({ success: false, message: "Missing url field" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

router.post("/update", async (req: express.Request, res: express.Response) => {
  const { url, environment, id } = req.body;
  const makeDefault = req.body.default;

  try {
    const website = await prisma.website.findUnique({
      where: { id },
      include: { project: true },
    });
    if (website) {
      console.log(website);
      if (website.ownerId === req!.session!.user!.id) {
        const updatedWebsite = await prisma.website.update({
          where: { id: website.id },
          data: {
            url,
            environment,
            default: makeDefault,
          },
        });
        if (makeDefault && website.projectId) {
          let project = await prisma.project.findUnique({
            where: { id: website.projectId },
          });
          if (project) {
            if (project.defaultWebsiteId) {
              await prisma.website.update({
                where: { id: project.defaultWebsiteId },
                data: { default: false },
              });
            }
            await prisma.project.update({
              where: { id: project.id },
              data: {
                defaultWebsiteId: updatedWebsite.id,
              },
            });
            res.status(200).json({ success: true });
          } else {
            res
              .status(200)
              .json({ success: false, message: "Error updating website" });
          }
        } else if (website.project) {
          if (
            website.project.defaultWebsiteId === website.id &&
            makeDefault === false
          ) {
            await prisma.project.update({
              where: { id: website.project.id },
              data: {
                defaultWebsiteId: null,
              },
            });
            res.status(200).json({ success: true });
          } else {
            res.status(200).json({ success: true });
          }
        } else {
          res.status(200).json({ success: true });
        }
      }
    } else {
      res.status(200).json({ success: false, message: "Website not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

router.post('/delete', async(req: express.Request, res: express.Response) => {
  const { id } = req.body;
  try {
    const website = await prisma.website.findUnique({
      where: { id },
      include: { project: true },
    });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        await prisma.website.delete({
          where: { id: website.id },
        });
        if (website.project) {
          if (website.project.defaultWebsiteId === website.id) {
            await prisma.project.update({
              where: { id: website.project.id },
              data: {
                defaultWebsiteId: null,
              },
            });
          }
        }
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, message: "Unauthorized" });
      }
    } else {
      res.status(200).json({ success: false, message: "Website not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
})


//migrate live_url to website 
router.post('/migrate', async(_req, res: express.Response) => {
  try {
    const projects = await prisma.project.findMany()
    for (let i=0; i<projects.length; i++) {
      const project = projects[i]
      if (project.live_url) {
        if (project.live_url.length > 0) {
          const website = await prisma.website.create({
            data: {
              url: project.live_url,
              environment: 'production',
              project: { connect: { id: project.id } },
              owner: { connect: { id: project.ownerId } },
              default: true
            },
          })
          await prisma.project.update({
            where: { id: project.id },
            data: {
              live_url: null,
              defaultWebsiteId: website.id
            }
          })
        }
      }
    }
    res.json({success: true})
  } catch(e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
})

export default router;
