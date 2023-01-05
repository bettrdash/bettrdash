import express from "express";
import { prisma } from "db";
import axios from "axios";

axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.PLAUSIBLE_API_KEY}`;

const router = express.Router();

router.get("/all", async (req: express.Request, res: express.Response) => {
  try {
    let stats = [] as any;
    const websites = await prisma.website.findMany({
      where: {
        ownerId: req!.session!.user!.id,
        tracking: true,
      },
      orderBy: {
        url: "asc",
      },
    });
    for (var i = 0; i < websites.length; i++) {
      await axios
        .get(
          `${process.env.ANALYTICS_API}/stats/realtime/visitors?site_id=${websites[i].url}`
        )
        .then((response) => {
          if (response.status === 200) {
            stats.push({
              website: websites[i],
              currentVisitors: response.data,
            });
          }
        });
    }
    const allWebsites = await prisma.website.findMany({
      where: { ownerId: req!.session!.user!.id, tracking: false },
      orderBy: {url: 'asc'}
    });
    res.status(200).json({ success: true, websites: stats, allWebsites });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "An error has occurred" });
  }
});

router.post("/track", async (req: express.Request, res: express.Response) => {
  const { id, timezone } = req.body;
  try {
    const website = await prisma.website.findUnique({ where: { id } });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        if (!website.tracking) {
          await prisma.website.update({
            where: { id },
            data: { tracking: true },
          });
          await axios
            .post(`${process.env.ANALYTICS_API}/sites`, {
              domain: website.url,
              timezone,
            })
            .then((response) => {
              if (response.status === 200) {
                res.status(200).json({ success: true });
              } else if (response.status === 400) {
                if (
                  response.data.error.includes(
                    "This domain has already been taken"
                  )
                ) {
                  res.status(200).json({
                    success: false,
                    message: "Website is already being tracked",
                  });
                } else {
                  res
                    .status(200)
                    .json({ success: false, message: response.data.error });
                }
              } else {
                res
                  .status(200)
                  .json({ success: false, message: "An error has occurred" });
              }
            });
        } else {
          res.status(200).json({
            success: false,
            message: "Website is already being tracked",
          });
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

router.post("/remove", async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  console.log(id)
  try {
    const website = await prisma.website.findUnique({ where: { id } });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        if (website.tracking) {
          await prisma.website.update({
            where: { id },
            data: { tracking: false },
          });
          await axios
            .delete(`${process.env.ANALYTICS_API}/sites/${website.url}`)
            .then((response) => {
              if (response.data.deleted) {
                res.status(200).json({ success: true });
              } else if (response.data.error) {
                res
                  .status(200)
                  .json({ success: false, message: response.data.error });
              } else {
                res
                  .status(200)
                  .json({ success: false, message: "An error has occurred" });
              }
            })
            .catch((e) => {
              console.log(e);
              res
                .status(200)
                .json({ success: false, message: "An error has occurred" });
            });
        } else {
          res.status(200).json({
            success: false,
            message: "Website is not being tracked",
          });
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

router.get('/website/:id/sources', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  try {
    console.log(id)
    const website = await prisma.website.findUnique({ where: { id: parseInt(id) } });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        if (website.tracking) {
          await axios.get(`${process.env.ANALYTICS_API}/stats/breakdown?site_id=${website.url}&period=30d&property=visit:source&metrics=visitors&limit=10`).then(response => {
            if (response.status === 200) {
              res.status(200).json({ success: true, sources: response.data, websiteUrl: website.url })
            } else {
              res.status(200).json({ success: false, message: 'An error has occurred' })
            }
          })
        } else {
          res.status(200).json({ success: false, message: 'Website is not being tracked' })
        }
      } else {
        res.status(200).json({ success: false, message: 'Website not found' })
      }
    } else {
      res.status(200).json({ success: false, message: 'Website not found' })
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: 'An error has occurred' })
  }
})


router.get('/website/:id/aggregate', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  try {
    const website = await prisma.website.findUnique({ where: { id: parseInt(id) } });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        if (website.tracking) {
          await axios.get(`${process.env.ANALYTICS_API}/stats/aggregate?site_id=${website.url}&period=30d&metrics=visitors,pageviews,bounce_rate,visit_duration`).then(response => {
            if (response.status === 200) {
              res.status(200).json({ success: true, aggregate: response.data, websiteUrl: website.url })
            } else {
              console.log(response)
              res.status(200).json({ success: false, message: 'An error has occurred' })
            }
          })
        } else {
          res.status(200).json({ success: false, message: 'Website is not being tracked' })
        }
      } else {
        res.status(200).json({ success: false, message: 'Website not found' })
      }
    } else {
      res.status(200).json({ success: false, message: 'Website not found' })
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: 'An error has occurred' })
  }
})


router.get('/website/:id/top-pages', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  try {
    const website = await prisma.website.findUnique({ where: { id: parseInt(id) } });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        if (website.tracking) {
          await axios.get(`${process.env.ANALYTICS_API}/stats/breakdown?site_id=${website.url}&period=30d&property=event:page&limit=10`).then(response => {
            if (response.status === 200) {
              res.status(200).json({ success: true, topPages: response.data, websiteUrl: website.url })
            } else {
              res.status(200).json({ success: false, message: 'An error has occurred' })
            }
          })
        } else {
          res.status(200).json({ success: false, message: 'Website is not being tracked' })
        }
      } else {
        res.status(200).json({ success: false, message: 'Website not found' })
      }
    } else {
      res.status(200).json({ success: false, message: 'Website not found' })
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: 'An error has occurred' })
  }
})

export default router;
