// src/app/dashboard/page.tsx
"use client";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { walletAddress } = useContext(WalletContext);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            if (!walletAddress) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/resume/${walletAddress}`);
                setResume(res.data.data);
            } catch (err) {
                console.error("[DASHBOARD] Error fetching resume:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [walletAddress]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-6 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="text-center py-12">
                <p className="text-lg mb-4">No resume found for your wallet.</p>
                <Link href="/resume/create">
                    <Button>Create Resume</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {resume.name}</h1>
                    <p className="text-muted-foreground">{resume.title}</p>
                </div>
                <Link href="/resume/create">
                    <Button variant="outline">Edit Resume</Button>
                </Link>
            </div>

            <div className="border rounded-lg p-4 bg-muted/20 dark:bg-muted/10">
                <p className="mb-2">{resume.bio}</p>

                <div className="mb-2">
                    <strong>Skills:</strong>
                    <ul className="list-disc list-inside ml-4 text-sm mt-1">
                        {resume.skills?.map((skill, idx) => <li key={idx}>{skill}</li>)}
                    </ul>
                </div>

                <div className="flex gap-4 mt-4">
                    {resume.linkedin && (
                        <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            LinkedIn <ExternalLink className="inline h-4 w-4 ml-1" />
                        </a>
                    )}
                    {resume.github && (
                        <a href={resume.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            GitHub <ExternalLink className="inline h-4 w-4 ml-1" />
                        </a>
                    )}
                </div>

                {resume.tokenId !== undefined && (
                    <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4" /> NFT minted — Token ID: <strong>{resume.tokenId}</strong>
                    </div>
                )}
            </div>

            <div className="text-center">
                <Link href={`/resume/view/${walletAddress}`}>
                    <Button variant="default">View Public Resume</Button>
                </Link>
            </div>
        </div>
    );
}
