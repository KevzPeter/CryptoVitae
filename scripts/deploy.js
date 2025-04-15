const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with:", deployer.address);

    // Deploy ResumeNFT
    const ResumeNFT = await ethers.getContractFactory("ResumeNFT");
    const resumeNFT = await ResumeNFT.deploy();
    await resumeNFT.waitForDeployment();
    const resumeNFTAddress = await resumeNFT.getAddress();
    console.log("✅ ResumeNFT deployed at:", resumeNFTAddress);

    // Deploy BadgeNFT
    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const badgeNFT = await BadgeNFT.deploy();
    await badgeNFT.waitForDeployment();
    const badgeNFTAddress = await badgeNFT.getAddress();
    console.log("✅ BadgeNFT deployed at:", badgeNFTAddress);

    // Write contract addresses to frontend
    const addressOutput = {
        ResumeNFT: resumeNFTAddress,
        BadgeNFT: badgeNFTAddress,
    };

    const addressPath = path.join(__dirname, "../frontend/src/lib/contract-address.json");
    fs.writeFileSync(addressPath, JSON.stringify(addressOutput, null, 2));
    console.log("📦 Contract addresses written to:", addressPath);

    // Copy ABIs to frontend
    const abiDir = path.join(__dirname, "../frontend/src/lib/abi");
    if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

    fs.copyFileSync(
        "artifacts/contracts/ResumeNFT.sol/ResumeNFT.json",
        path.join(abiDir, "ResumeNFT.json")
    );
    fs.copyFileSync(
        "artifacts/contracts/BadgeNFT.sol/BadgeNFT.json",
        path.join(abiDir, "BadgeNFT.json")
    );

    console.log("📄 ABI files copied to:", abiDir);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
