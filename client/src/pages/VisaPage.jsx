import React, { useState } from "react";
import { FileText, Globe, Briefcase, CheckCircle, AlertTriangle, Loader2, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // State for Form Fields
  const [formData, setFormData] = useState({
    nationality: "",
    destination: "",
    purpose: "Student", // Default to Student for IELTS demo
    documents: ""
  });
  
  // State for File
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your IELTS PDF Report.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Create FormData for file upload
    const dataToSend = new FormData();
    dataToSend.append("nationality", formData.nationality);
    dataToSend.append("destination", formData.destination);
    dataToSend.append("purpose", formData.purpose);
    dataToSend.append("documents", formData.documents);
    dataToSend.append("file", file);

    try {
      // Note the new endpoint URL
      const response = await fetch("http://localhost:8000/api/assess-visa-upload", {
        method: "POST",
        body: dataToSend, // No Content-Type header needed, browser sets it for FormData
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Visa & IELTS Analyzer
            </h1>
            <button 
                onClick={() => navigate("/agent-form")}
                className="text-sm text-slate-400 hover:text-white transition-colors"
            >
                ← Back to Planner
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-4 h-fit bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">My Nationality</label>
                    <input name="nationality" required onChange={handleChange} placeholder="e.g. Indian" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Destination</label>
                    <input name="destination" required onChange={handleChange} placeholder="e.g. Canada" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Purpose</label>
                    <select name="purpose" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Student">Study / Education</option>
                        <option value="Work">Work / Employment</option>
                        <option value="Tourist">Tourist / Visit</option>
                        <option value="PR">Permanent Residence</option>
                    </select>
                </div>

                {/* FILE UPLOAD SECTION */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Upload IELTS Report (PDF)</label>
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-blue-500 transition-colors group">
                        <input 
                            type="file" 
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-400">
                            <UploadCloud className="w-8 h-8 mb-2" />
                            <span className="text-sm">{file ? file.name : "Click to Upload PDF"}</span>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <FileText className="w-5 h-5" />}
                    Analyze Visa Eligibility
                </button>
            </form>
          </div>

          {/* RIGHT: RESULTS DISPLAY */}
          <div className="lg:col-span-8">
            {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-10 text-slate-500">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p>Upload your IELTS PDF to get an instant AI assessment.</p>
                </div>
            )}

            {loading && (
                <div className="h-full flex flex-col items-center justify-center p-10">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-blue-400 animate-pulse">Reading IELTS Document...</p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* 1. IELTS Analysis Card */}
                    <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border-l-8 border-indigo-600">
                        <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-indigo-900">
                            <FileText className="w-5 h-5" /> Document Analysis
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                             <div className="bg-slate-100 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase">Listening</div>
                                <div className="font-bold text-xl">{result.ielts_scores_detected?.Listening || "N/A"}</div>
                             </div>
                             <div className="bg-slate-100 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase">Reading</div>
                                <div className="font-bold text-xl">{result.ielts_scores_detected?.Reading || "N/A"}</div>
                             </div>
                             <div className="bg-slate-100 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase">Writing</div>
                                <div className="font-bold text-xl">{result.ielts_scores_detected?.Writing || "N/A"}</div>
                             </div>
                             <div className="bg-slate-100 p-3 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase">Speaking</div>
                                <div className="font-bold text-xl">{result.ielts_scores_detected?.Speaking || "N/A"}</div>
                             </div>
                        </div>
                        <div className="text-sm bg-indigo-50 p-3 rounded-lg flex justify-between items-center">
                            <span><strong>Candidate:</strong> {result.candidate_name_detected || "Unknown"}</span>
                            <span className="font-bold text-indigo-700">Overall Band: {result.ielts_scores_detected?.Overall || "N/A"}</span>
                        </div>
                    </div>

                    {/* 2. Admin Decision Card */}
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-slate-400 text-sm font-bold uppercase mb-1">AI Recommendation</h2>
                            <div className={`text-3xl font-black ${result.admin_approval_status === 'Recommended' ? 'text-green-400' : 'text-red-400'}`}>
                                {result.admin_approval_status}
                            </div>
                            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{result.eligibility_reason}</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-8 ${result.eligibility_score >= 80 ? 'border-green-500 text-green-500' : result.eligibility_score >= 50 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'} font-bold text-2xl bg-slate-900`}>
                                {result.eligibility_score}%
                            </div>
                            <span className="text-xs text-slate-500 mt-2 uppercase font-bold">Probability</span>
                        </div>
                    </div>

                    {/* 3. Missing Documents */}
                    {result.missing_documents && result.missing_documents.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                            <h3 className="flex items-center gap-2 font-bold text-red-400 mb-3">
                                <AlertTriangle className="w-5 h-5" /> Pending Requirements
                            </h3>
                            <ul className="space-y-2">
                                {result.missing_documents.map((doc, i) => (
                                    <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                                        <span>•</span> {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaPage;