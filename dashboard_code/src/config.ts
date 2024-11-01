const dev = {
    baseURL: "http://localhost:3080/api/",
    brainURL: "http://localhost:3070",
    landingPageUrl: "http://localhost:3080",
    stripe: {
        free: "price_1Mqt1BK0vBwAJTX56hLWiN0g",
        entry: "price_1MX7n2K0vBwAJTX5oUvhXp0g",
        pro: "price_1MgRpmK0vBwAJTX5bL9Tey4U",
    },
    redirectURL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3080/api/auth/google/callback&prompt=consent&response_type=code&client_id=196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com&scope=email%20profile`,
    clientId:
        "196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com",
};

const prod = {
    baseURL: "/api",
    brainURL: "https://jowry.click",
    landingPageUrl: "",
    redirectURL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://www.jowry.click/api/auth/google/callback&prompt=consent&response_type=code&client_id=196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com&scope=email%20profile`,
    stripe: {
        free: "price_1MrfJhK0vBwAJTX5vviXaGFQ",
        entry: "price_1MX7n2K0vBwAJTX5oUvhXp0g",
        pro: "price_1MgRpmK0vBwAJTX5bL9Tey4U",
    },
    clientId:
        "196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com",
};


const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
