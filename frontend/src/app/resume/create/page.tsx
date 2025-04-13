// src/app/resume/create/page.tsx
"use client";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ResumeFormPage() {
    const { walletAddress } = useContext(WalletContext);
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        skills: "",
        linkedin: "",
        github: "",
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            if (!walletAddress) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/resume/${walletAddress}`);
                if (res.data?.data) {
                    const resume = res.data.data;
                    setFormData({
                        name: resume.name || "",
                        title: resume.title || "",
                        bio: resume.bio || "",
                        skills: resume.skills?.join(", ") || "",
                        linkedin: resume.linkedin || "",
                        github: resume.github || "",
                    });
                    setIsEditing(true);
                }
            } catch (err) {
                console.log("No existing resume found.");
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [walletAddress]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                skills: formData.skills.split(",").map((s) => s.trim()),
                wallet: walletAddress,
                tokenId: 0, // will be updated after minting
                resumeURI: "pending", // placeholder before IPFS
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/resume/${walletAddress}`, data);
                alert("Resume updated!");
            } else {
                await axios.post("http://localhost:5000/api/resume", data);
                alert("Resume created!");
            }
        } catch (err) {
            console.error("Error saving resume:", err);
            alert("Something went wrong");
        }
    };

    if (loading) return <p className="p-6 text-center">Loading resume...</p>;

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-6">
                {isEditing ? "Edit your resume" : "Create your resume"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" name="github" value={formData.github} onChange={handleChange} />
                </div>
                <Button type="submit">{isEditing ? "Update Resume" : "Save Resume"}</Button>
            </form>
        </div>
    );
}
