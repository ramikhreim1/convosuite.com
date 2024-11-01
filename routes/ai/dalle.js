const express = require('express');
const router = express.Router();
const sharp = require("sharp")

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.route('/dalle').get((req, res) => {
    res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/dalle').post(async (req, res, next) => {
    try {
        const { content, size, n } = req.body;

        const inputRaw = content

        const aiResponse = await openai.createImage({
            prompt: content,
            n: n || 1,
            size: size || '1024x1024',
            response_format: 'b64_json',
        });
        var transformer = await sharp(Buffer.from(aiResponse.data.data[0].b64_json, 'base64')).toFormat("jpeg").toBuffer();
        const images = { b64_json: transformer.toString("base64") };
        req.locals.input = content
        req.locals.inputRaw = inputRaw
        req.locals.images = images
        req.locals.skipFilter = true

        next()
    } catch (error) {
        console.error(error.message)
        next(error)
    }
});

module.exports = router;