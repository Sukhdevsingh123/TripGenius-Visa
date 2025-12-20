
import React, { useState, useEffect } from "react";
import { FileText, UploadCloud, Loader2, CheckCircle, AlertTriangle, Download, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../components";
import { saveHistory } from "../Api/Api"; // Added for auto-save
import axios from "axios";
import jsPDF from "jspdf";

const VisaPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        nationality: "India", // Default for demo
        destination: "Canada",
        purpose: "Work / Employment",
        documents: ""
    });
    const [file, setFile] = useState(null);

    // Fetch user data
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) return;
            try {
                const response = await axios.get("https://tripgenius-visa-iltf.onrender.com/api/v1/dashboard", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserData({ username: response.data.msg });
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserProfile();
    }, [token]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    // --- PDF GENERATION LOGIC ---
    const generatePDF = () => {
        if (!result) return;

        const doc = new jsPDF();

        // 1. Header / Title
        doc.setFontSize(22);
        doc.setTextColor(0, 51, 102); // Dark Blue
        doc.text("Visa Assessment & Approval Letter", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Ref ID: VISA-${Math.floor(Math.random() * 100000)}`, 160, 30);

        doc.line(20, 35, 190, 35); // Horizontal Line

        // 2. Candidate Details
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Candidate Profile", 20, 50);

        doc.setFontSize(11);
        doc.setTextColor(50);
        doc.text(`Name Detected: ${result.candidate_name_detected || "N/A"}`, 20, 60);
        doc.text(`Nationality: ${formData.nationality}`, 20, 68);
        doc.text(`Destination: ${formData.destination}`, 110, 68);
        doc.text(`Purpose: ${formData.purpose}`, 20, 76);

        // 3. IELTS Analysis
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("IELTS Document Analysis", 20, 95);

        doc.setFontSize(11);
        doc.setTextColor(50);
        doc.text(`Overall Band Score: ${result.ielts_scores_detected?.Overall}`, 20, 105);
        doc.text(`Listening: ${result.ielts_scores_detected?.Listening}`, 20, 113);
        doc.text(`Reading: ${result.ielts_scores_detected?.Reading}`, 60, 113);
        doc.text(`Writing: ${result.ielts_scores_detected?.Writing}`, 100, 113);
        doc.text(`Speaking: ${result.ielts_scores_detected?.Speaking}`, 140, 113);

        // 4. AI Recommendation
        doc.setFillColor(240, 240, 240); // Light gray box
        doc.rect(20, 130, 170, 40, 'F');

        doc.setFontSize(14);
        doc.setTextColor(0, 100, 0); // Green
        doc.text("AI Recommendation: " + result.admin_approval_status, 25, 140);

        doc.setFontSize(10);
        doc.setTextColor(60);
        // Split text to fit PDF width
        const splitReason = doc.splitTextToSize(result.eligibility_reason, 160);
        doc.text(splitReason, 25, 150);

        // 5. Official Approval Stamp (Simulated)
        if (result.admin_approval_status === "Recommended") {
            doc.setTextColor(0, 128, 0);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("[ AUTO-APPROVED ]", 130, 200);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("System Validated", 135, 205);
        }

        // Save
        doc.save(`${result.candidate_name_detected}_Visa_Approval.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload a PDF.");
        setLoading(true);
        setResult(null);

        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
        dataToSend.append("file", file);

        try {
            const response = await fetch("https://tripgenius-visa-1.onrender.com/api/assess-visa-upload", {
                method: "POST",
                body: dataToSend,
            });
            const data = await response.json();
            setResult(data);

            // ✅ AUTO-SAVE TO HISTORY
            try {
                await saveHistory({
                    type: "VISA_ASSESSMENT",
                    status: data.admin_approval_status || "Analysis Ready",
                    details: {
                        nationality: formData.nationality,
                        destination: formData.destination,
                        purpose: formData.purpose,
                        eligibilityScore: data.eligibility_score,
                        eligibilityReason: data.eligibility_reason,
                        adminApprovalStatus: data.admin_approval_status,
                        missingDocuments: data.missing_documents || [],
                        processingTime: data.processing_time,
                        fullResult: JSON.stringify(data)
                    }
                });
                console.log("✅ Visa assessment saved to history");
            } catch (historyError) {
                console.error("Failed to save history:", historyError);
                // Don't show error to user, it's a background operation
            }

        } catch (error) {
            console.error(error);
            alert("Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                Visa & IELTS Analyzer
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">AI-Powered Document Verification</p>
                        </div>
                        <button onClick={() => navigate("/agent-form")} className="text-slate-400 hover:text-white transition-colors">
                            ← Back to Planner
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: FORM */}
                        <div className="lg:col-span-4 h-fit bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    {['nationality', 'destination'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{field}</label>
                                            <input name={field} value={formData[field]} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none text-white" />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Purpose</label>
                                        <select name="purpose" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>Work / Employment</option>
                                            <option>Student</option>
                                            <option>Tourist</option>
                                        </select>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                                        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-300">{file ? file.name : "Upload IELTS Report (PDF)"}</span>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg flex justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" /> : "Analyze Visa Eligibility"}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: RESULTS */}
                        <div className="lg:col-span-8">
                            {!result && !loading && (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-10 text-slate-500">
                                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Upload PDF to see AI Analysis</p>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                    {/* 1. DOCUMENT ANALYSIS CARD */}
                                    <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border-l-8 border-indigo-600 relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                                                    <FileText className="w-5 h-5" /> Document Analysis
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">Extracted from {file?.name}</p>
                                            </div>
                                            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                Verified
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            {Object.entries(result.ielts_scores_detected || {}).map(([key, val]) => (
                                                key !== "Overall" && (
                                                    <div key={key} className="bg-slate-100 p-3 rounded-xl text-center">
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{key}</div>
                                                        <div className="font-black text-xl text-slate-800">{val}</div>
                                                    </div>
                                                )
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                                            <div>
                                                <div className="text-xs text-indigo-400 font-bold uppercase">Candidate Name</div>
                                                <div className="font-bold text-slate-800">{result.candidate_name_detected}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-indigo-400 font-bold uppercase">Overall Band</div>
                                                <div className="text-3xl font-black text-indigo-600">{result.ielts_scores_detected?.Overall}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. AUTO-APPROVE / STATUS CARD */}
                                    <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex-1">
                                            <h2 className="text-slate-400 text-xs font-bold uppercase mb-2">AI Recommendation</h2>

                                            <div className={`text-4xl font-black mb-3 ${result.admin_approval_status === 'Recommended' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {result.admin_approval_status}
                                            </div>

                                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                                {result.eligibility_reason}
                                            </p>

                                            {/* AUTO APPROVE LOGIC */}
                                            {result.admin_approval_status === "Recommended" && (
                                                <div className="flex gap-3">
                                                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
                                                        <ShieldCheck className="w-5 h-5" />
                                                        <span className="font-bold text-sm">System Auto-Approved</span>
                                                    </div>

                                                    <button
                                                        onClick={generatePDF}
                                                        className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Letter
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Probability Circle */}
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <path className={result.eligibility_score >= 80 ? "text-green-500" : "text-yellow-500"} strokeDasharray={`${result.eligibility_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-2xl font-bold text-white">{result.eligibility_score}%</span>
                                                <span className="text-[8px] text-slate-400 uppercase">Probability</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default VisaPage;
