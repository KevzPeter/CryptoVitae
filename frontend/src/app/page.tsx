// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";
import { WalletContext } from "@/context/WalletContext";

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { connectWallet } = useContext(WalletContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    const account = await connectWallet();
    if (account) {
      router.push("/resume/create");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      {/* Header */}

      {/* Hero Section */}
      <main className="flex-1 px-6 py-20 flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl mx-auto">
            Build your Wallet-Verified Resume with <span className="text-blue-600 dark:text-blue-400">CryptoVitae Pro</span>
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Showcase your skills, experience, and on-chain credentials with a modern, decentralized resume.
          </p>
          <Button onClick={handleGetStarted} className="px-6 py-3 text-base" disabled={loading}>
            {loading ? "Connecting..." : (<>Get Started <ArrowRight className="ml-2 w-4 h-4" /></>)}
          </Button>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-6">What You Can Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <h4 className="font-semibold text-lg mb-2">Mint NFT Resumes</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Store your resume on-chain and prove ownership forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Own Your Identity</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Use your wallet address as your decentralized identity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Track Recruiter Views</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Get insights on how often your resume gets seen and by whom.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
