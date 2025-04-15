// src/app/resume/create/page.tsx
"use client";
import { ethers } from "ethers";
import { getResumeNFTContract } from "@/lib/getContract";
import toast from "react-hot-toast";
import { use, useContext, useEffect, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MonthYearInput from "@/components/MonthYearInput";

type WorkExperience = {
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    description: string;
};

type Project = {
    name: string;
    link?: string;
    description: string;
};

export default function ResumeFormPage() {
    const router = useRouter();
    const { walletAddress } = useContext(WalletContext);
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        skills: "",
        linkedin: "",
        github: "",
        workExperience: [] as WorkExperience[],
        projects: [] as Project[],
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
                        skills: Array.isArray(resume.skills) ? resume.skills.join(", ") : "",
                        linkedin: resume.linkedin || "",
                        github: resume.github || "",
                        workExperience: Array.isArray(resume.workExperience)
                            ? resume.workExperience.map((w) => ({
                                company: w.company || "",
                                role: w.role || "",
                                startDate: w.startDate || "",
                                endDate: w.endDate || "",
                                description: w.description || "",
                            }))
                            : [],
                        projects: Array.isArray(resume.projects)
                            ? resume.projects.map((p) => ({
                                name: p.name || "",
                                link: p.link || "",
                                description: p.description || "",
                            }))
                            : [],
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


    const addWorkExperience = () => {
        setFormData((prev) => ({
            ...prev,
            workExperience: [
                ...prev.workExperience,
                { company: "", role: "", description: "", startDate: "", endDate: "" },
            ],
        }));
    };

    const removeWorkExperience = (idx: number) => {
        const updated = [...formData.workExperience];
        updated.splice(idx, 1);
        setFormData({ ...formData, workExperience: updated });
    };

    const addProject = () => {
        setFormData((prev) => ({
            ...prev,
            projects: [...prev.projects, { name: "", description: "", link: "" }],
        }));
    };

    const removeProject = (idx: number) => {
        const updated = [...formData.projects];
        updated.splice(idx, 1);
        setFormData({ ...formData, projects: updated });
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(isEditing ? "Updating your resume..." : "Saving your resume...");
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = getResumeNFTContract(signer);


            // Step 1: Save resume to DB
            const resumeData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                wallet: walletAddress,
                tokenId: 0, // placeholder until minted
                resumeURI: "", // placeholder
            };

            const { name, title, bio, skills, linkedin, github } = resumeData;
            const hashPayload = { name, title, bio, skills, linkedin, github };
            const resumeHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(hashPayload)));

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/resume/${walletAddress}`, resumeData);
                toast.success("Resume updated!", { id: toastId });
                return;
            } else {
                // Step 2: Mint NFT with placeholder URI (can be updated later)
                const resumeURI = `https://yourapi.com/resume/${walletAddress}`; // or just "resume:kevin"
                const tx = await contract.mintResume(walletAddress, resumeURI, resumeHash);
                const receipt = await tx.wait();
                const tokenId = receipt.logs[0].args.tokenId.toString();
                await axios.post(`http://localhost:5000/api/resume/`, {
                    ...resumeData,
                    tokenId,
                    resumeURI,
                });
                toast.success("Resume saved and minted as NFT!", { id: toastId });
                setTimeout(() => {
                    router.push(`/mint/status?status=success&tokenId=${tokenId}&tx=${tx.hash}`);
                }, 1000);
            }
        } catch (err) {
            console.error("Error saving resume:", err);
            toast.error("Something went wrong!", { id: toastId });
            router.push(`/mint/status?status=failed`);
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
                {/* Work Experience Section */}
                <Accordion type="multiple" className="mt-8">
                    <AccordionItem value="work-exp">
                        <AccordionTrigger className="text-xl font-semibold">Work Experience (Optional)</AccordionTrigger>
                        <AccordionContent>
                            {formData.workExperience.map((exp, idx) => (
                                <div key={idx} className="space-y-4 mb-6 border-b pb-6">
                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="Company Name"
                                            value={exp.company}
                                            required
                                            onChange={(e) => {
                                                const updated = [...formData.workExperience];
                                                updated[idx].company = e.target.value;
                                                setFormData({ ...formData, workExperience: updated });
                                            }}
                                        />
                                        <Input
                                            placeholder="Role"
                                            value={exp.role}
                                            required
                                            onChange={(e) => {
                                                const updated = [...formData.workExperience];
                                                updated[idx].role = e.target.value;
                                                setFormData({ ...formData, workExperience: updated });
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <MonthYearInput
                                            label="Start Date"
                                            value={exp.startDate}
                                            onChange={(val) => {
                                                const updated = [...formData.workExperience];
                                                updated[idx].startDate = val;
                                                setFormData({ ...formData, workExperience: updated });
                                            }}
                                        />

                                        <MonthYearInput
                                            label="End Date"
                                            value={exp.endDate}
                                            onChange={(val) => {
                                                const start = exp.startDate ? new Date(exp.startDate) : null;
                                                const end = new Date(val);
                                                if (start && end < start) {
                                                    toast.error("End date cannot be before start date.");
                                                    return;
                                                }
                                                const updated = [...formData.workExperience];
                                                updated[idx].endDate = val;
                                                setFormData({ ...formData, workExperience: updated });
                                            }}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Job Description"
                                        value={exp.description}
                                        required
                                        onChange={(e) => {
                                            const updated = [...formData.workExperience];
                                            updated[idx].description = e.target.value;
                                            setFormData({ ...formData, workExperience: updated });
                                        }}
                                    />
                                    <Button variant="destructive" size="sm" onClick={() => removeWorkExperience(idx)}>
                                        Remove Experience
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addWorkExperience}>
                                + Add Work Experience
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="multiple" className="mt-8">
                    <AccordionItem value="projects">
                        <AccordionTrigger className="text-xl font-semibold">Projects (Optional)</AccordionTrigger>
                        <AccordionContent>
                            {formData.projects.map((proj, idx) => (
                                <div key={idx} className="space-y-4 mb-6 border-b pb-6">
                                    <Input
                                        placeholder="Project Name"
                                        value={proj.name}
                                        required
                                        onChange={(e) => {
                                            const updated = [...formData.projects];
                                            updated[idx].name = e.target.value;
                                            setFormData({ ...formData, projects: updated });
                                        }}
                                    />
                                    <Input
                                        placeholder="Project Link"
                                        value={proj.link}
                                        onChange={(e) => {
                                            const updated = [...formData.projects];
                                            updated[idx].link = e.target.value;
                                            setFormData({ ...formData, projects: updated });
                                        }}
                                    />
                                    <Input
                                        placeholder="Project Description"
                                        value={proj.description}
                                        required
                                        onChange={(e) => {
                                            const updated = [...formData.projects];
                                            updated[idx].description = e.target.value;
                                            setFormData({ ...formData, projects: updated });
                                        }}
                                    />
                                    <Button variant="destructive" size="sm" onClick={() => removeProject(idx)}>
                                        Remove Project
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addProject}>
                                + Add Project
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


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
