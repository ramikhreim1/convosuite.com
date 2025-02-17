const models = [
    {
        "object": "engine",
        "id": "babbage",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "davinci",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-embedding-ada-002",
        "ready": true,
        "owner": "openai-internal",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "babbage-code-search-code",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-similarity-babbage-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "curie-instruct-beta",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "babbage-code-search-text",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "babbage-similarity",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "curie-search-query",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-003",
        "ready": true,
        "owner": "openai-internal",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-search-babbage-text-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-cushman-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-search-babbage-code-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "audio-transcribe-deprecated",
        "ready": true,
        "owner": "openai-internal",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-ada-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-similarity-ada-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-insert-002",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada-code-search-code",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada-similarity",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-search-ada-text-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-ada-query-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-curie-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-edit-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "davinci-search-document",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada-code-search-text",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-ada-doc-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-davinci-002",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-davinci-edit-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "davinci-instruct-beta",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-similarity-curie-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "code-search-ada-code-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada-search-query",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-davinci-query-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "davinci-search-query",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-insert-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "babbage-search-document",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "ada-search-document",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-babbage-doc-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-curie-doc-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-curie-query-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "babbage-search-query",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-babbage-001",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-davinci-doc-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-search-babbage-query-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "curie-similarity",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "curie-search-document",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "curie",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-similarity-davinci-001",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "text-davinci-002",
        "ready": true,
        "owner": "openai",
        "permissions": null,
        "created": null
    },
    {
        "object": "engine",
        "id": "davinci-similarity",
        "ready": true,
        "owner": "openai-dev",
        "permissions": null,
        "created": null
    }
]
export default models