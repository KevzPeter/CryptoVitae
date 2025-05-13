# 🧾 CryptoVitae — Wallet-Verified Resume Platform

CryptoVitae is a decentralized resume builder and credential verification platform powered by Ethereum smart contracts. Users can mint their resume as an NFT, receive verifiable endorsements from peers, and collect organizational badges — all tied to their wallet.

---

## 🚀 Features

- 🔐 **Resume NFTs** — Mint resumes to your wallet as verifiable ERC-721 tokens
- 👍 **Peer Endorsements** — On-chain endorsements from other wallet holders
- 🏅 **Organization-Issued Badges** — Verifiable credentials issued by whitelisted orgs
- 🌐 **Public Resume Viewer** — View resumes at `/resume/view/[wallet]` with QR export
- 🔍 **Explore Page** — Browse public resumes with filters and badge highlights
- 📦 **MongoDB Storage** — Off-chain metadata management for resume and badge content

---

## 📦 Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | Next.js, TailwindCSS, Shadcn UI       |
| Backend    | Node.js, Express.js, MongoDB Atlas    |
| Blockchain | Solidity, Hardhat, Ganache, Ethers.js |
| Wallet     | MetaMask                              |

---

## 🧰 Requirements

- Node.js v18+
- Yarn or npm
- MongoDB Atlas connection string
- MetaMask browser extension
- Hardhat installed globally (for local dev)
- Infura/Alchemy RPC URL (for testnet/mainnet deployment)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cryptovitae.git
cd cryptovitae
```

### 2. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

### 3. Environment Variables

Create a `.env` file in both `frontend/` and `backend/` directories.

**Frontend `.env.local`**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_CONTRACT_ADDRESS_RESUME=0xYourResumeContractAddress
NEXT_PUBLIC_CONTRACT_ADDRESS_BADGE=0xYourBadgeContractAddress
NEXT_PUBLIC_CHAIN_ID=1337
```

**Backend `.env`**

```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_url
CONTRACT_ADDRESS_RESUME=0xYourResumeContractAddress
CONTRACT_ADDRESS_BADGE=0xYourBadgeContractAddress
CHAIN_ID=1337
```

---

### 4. Compile Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
```

---

### 5. Deploy Smart Contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Make sure Ganache or Hardhat local node is running:

```bash
npx hardhat node
```

Copy the deployed contract addresses into your `.env` files.

---

### 6. Start the Backend Server

```bash
cd backend
npm run dev
```

---

### 7. Start the Frontend

```bash
cd frontend
npm run dev
```

---

## 🧑‍💻 App Usage

1. **Connect Wallet:** Use MetaMask to sign in
2. **Create Resume:** Fill out the form and submit — an NFT will be minted
3. **View Resume:** Navigate to `/resume/view/[wallet]` to share your profile
4. **Endorse:** Visit another user’s resume and click “Endorse”
5. **Issue Badges:** Organizations can mint badges to wallets they’ve verified
6. **Explore Resumes:** Browse public resumes via `/explore`

---

## 📹 Live Demo

[![Watch the Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## 📌 Future Roadmap

- [ ] Integrate AI-powered resume scoring and suggestions
- [ ] Store metadata on IPFS instead of MongoDB
- [ ] DAO-controlled whitelisting of organizations
- [ ] ERC-7529 support for off-chain signed attestations
- [ ] Cross-chain resume NFT compatibility
- [ ] ENS/DID-based identity integration
- [ ] Recruiter-side dashboard with filters and outreach tools

---
