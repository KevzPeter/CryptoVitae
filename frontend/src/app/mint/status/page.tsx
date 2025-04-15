// src/app/mint/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function MintStatusPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const txHash = searchParams.get("tx");
    const tokenId = searchParams.get("tokenId");

    const isSuccess = status === "success";

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
            <div className="text-center max-w-xl">
                {isSuccess ? (
                    <div>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Resume Minted Successfully!</h1>
                        <p className="text-muted-foreground mb-4">Token ID: <strong>{tokenId}</strong></p>
                        {txHash && (
                            <p className="text-sm mb-4">
                                View Transaction:&nbsp;
                                <a
                                    href={`https://etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {txHash.slice(0, 10)}...{txHash.slice(-6)}
                                </a>
                            </p>
                        )}
                        <Link href="/dashboard">
                            <Button>Go to Dashboard</Button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Minting Failed</h1>
                        <p className="text-muted-foreground mb-4">Something went wrong during the transaction.</p>
                        <Link href="/resume/create">
                            <Button variant="secondary">Try Again</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
