const db = require("../models")
const Chat = db.chat
const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();
const axios = require('axios');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res, next) => {
    try {
        const newChat = new Chat({
            user: req.user._id,
            name: req.body.name,
            messages: []
        })

        const chat = await newChat.save()
        return res.json(chat)
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req, res, next) => {
    try {
        const chats = await Chat.find({
            user: req.user._id,
        }).sort({ createdAt: -1 })

        return res.json(chats)
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const chats = await Chat.findOne({
            user: req.user._id,
            _id: req.params.id,
        })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
})
router.patch("/:id", async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            user: req.user._id,
            _id: req.params.id,
        })
        if (chat) {
            chat.name = req.body.name
            await chat.save()
        }
        return res.json(chat)
    } catch (error) {
        next(error)
    }

})
router.delete("/:id", async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            user: req.user._id,
            _id: req.params.id,
        })
        if (!chat) return res.status(404).json({ success: false })

        if (chat.type === "PDF_QUERY") axios.post(`${process.env.QUERY_PDF_URL}/delete?filename=${req.user._id}__${chat._id}`, {}, {
            headers: {
                'x-api-key': process.env.QUERY_PDF_KEY
            }
        })

        // remove files from cloudinary
        for (let i = 0; i < chat.messages.length; i++) {
            const message = chat.messages[i];
            for (let j = 0; j < message.images.length; j++) {
                const image = message.images?.[j];
                console.log("destroying image from cloudinary: ", image.public_id);
                if (image?.public_id)
                    cloudinary.uploader.destroy(image.public_id, function (error, result) {
                        console.log(error);
                        console.log(result);
                    });
            }
        }

        chat.remove()
        return res.json({
            success: true,
            message: "chatdeleted"
        })
    } catch (error) {
        next(error)
    }

})
router.delete("/-r/all", async (req, res, next) => {
    try {
        const chats = Chat.find({ user: req.user._id })
        for (let k = 0; k < chats.length; k++) {
            const chat = chats[k];
            for (let i = 0; i < chat.messages.length; i++) {
                const message = chat.messages[i];
                for (let j = 0; j < message.images.length; j++) {
                    const image = message.images[j];
                    console.log("destroying image from cloudinary: ", image?.public_id);
                    if (image?.public_id)
                        cloudinary.uploader.destroy(image.public_id, function (error, result) {
                            console.log(error);
                            console.log(result);
                        });
                }
            }
        }

        Chat.deleteMany({
            user: req.user._id
        })
        return res.json({
            success: true,
            message: "chatdeleted"
        })
    } catch (error) {
        next(error)
    }

})


module.exports = router