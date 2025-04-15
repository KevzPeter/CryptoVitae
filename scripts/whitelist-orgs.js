const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners(); // Must be contract owner
    const badgeNFT = await ethers.getContractAt("BadgeNFT", "0x8FbceE9FCb713aA02A8e0515fBbBeE7C36bC8362");

    const orgAddress = "0xfE662d1a66E91cbe2187beB42724B0593b3c38A7"; // replace with actual address
    const tx = await badgeNFT.whitelistOrg(orgAddress, true);
    await tx.wait();

    console.log(`✅ Whitelisted org: ${orgAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
