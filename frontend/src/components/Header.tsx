"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "./ui/button";
import { Moon, Sun, Copy, Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
    const { walletAddress, connectWallet } = useContext(WalletContext);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [shortAddress, setShortAddress] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        if (walletAddress) {
            setShortAddress(walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4));
        }
    }, [walletAddress]);

    const handleConnect = async () => {
        const connected = await connectWallet();
        if (connected) toast.success("Wallet connected!");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        toast.success("Wallet address copied!");
    };

    return (
        <TooltipProvider>
            <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur border-b border-border">
                {/* Top Bar */}
                <div className="max-w-7xl mx-auto px-6 py-3 w-full flex justify-between items-center">
                    {/* Left: Logo */}
                    <Link href="/" className="text-lg font-bold">
                        CryptoVitae
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
                        <Link href="/explore" className="hover:underline">
                            Explore
                        </Link>
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>
                        <Link href="/resume/create" className="hover:underline">
                            Create
                        </Link>

                        {/* Theme toggle */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Mobile: Hamburger Menu */}
                    <div className="sm:hidden">
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden px-6 py-4 bg-white dark:bg-black border-t border-border flex flex-col gap-3 animate-slide-down">
                        {walletAddress && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs px-3 flex items-center gap-1 w-fit"
                                        onClick={handleCopy}
                                    >
                                        {shortAddress}
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click to copy wallet address</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <Link href="/explore" onClick={toggleMenu}>
                            Explore
                        </Link>
                        <Link href="/dashboard" onClick={toggleMenu}>
                            Dashboard
                        </Link>
                        <Link href="/resume/create" onClick={toggleMenu}>
                            Create
                        </Link>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        toggleDarkMode();
                                        toggleMenu();
                                    }}
                                    className="w-fit"
                                >
                                    {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle Theme</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </header>
        </TooltipProvider>
    );
}
