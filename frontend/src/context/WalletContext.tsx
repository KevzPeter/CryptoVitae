"use client";
import { createContext, useState } from "react";

export const WalletContext = createContext({
    walletAddress: "",
    connectWallet: async () => { },
});

export const WalletProvider = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    const [walletAddress, setWalletAddress] = useState("");

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(account);
                return account;
            } catch (err) {
                console.error("User rejected request", err);
            }
        } else {
            alert("Please install MetaMask.");
        }
    };

    return (
        <WalletContext.Provider value={{ walletAddress, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
