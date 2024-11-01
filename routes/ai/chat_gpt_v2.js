const express = require('express');
const app = express.Router();
const { conversationApiSchema } = require('../utils/schemas');
const { fetchSSE } = require('./middleware/SSE');
const { default: axios } = require('../../node_modules/axios/index');
const redisClient = require('../utils/redis');
const getAndUpdateChat = require('./middleware/updateChat');
const innternet_plugin = require("./middleware/internet_plugin");
const { creditPayment } = require('./middleware/index');
const { saveToHistory } = require('./middleware/index');
const parseMessage = require('./middleware/parseMessage');
const createImage = require('./middleware/createImage');
const { queryUrl } = require('../utils/getInfoFromUrl');
const ApiUsage = require('../models/apiUsage');
const getAccessToken = require('../utils/getaccesstoken');


// load distributing to three apis
const apiKeys = [process.env.OPENAI_API_KEY_1, process.env.OPENAI_API_KEY_2, process.env.OPENAI_API_KEY_3];

app.get('/conversation', async (req, res) => {
    // setting headers for SSE
    console.log(req.query);
    res.set({ 'Cache-Control': 'no-cache', 'Content-Type': 'event-stream', 'Connection': 'keep-alive' });
    res.flushHeaders();
    console.log(`${req.user.email} initiated event-stream`)
    try {
        req.query = JSON.parse(req.query?.data)
        await conversationApiSchema.validateAsync(req.query);
        let { message, model, id, realtime, autoThink, brain_id = null } = req.query;
        let parsedMessage = null
        if (autoThink) {
            parsedMessage = await parseMessage(req, res)
        }

        console.log("parsedMessage: ", parsedMessage);

        let updatableMessage = message

        if (req.query.plugin === "internet_access") {
            updatableMessage = await innternet_plugin(updatableMessage)
        }

        let chat = null
        // redish cache
        try {
            console.log(`${req.user.email} requesting redis cache`)
            // const redishChat = await getChatFromRedisCache(id);
            // if (!redishChat) throw new Error("Chat from redish cache not found");
            // chat = JSON.parse(redishChat)
        } catch (error) {
            console.error("Error from redis cache: ", error)
        }
        if (!chat) {
            console.log(`${req.user.email} requesting Chat from database`)
            chat = await getAndUpdateChat(id, req.user._id, brain_id, []);
        }

        if (chat) {
            console.log(chat);
            brain_id = chat.brain_id
            if (brain_id) {
                model = "gpt-4-0613"
            }
        }


        let chatCompletion = "";
        var done = async (data) => {
            console.log(data?.images);
            try {
                const result = await getAndUpdateChat(chat._id, req.user._id, brain_id, [{
                    sender: req.user._id,
                    recipient: "GPT",
                    text: message
                }, {
                    sender: "GPT",
                    recipient: req.user._id,
                    images: data?.images || [],
                    text: data?.chatCompletion,
                    references: data?.references
                }])
                // save to history
                // make credit payment
                req.locals.input = updatableMessage
                req.locals.inputRaw = message
                req.locals.output = data?.chatCompletion
                creditPayment(req, res, () => { console.log(`${req.user.email} payed credits`) })
                saveToHistory(req, res, () => { console.log(`${req.user.email} saved to history`) })
                chatToRedisCache(result);
                console.log(`${req.user.email} saved to redis`)
                res.write(`data: [DONE]\n\n`)
                res.end()
            } catch (error) {
                console.log(error);
                throw new Error(error)
            }
        }

        console.log(`${req.user.email} prompt: ${message}`)
        console.log(`${req.user.email} input prompt: ${updatableMessage}`)
        const apiKey = apiKeys[Math.floor(Math.random() * 3)]
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const startSSE = async ({ system = "", type, references = [], prompt, recource = 'https://api.openai.com/v1/chat/completions', model, data }) => { // resource default to chat
            console.log(`${req.user.email} using api key: ${apiKey}`)
            await fetchSSE(recource, {
                method: 'POST',
                cancelToken: source.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: data || {
                    model: model || "gpt-3.5-turbo",
                    stream: true,
                    messages: [{ role: "system", content: system }, ...chat.messages.slice(-5).map(v => ({ role: v.sender === "GPT" ? "system" : "user", content: v.text })), { role: "user", content: prompt }],
                    temperature: 0.2,
                    user: req.user._id,
                },
                onMessage: (event) => {
                    if (event.data === '[DONE]') {
                        if (references.length) {
                            res.write(`data: ${JSON.stringify({
                                type: "reference",
                                references
                            })}\n\n`)
                        }
                        console.log(`${req.user.email} Event sream ended with response: ${chatCompletion}`)
                        done({
                            chatCompletion, type: type, references: references
                        })
                    } else {
                        const data = JSON.parse(event.data)
                        if (data) {
                            const part = data?.choices?.[0]?.delta?.content || data?.choices?.[0]?.text || ""
                            chatCompletion += part
                            console.log(part, "part");
                            res.write(`data: ${JSON.stringify({ "id": "chatcmpl-7Lp5FpUT2IA0fmSkAU8xcD1Tn3bae", "conversation_id": chat._id, "object": "chat.completion.chunk", "created": 1685435609, "model": "gpt-3.5-turbo-0301", "choices": [{ "delta": { "content": part }, "index": 0, "finish_reason": null }] })}\n\n`)
                        }
                    }
                }
            })
        }

        if (parsedMessage?.type === 'image') {
            req.imageInfo = { prompt: message, n: 1 } // n=1 for 1 image 
            // res.write(`data: ${JSON.stringify({ type: "action", message: "Generating image..." })}\n\n`);
            await createImage(req);
            req.locals.imageUrls = req.images
            res.write(`data: ${JSON.stringify({ type: "image", images: req.images, conversation_id: chat._id })}\n\n`);
            done({ images: req.images })
        } else if (realtime) {
            try {
                req.locals.creditsCost = 2 // 2 times more cost
                const results = await performSearch(message, req)
                let prompt = message + " for the context: "
                for (let i = 0; i < results.length; i++) {
                    const { snippet } = results[i];
                    prompt += snippet + "\n"
                }
                updatableMessage = prompt;
                await startSSE({ prompt: prompt, model: model, references: results.map(result => result.link).slice(0, 4) })

            } catch (error) {
                console.log(error);
                updatableMessage = message;
                // res.write(`data: ${JSON.stringify({ type: "action", message: "Asking chatgpt..." })}\n\n`);
                await startSSE({ prompt: updatableMessage, model: model, })
            }

        } else if (brain_id) {
            const accessToken = getAccessToken({
                _id: req.user._id,
                email: req.user.email,
                accountType: req.user.accountType
            })
            const query = await axios.post(`${process.env.DOC_QUERY_API_DOMAIN}/brain/chat`, {
                "model": "gpt-3.5-turbo-16k-0613",
                "question": message,
                "history": [],
                "temperature": 0,
                "brain_id": brain_id
            }, {
                // params: {
                //     query: message,
                //     brain_id: brain_id,
                //     match_count: 5
                // },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            updatableMessage = JSON.stringify(query.data.answer)
            await startSSE({
                prompt: updatableMessage, model: model
            })
        } else {
            await startSSE({ prompt: updatableMessage, model: model })
        }

        req.on('aborted', () => {
            source.cancel()
            done({ chatCompletion })
            console.log(`${req.user.email} canceled request`)
        })

        return
    } catch (error) {
        console.log(error);
        let errorObj = {}
        if (error.response) {
            await error.response.data.on('data', (e) => {
                errorObj = JSON.parse(e.toString());
                console.log("error: ", errorObj);
                res.write(`data: ${JSON.stringify({ error: errorObj.error })}\n\n`)
                res.write(`data: [DONE]\n\n`)
                res.end()
            });
        } else if (error.error) {
            console.log("got");
            errorObj.message = error.error.message
            errorObj.type = error.error.type
            res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`)
            res.write(`data: [DONE]\n\n`)
            res.end()
        } else {
            console.log("error: ", errorObj);
            errorObj.message = error.message
            errorObj.type = "internal_server_error"
            res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`)
            res.write(`data: [DONE]\n\n`)
            res.end()
        }
        return
    }
});

const chatToRedisCache = async (chat) => redisClient.set(`chat_gpt_${chat._id}`, JSON.stringify(chat));

const getChatFromRedisCache = async (chatId) => await redisClient.get(`chat_gpt_${chatId}`);

async function performSearch(q, req) {

    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                q: q,
                cx: process.env.SEARCH_ENGINE_ID,
                key: process.env.GOOGLE_SEARCH_API_KEY,
                device: "desktop"
            },
        });
        new ApiUsage({
            userId: req.user._id,
            name: "google",
            type: "success",
            message: "Google search successfully",
            requestBody: q,
            responseData: null
        }).save()
        const results = response.data.items;
        return results
    } catch (error) {
        console.log(error);
        // new ApiUsage({
        //     userId: req.user._id,
        //     name: "google",
        //     type: "error",
        //     message: error.message,
        //     requestBody: q
        // }).save()
        return []
    }
}


const getLivePrompt = async (googleResult, query, allDataRecord, length, index, resolve, reject) => {
    try {
        const bestMatches = await queryUrl(googleResult.formattedUrl, query)
        allDataRecord.push(...bestMatches)
        if (length === index.j) {
            resolve(allDataRecord)
        }
        index.j++
    } catch (error) {
        reject(error)
    }
}

module.exports = app;