const express = require("express");
const mongoose = require("mongoose");
const qrcode = require('qrcode');
const ShortUrl = require("./models/shortUrl"); // Make sure this path is correct

const app = express();
// Connect to the database
mongoose.connect("mongodb://localhost/urlSnapify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to DB:)'))
    .catch(error => console.error('Database connection error:', error));

// Set the view engine to EJS
app.set("view engine", "ejs");


// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Display the main page
app.get("/", async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find();
        res.render("index", { shortUrls: shortUrls });
    } catch (error) {
        console.error('Error fetching short URLs:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission to create short URLs
// Handle form submission to create short URLs
app.post("/shortUrls", async (req, res) => {
    const { fullUrl } = req.body;

    try {
        // Check if the URL already exists in the database
        const existingShortUrl = await ShortUrl.findOne({ full: fullUrl });

        if (existingShortUrl) {
            // If it exists, return the existing short URL
            return res.redirect("/");
        }

        // If it doesn't exist, create a new short URL
        await ShortUrl.create({ full: fullUrl });
        res.redirect("/");
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Delete the url 
app.post('/delete/:shortUrl', async (req, res) => {
    await ShortUrl.deleteOne({ short: req.params.shortUrl }).then(() => {
        console.log(req.body.shortUrl + " Entry Deleted")
    }).catch(() => {
        console.log(error)
    })
    res.redirect('/')
});

// Redirect to the original URL when given a short URL
app.get("/:shortUrl", async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
        if (shortUrl == null) return res.sendStatus(404);

        // Increment click count and save
        shortUrl.clicks++;
        await shortUrl.save();

        // Redirect to the full URL
        res.redirect(shortUrl.full);
    } catch (error) {
        console.error('Error redirecting to full URL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// QR Code 
app.get("/qrCode/:shortUrl", async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
        if (!shortUrl) {
            return res.sendStatus(404);
        }

        // Generate the QR code for the short URL
        const qrCodeData = await qrcode.toDataURL(shortUrl.full);

        // Render the qrCode.ejs template and pass the QR code data as a variable
        res.render("qrCode", { qrCodeURL: qrCodeData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`I am Billionaire 💸💸💸💸`));
