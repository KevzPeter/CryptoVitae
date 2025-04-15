"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import ResumeCard from "@/components/ResumeCard";
import ResumeCardSkeleton from "@/components/ResumeCardSkeleton";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExplorePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [resumes, setResumes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 20;
    // const [search, setSearch] = useState(searchParams.get("search") || "");
    const [onlyMinted, setOnlyMinted] = useState(searchParams.get("minted") === "true");
    const [selectedSkill, setSelectedSkill] = useState(searchParams.get("skill") || "");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
    const [search, setSearch] = useState(searchParams.get("search") || "");


    const updateQueryParams = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (onlyMinted) params.set("minted", "true");
        if (selectedSkill) params.set("skill", selectedSkill);
        if (page > 1) params.set("page", String(page));

        router.push(`/explore?${params.toString()}`);
    };


    const fetchResumes = async (query = "", currentPage = 1) => {
        try {
            setLoading(true);

            const params: any = {
                search: query,
                page: currentPage,
                limit,
            };

            if (onlyMinted) params.minted = true;
            if (selectedSkill) params.skill = selectedSkill;

            const res = await axios.get("http://localhost:5000/api/resume", { params });
            setResumes(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error("Failed to load resumes", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((q) => {
            fetchResumes(q, 1);
        }, 400),
        []
    );

    const debouncedSearch = useCallback(
        debounce((val: string) => {
            setSearch(val);
            setPage(1); // reset page
        }, 400),
        []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setSearch(q);
        setPage(1);
        debouncedFetch(q);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        debouncedSearch(val); // ✅ triggers after delay
    };

    // useEffect(() => {
    //     updateQueryParams();
    //     debouncedFetch(search, page);
    // }, [search, page, onlyMinted, selectedSkill]);
    useEffect(() => {
        updateQueryParams();
        fetchResumes(search, page);
    }, [search, page, onlyMinted, selectedSkill]);



    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Explore Public Resumes</h1>

            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search by name, title, or skill..."
                    className="pl-10"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                {/* Only Minted Toggle */}
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={onlyMinted}
                        onChange={(e) => {
                            setOnlyMinted(e.target.checked);
                            setPage(1);
                        }}
                    />
                    Only show minted
                </label>

                {/* Skill Filter Pills */}
                {resumes.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-xl">
                        {Array.from(new Set(resumes.flatMap((r: any) => r.skills || [])))
                            .slice(0, 10)
                            .map((skill, idx) => (
                                <Button
                                    key={idx}
                                    variant={selectedSkill === skill ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setSelectedSkill(selectedSkill === skill ? "" : skill);
                                        setPage(1);
                                    }}
                                >
                                    {skill}
                                </Button>
                            ))}
                    </div>
                )}

                {/* Clear Filters Button */}
                {(search || onlyMinted || selectedSkill) && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setSearchInput("");
                            setSearch("");
                            setOnlyMinted(false);
                            setSelectedSkill("");
                            setPage(1);
                            router.push("/explore");
                        }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Resume Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ResumeCardSkeleton key={i} />
                    ))}
                </div>
            ) : resumes.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                    <p>No resumes found{search && ` for “${search}”`}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {resumes.map((resume: any, idx: number) => (
                            <ResumeCard key={idx} resume={resume} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {total > limit && (
                        <div className="flex justify-center items-center mt-10 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {page} of {Math.ceil(total / limit)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= Math.ceil(total / limit)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}
