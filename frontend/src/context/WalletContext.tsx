"use client";

import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext({
    walletAddress: "",
    connectWallet: async () => { },
});

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("wallet");
        if (stored) setWalletAddress(stored);
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(account);
                localStorage.setItem("wallet", account); // ✅ persist
                return account;
            } catch (err) {
                console.error("User rejected wallet connection", err);
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
