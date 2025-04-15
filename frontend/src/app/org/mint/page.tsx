"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getBadgeNFTContract } from "@/lib/getContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function OrgBadgeMintPage() {
    const [walletAddress, setWalletAddress] = useState("");
    const [badgeTitle, setBadgeTitle] = useState("");
    const [metadataUri, setMetadataUri] = useState("");
    const [connectedWallet, setConnectedWallet] = useState("");
    const [isOrg, setIsOrg] = useState(false);
    const [loading, setLoading] = useState(false);

    // Connect wallet on load
    useEffect(() => {
        const connect = async () => {
            if (!window.ethereum) return;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setConnectedWallet(accounts[0]);

            const contract = getBadgeNFTContract(provider);
            const whitelisted = await contract.getOrgStatus(accounts[0]);
            setIsOrg(whitelisted);
        };

        connect();
    }, []);

    const handleMint = async () => {
        if (!badgeTitle || !walletAddress) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = getBadgeNFTContract(signer);

            const uri = metadataUri || `badge://${badgeTitle.replace(/\s+/g, "-").toLowerCase()}`;
            const tx = await contract.mintBadge(walletAddress, badgeTitle, uri);
            await tx.wait();

            toast.success("Badge successfully minted!");
            setWalletAddress("");
            setBadgeTitle("");
            setMetadataUri("");
        } catch (err) {
            console.error("Minting failed:", err);
            toast.error("Failed to mint badge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-6">
            <h1 className="text-2xl font-bold mb-6">🎖 Org Badge Portal</h1>

            {connectedWallet && (
                <p className="text-sm mb-4">
                    Connected as: <span className="font-mono">{connectedWallet}</span>
                </p>
            )}

            {!isOrg ? (
                <p className="text-red-600">❌ You are not a whitelisted organization.</p>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Recipient Wallet Address *</label>
                        <Input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Badge Title *</label>
                        <Input
                            type="text"
                            value={badgeTitle}
                            onChange={(e) => setBadgeTitle(e.target.value)}
                            placeholder="e.g. Solidity Pro Certificate"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Metadata URI (optional)</label>
                        <Input
                            type="text"
                            value={metadataUri}
                            onChange={(e) => setMetadataUri(e.target.value)}
                            placeholder="https://... or ipfs://..."
                        />
                    </div>

                    <Button onClick={handleMint} disabled={loading}>
                        {loading ? "Minting..." : "Mint Badge"}
                    </Button>
                </div>
            )}
        </div>
    );
}
