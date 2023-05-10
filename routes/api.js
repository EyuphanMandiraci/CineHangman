import express from "express";
import GoogleImages from "googleimg";
import dotenv from "dotenv";

dotenv.config();


const router = express.Router();

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function removePunctuation(str) {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
}

function removeThe(str) {
    if(str.endsWith(" The")) {
        return "The " + str.slice(0, -4)
    }
    return str
}

const client = new GoogleImages(process.env.GOOGLE_ID, process.env.GOOGLE_API_KEY)

router.get("/", async (req, res) => {
    let movie = await fetch("https://api.movierankings.net/reviews/random", {
        method: "GET",
        headers: {
            'authority': 'api.movierankings.net',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-TR,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-GB;q=0.6,en-US;q=0.5',
            'cache-control': 'no-cache',
            'cookie': '_ga_CKRCG3YH53=GS1.1.1683701125.1.0.1683701125.0.0.0; _ga=GA1.2.1845453665.1683701126; _gid=GA1.2.1148112839.1683701126; _gat_gtag_UA_168790011_2=1',
            'decades': '',
            'dnt': '1',
            'genres': '',
            'min': '0',
            'origin': 'https://www.movierankings.net',
            'pragma': 'no-cache',
            'providers': '',
            'ratingrange': '0@100',
            'referer': 'https://www.movierankings.net/',
            'runtime': '242',
            'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'subgenres': '',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
        }
    });
    movie = await movie.json();
    movie = removeThe(removePunctuation(movie[0].movie))

    const r = await client.search(`${movie} movie scene`)
    await res.json({
        name: movie,
        image: choose(r).link
    })
})

router.get("/newImage", async (req, res) => {
    const {name} = req.query
    const r = await client.search(`${name} movie scene`)
    await res.json({
        name: name,
        image: choose(r).link
    })
})

export default router;