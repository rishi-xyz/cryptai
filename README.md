# CryptAI - Talk to the  Blockchain with AI

CryptAI is a conversational web app that allows users to interact with the any Blockchain using natural language  just like talking to ChatGPT.

Built with **Next.js**, **Vercel AI SDK**, **Google Gemini**, CryptAI makes blockchain interactions simple, accessible, and developer-friendly.

> "Talk to the blockchain no code required."

---

##  Features

-  **Natural Language to Blockchain Interaction**
  - Ask questions like: "What my wallet balance?" or "Send 5 eth to Alice."
-  **Secure Wallet Integration**
  - Powered by `@suiet/wallet-kit` with support for multiple Sui wallets.
-  **Smart Contract Query & Execution**
  - Read and write to Move-based smart contracts.
-  **AI-Powered by Google Gemini + Vercel AI SDK**
  - Real-time responses from a fine-tuned LLM connected to blockchain logic.

---

##  Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **AI Platform**: [Google Gemini API](https://ai.google.dev/) via [Vercel AI SDK](https://vercel.com/blog/introducing-vercel-ai-sdk)
- **Deployment**: [Vercel](https://vercel.com)

---

##  Getting Started

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

### 4. Generate Prisma (Optional)
```bash
pnpx prisma generate
```

### 5. Run Locally
```bash
pnpm run dev
```
