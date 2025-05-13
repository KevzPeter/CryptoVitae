"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, Sparkles, BadgeCheck, Globe, SearchCheck } from "lucide-react";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ThemeContext } from "@/context/ThemeContext";
import { WalletContext } from "@/context/WalletContext";

export default function LandingPage() {
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

      {/* Hero Section */}
      <main className="flex-1 px-6 py-24 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Build a Wallet-Verified Resume<br /> with <span className="text-blue-600 dark:text-blue-400">CryptoVitae</span>
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-xl mx-auto mb-10">
            Showcase your skills, receive on-chain endorsements, and verify your credentials, all in one decentralized profile
          </p>
          <Button onClick={handleGetStarted} className="px-6 py-3 text-base" disabled={loading}>
            {loading ? "Connecting..." : (<>Get Started <ArrowRight className="ml-2 w-4 h-4" /></>)}
          </Button>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-3xl font-semibold mb-8">What You Can Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-left">
            <Feature
              icon={<Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Mint NFT Resumes"
              description="Create verifiable ERC-721 resume tokens linked to your wallet."
            />
            <Feature
              icon={<Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />}
              title="Peer Endorsements"
              description="Receive on-chain endorsements from peers to boost credibility."
            />
            <Feature
              icon={<BadgeCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
              title="Org-Issued Badges"
              description="Collect credentials issued by whitelisted organizations."
            />
            <Feature
              icon={<Globe className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />}
              title="Public Resume Viewer"
              description="Share your resume via unique wallet-based URLs and QR codes."
            />
            <Feature
              icon={<SearchCheck className="w-8 h-8 text-pink-600 dark:text-pink-400" />}
              title="Explore Verified Resumes"
              description="Browse public resumes using skill and badge filters."
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="mb-4">{icon}</div>
      <h4 className="font-semibold text-xl mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground dark:text-gray-400">{description}</p>
    </div>
  );
}
