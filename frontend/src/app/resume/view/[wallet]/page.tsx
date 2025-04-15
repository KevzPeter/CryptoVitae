// src/app/resume/view/[wallet]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ethers } from "ethers";
import ResumeViewerContent from "@/components/ResumeViewerContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getResumeNFTContract } from "@/lib/getContract";

export default function ResumeViewer() {
    const { wallet } = useParams();
    const [resume, setResume] = useState<any>(null);
    const [endorsements, setEndorsements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumeAndEndorsements = async () => {
            try {
                // Resume from backend
                const res = await axios.get(`http://localhost:5000/api/resume/${wallet}`);
                const resumeData = res.data.data;
                setResume(resumeData);

                // Fetch endorsements from smart contract
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = getResumeNFTContract(provider);
                const endorses = await contract.getEndorsements(resumeData.tokenId);
                setEndorsements(endorses);
            } catch (err) {
                console.error("Error fetching resume or endorsements:", err);
            } finally {
                setLoading(false);
            }
        };

        if (wallet) fetchResumeAndEndorsements();
    }, [wallet]);

    if (loading)
        return (
            <div className="max-w-2xl mx-auto py-12 px-6 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
            </div>
        );

    if (!resume) return <p className="p-6 text-center">No resume found for this address.</p>;

    return (
        <ResumeViewerContent resume={resume} wallet={wallet} endorsements={endorsements} />
    );
}
