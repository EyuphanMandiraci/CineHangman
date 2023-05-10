import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl
    let r = await fetch(url + "api")
    let data = await r.json()
    res.render("index", {
        name: data.name,
        image: data.image
    })
})

export default router;