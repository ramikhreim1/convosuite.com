import {
    ViewListIcon,
} from '@heroicons/react/solid'
import { surpriseMePrompts } from "./constant"



const chatGpt = {
    title: "DALL·E 2",
    desc: "Description: DALL-E is an artificial intelligence program developed by OpenAI that can generate high-quality images from textual descriptions. It is a combination of two powerful technologies, natural language processing and image generation, that allows users to describe their desired image in words and have it generated by the AI.",
    category: "Powered by ChatGPT API",
    Icon: ViewListIcon,
    // tags: [],
    permissions: ['user'],

    fromColor: "gray-500",
    toColor: "gray-500",

    to: "/ai/dalle",
    imgAPI: "/ai/dalle",
    prompts: [
        {
            surpriseMePrompts,

        }
    ]
}

export default chatGpt

