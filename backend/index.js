
// Required Imports 
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import QRCode from "qrcode"

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  //json parsing if this does not works 


// Connecting the Database 
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB is connected successfully"))
    .catch((err) => console.log("Failed to connect database", err))


// Model for the URL  
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type: Number, default: 0 }
});

// Making Model Useable
const Url = mongoose.model("Url", urlSchema);

// REST API's 
app.post("/api/short", async (req, res) => {
    try {

        const { originalUrl } = req.body;
        if (!originalUrl) return res.status(400).json({ error: "URL not found" });
        const shortUrl = nanoid(8);
        const url = new Url({ originalUrl, shortUrl });

        const myUrl = `http://localhost:3000/${shortUrl}`

        const qrCodeImg = await QRCode.toDataURL(myUrl);

        await url.save();
        return res.status(200).json({ message: "URL Generated", shortUrl: myUrl, qrCodeImg })

    } catch (error) {

        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
});

app.get("/:shortUrl", async (req, res) => {

    try {

        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (url) {
            url.clicks++;
            console.log(`Short URL clicked: ${shortUrl}, Total Clicks: ${url.clicks}`);
            await url.save();
            return res.redirect(url.originalUrl)
        } else {
            return res.status(404).json({ error: "URL not found" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/clicks/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (url) {
        return res.status(200).json({ clicks: url.clicks });
    } else {
        return res.status(404).json({ error: "URL not found" });
    }
});



// Running the server 
app.listen(3000, () => console.log("Server is running on Port 3000"))