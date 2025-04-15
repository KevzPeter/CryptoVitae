import { ethers } from "ethers";
import {
    RESUME_NFT_ABI,
    RESUME_NFT_ADDRESS,
    BADGE_NFT_ABI,
    BADGE_NFT_ADDRESS,
} from "./contract";

export const getResumeNFTContract = (signer) => {
    return new ethers.Contract(RESUME_NFT_ADDRESS, RESUME_NFT_ABI, signer);
};

export const getBadgeNFTContract = (signer) => {
    return new ethers.Contract(BADGE_NFT_ADDRESS, BADGE_NFT_ABI, signer);
};
