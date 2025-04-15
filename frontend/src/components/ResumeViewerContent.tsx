"use client";

import { useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { getResumeNFTContract, getBadgeNFTContract } from "@/lib/getContract";

export default function ResumeViewer({
    resume,
    wallet,
    endorsements: initialEndorsements = [],
}: {
    resume: any;
    wallet: string;
    endorsements: any[];
}) {

    const [endorsementMessage, setEndorsementMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [endorsements, setEndorsements] = useState<any[]>(initialEndorsements || []);
    const [hasEndorsed, setHasEndorsed] = useState(false);
    const [badges, setBadges] = useState<
        { tokenId: string; title: string; uri: string; issuer: string }[]
    >([]);



    const handleSubmitEndorsement = async () => {
        try {
            if (!endorsementMessage.trim()) return;

            setIsSubmitting(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = getResumeNFTContract(signer);

            const tx = await contract.endorseResume(resume.tokenId, endorsementMessage);
            await tx.wait();

            toast.success("Endorsement submitted!");
            setEndorsementMessage("");

            // ✅ Refetch endorsements after submission
            const updated = await contract.getEndorsements(resume.tokenId);
            setEndorsements(updated);
        } catch (err) {
            console.error(err);
            toast.error("Failed to endorse resume");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDisplayDate = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Apr 2024"
    };

    const resumeRef = useRef<HTMLDivElement>(null);

    const printResume = useReactToPrint({
        contentRef: resumeRef,
        documentTitle: `My_Resume_${wallet}`,
        onAfterPrint: () => console.log('Printing completed'),
    });

    const resumeUrl = `https://yourdomain.com/resume/view/${wallet}`;
    useEffect(() => {
        if (!endorsements.length || !wallet) return;
        const found = endorsements.some((e) => e.endorser.toLowerCase() === wallet.toLowerCase());
        setHasEndorsed(found);
    }, [endorsements, wallet]);
    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = getBadgeNFTContract(provider);
                const balance = await contract.balanceOf(wallet);

                // const results = [];

                // for (let i = 0; i < Number(balance); i++) {
                //     const tokenId = await contract.tokenOfOwnerByIndex(wallet, i);
                //     const uri = await contract.tokenURI(tokenId);
                //     const issuer = await contract.owner(); // Can replace later with actual badge issuer if tracked separately
                //     const title = uri?.split("/").pop()?.replace(/[-_]/g, " ") || "Badge";

                //     results.push({
                //         tokenId: tokenId.toString(),
                //         uri,
                //         title,
                //         issuer,
                //     });
                // }

                // setBadges(results);
                const filter = contract.filters.Transfer(null, wallet); // to = wallet
                const logs = await contract.queryFilter(filter);

                const results = [];

                for (const log of logs) {
                    const tokenId = log.args.tokenId.toString();
                    const uri = await contract.tokenURI(tokenId);
                    const issuer = await contract.badgeIssuer(tokenId);
                    const title = uri?.split("/").pop()?.replace(/[-_]/g, " ") || "Badge";

                    results.push({ tokenId, uri, issuer, title });
                }

                setBadges(results);

            } catch (err) {
                console.error("Failed to fetch badges:", err);
            }
        };

        if (wallet) fetchBadges();
    }, [wallet]);


    return (
        <div className="max-w-5xl mx-auto px-4 py-10 relative">
            {/* Top right action bar */}
            <div className="flex justify-end gap-4 mb-4 sticky top-4 z-10 bg-background/90 p-2 rounded">
                <Button
                    onClick={printResume}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Download PDF
                </Button>
            </div>

            {/* Resume container */}
            {resume && (

                <div ref={resumeRef} className="bg-white dark:bg-zinc-950 rounded-lg shadow p-6 relative">
                    {/* QR code in top-right */}
                    <div className="absolute top-6 right-6">
                        <QRCodeCanvas value={resumeUrl} size={80} />
                    </div>

                    {/* Resume content */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">{resume.name}</h1>
                        <p className="text-muted-foreground">{resume.title}</p>
                        {resume.bio && <p>{resume.bio}</p>}

                        <div className="flex justify-center gap-4 mt-2">
                            {resume.linkedin && (
                                <a href={resume.linkedin} target="_blank" className="text-blue-500 underline">
                                    LinkedIn
                                </a>
                            )}
                            {resume.github && (
                                <a href={resume.github} target="_blank" className="text-blue-500 underline">
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    {resume.skills?.length > 0 && (
                        <div className="mt-6">
                            <h2 className="font-semibold mb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {resume.skills.map((s: string, i: number) => (
                                    <span
                                        key={i}
                                        className="text-xs px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {resume.workExperience?.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                            <div className="space-y-6">
                                {resume.workExperience.map((exp: any, i: number) => (
                                    <div key={i} className="border-l pl-4 border-blue-400 relative">
                                        <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-blue-500" />
                                        <h3 className="font-semibold text-base">
                                            {exp.role} at {exp.company}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {exp.startDate ? formatDisplayDate(exp.startDate) : ""}{" "}
                                            {exp.endDate && `– ${formatDisplayDate(exp.endDate)}`}
                                        </p>
                                        <p className="text-sm">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {resume.projects?.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Projects</h2>
                            <div className="space-y-6">
                                {resume.projects.map((proj: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-base">
                                            {proj.name}{" "}
                                            {proj.link && (
                                                <a
                                                    href={proj.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 text-sm ml-2 underline"
                                                >
                                                    (Link)
                                                </a>
                                            )}
                                        </h3>
                                        <p className="text-sm mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {badges.length > 0 && (
                        <div className="mt-10 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">🏅 Badges</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.tokenId}
                                        className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded shadow-sm"
                                    >
                                        <h4 className="font-semibold text-base">{badge.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Issued by: <span className="font-mono">{badge.issuer}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">URI: {badge.uri}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Endorsement */}
                    {hasEndorsed && (
                        <p className="mt-6 text-sm italic text-muted-foreground">
                            You've already endorsed this resume 👏
                        </p>
                    )}
                    {!hasEndorsed && (
                        <div className="mt-10 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-2">Leave an Endorsement</h3>
                            <textarea
                                value={endorsementMessage}
                                onChange={(e) => setEndorsementMessage(e.target.value)}
                                rows={3}
                                placeholder="Write a short endorsement..."
                                className="w-full border p-2 rounded text-sm mb-2"
                            />
                            <Button disabled={!endorsementMessage || isSubmitting} onClick={handleSubmitEndorsement}>
                                {isSubmitting ? "Submitting..." : "Submit Endorsement"}
                            </Button>
                        </div>
                    )}
                    {/* Endorsements List */}
                    {endorsements.length > 0 && (
                        <div className="mt-10 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Endorsements</h3>
                            <div className="space-y-4">
                                {endorsements.map((e: any, i: number) => (
                                    <div
                                        key={i}
                                        className="bg-zinc-100 dark:bg-zinc-900 rounded px-4 py-3 shadow-sm"
                                    >
                                        <p className="italic text-sm">"{e.message}"</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            by {e.endorser.slice(0, 6)}...{e.endorser.slice(-4)} at{" "}
                                            {new Date(Number(e.timestamp) * 1000).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
