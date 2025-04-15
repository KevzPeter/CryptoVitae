"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ResumeCard({ resume }: { resume: any }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="group border rounded-lg p-5 shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md transition flex flex-col justify-between"
        >
            {/* Top Section */}
            <div className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{resume.name}</h3>
                    {resume.tokenId !== 0 && (
                        <Badge variant="success" className="text-xs">
                            ✅ Minted
                        </Badge>
                    )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">{resume.title}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {resume.skills?.slice(0, 5).map((skill: string, idx: number) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-medium bg-zinc-200 dark:bg-zinc-700"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <Link
                href={`/resume/view/${resume.wallet}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-6 hover:underline self-start"
            >
                View Resume →
            </Link>
        </motion.div>
    );
}
