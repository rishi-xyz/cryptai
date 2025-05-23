# \U0001f9e0 CryptAI \u2013 Talk to the Sui Blockchain with AI

CryptAI is a conversational web app that allows users to interact with the [Sui blockchain](https://sui.io) using natural language \u2014 just like talking to ChatGPT.

Built with **Next.js**, **Vercel AI SDK**, **Google Gemini**, and the **Mysten Sui SDK**, CryptAI makes blockchain interactions simple, accessible, and developer-friendly.

> \U0001f680 "Talk to the blockchain \u2014 no code required."

---

## \u2728 Features

- \U0001f517 **Natural Language to Blockchain Interaction**
  - Ask questions like: "What\u2019s my wallet balance?" or "Send 5 SUI to Alice."
- \U0001f510 **Secure Wallet Integration**
  - Powered by `@suiet/wallet-kit` with support for multiple Sui wallets.
- \U0001f4dc **Smart Contract Query & Execution**
  - Read and write to Move-based smart contracts.
- \U0001f9e0 **AI-Powered by Google Gemini + Vercel AI SDK**
  - Real-time responses from a fine-tuned LLM connected to blockchain logic.
- \U0001f4e6 **Sui SDK Support**
  - Interact with the blockchain using `@mysten/sui.js`.

---

## \U0001f6e0\ufe0f Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Blockchain SDK**: [`@mysten/sui.js`](https://github.com/MystenLabs/sui)
- **Wallet Integration**: [`@suiet/wallet-kit`](https://github.com/suiet/wallet-kit)
- **AI Platform**: [Google Gemini API](https://ai.google.dev/) via [Vercel AI SDK](https://vercel.com/blog/introducing-vercel-ai-sdk)
- **Deployment**: [Vercel](https://vercel.com)

---

## \U0001f4e6 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rishi-xyz/cryptai.git
cd cryptai
```

### 2. Clone the Repository

```bash
pnpm install
```

### 3. Set Enviroment Variables
```bash
#Storage
#Database
DATABASE_URL=
#Vercel Blob
BLOB_READ_WRITE_TOKEN=

#Auth
AUTH_SECRET=
NEXTAUTH_URL=
AUTH_TRUST_HOST=
#Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
#Github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

#AI
GOOGLE_GENERATIVE_AI_API_KEY=
```

### 4. Generate Prisma (Optoional)
```bash
pnpx prisma generate
```

### 5. Run Locally
```bash
pnpm run dev
```
