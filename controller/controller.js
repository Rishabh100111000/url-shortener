
const { nanoid } = require("nanoid");
const Url = require("../model/URL");

const createShortUrl = async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const url = req.body.url;

        if (!url) {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        const shortCode = nanoid(6);

        const newUrl = await Url.create({

            originalUrl: url,

            shortCode: shortCode

        });

        return res.status(201).json(newUrl);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error: "Internal Server Error"
        });

    }

};

const redirectToOriginalUrl = async (req, res) => {

    try {

        const shortCode = req.params.shortCode;

        const url = await Url.findOne({

            shortCode: shortCode

        });

        if (!url) {

            return res.status(404).json({

                error: "URL not found"

            });

        }

        return res.redirect(url.originalUrl);

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            error: "Internal Server Error"

        });

    }

};

module.exports = {

    createShortUrl,

    redirectToOriginalUrl

};