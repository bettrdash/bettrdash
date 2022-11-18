import express from "express";
import { prisma } from "db";
import { v1 } from "uuid";

const router = express.Router();

//get api token
router.get("/key", async (req, res) => {
  try {
    const apiKey = await prisma.apikey.findUnique({
      where: { userId: req!.session!.user!.id },
    });
    if (apiKey) {
      res.status(200).json({ success: true, apiKey: apiKey.key });
    } else {
      res.status(200).json({ success: false, message: "No api key" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

//create api token
router.post("/generate-key", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true },
    });
    if (user && user.api_key) {
      await prisma.apikey.delete({ where: { id: user.api_key.id } });
    }

    const apiKey = await prisma.apikey.create({
      data: {
        key: v1(),
        user: {
          connect: {
            id: req.session!.user!.id,
          },
        },
      },
    });
    res.status(200).json({ success: true, apiKey: apiKey.key });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

//api key settings
router.get("/settings", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true },
    });
    if (user) {
      const settings = {
        show_inactive_projects: user.show_inactive_projects,
        authorized_urls: new Array('user.api_key.authorized_urls', 'fs')
      };
      res.status(200).json({ success: true, settings });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

//update api key settings
router.post("/settings/update", async (req, res) => {
  const { show_inactive_projects } = req.body.settings;
  console.log(show_inactive_projects)
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { show_inactive_projects: show_inactive_projects },
      });
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
}); 

//get projects with api key 


export default router;
