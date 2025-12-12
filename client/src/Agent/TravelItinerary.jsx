

// import React, { useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import {
//   Terminal,
//   Map,
//   Sparkles,
//   Calendar,
//   Clock,
//   MapPin,
//   Navigation,
//   Sun,
//   Moon,
//   Coffee,
//   Plane,
//   Star
// } from "lucide-react";

// // --- Custom Components for Premium Markdown Styling ---
// const MarkdownComponents = {
//   // Paragraphs - Improved Readability
//   p: ({ children }) => (
//     <p className="text-slate-300/90 leading-7 mb-4 text-[15px] font-normal tracking-wide">
//       {children}
//     </p>
//   ),
//   // Headings (Day Titles)
//   h3: ({ children }) => (
//     <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
//       <Sparkles className="w-5 h-5 text-amber-400" />
//       <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
//         {children}
//       </span>
//     </h3>
//   ),
//   // Lists
//   ul: ({ children }) => <ul className="space-y-4 my-6 pl-2">{children}</ul>,
//   li: ({ children }) => (
//     <li className="flex items-start gap-4 text-slate-200 text-[15px] group transition-all duration-300 hover:translate-x-1">
//       <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] flex-shrink-0 group-hover:scale-125 transition-transform" />
//       <span className="leading-relaxed">{children}</span>
//     </li>
//   ),
//   // Bold Text (Highlighting times of day) - Enhanced Badges
//   strong: ({ children }) => {
//     const text = String(children).toLowerCase();
//     let icon = null;
//     let colorClass = "text-white bg-white/10 border-white/20";

//     if (text.includes("morning")) {
//         icon = <Sun size={14} />;
//         colorClass = "text-amber-200 bg-amber-500/20 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
//     } else if (text.includes("afternoon") || text.includes("lunch")) {
//         icon = <Coffee size={14} />;
//         colorClass = "text-orange-200 bg-orange-500/20 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]";
//     } else if (text.includes("evening") || text.includes("night") || text.includes("dinner")) {
//         icon = <Moon size={14} />;
//         colorClass = "text-indigo-200 bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]";
//     }

//     return (
//       <span className={`inline-flex items-center gap-2 font-bold px-3 py-1 rounded-full border text-xs uppercase tracking-wider ${colorClass} mx-1 transform hover:scale-105 transition-transform`}>
//         {icon} {children}
//       </span>
//     );
//   },
// };

// export default function TravelItinerary({ result, logs, loading, isCached }) {
//   const logsEndRef = useRef(null);
  
//   // Auto-scroll terminal
//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   // Helper: split markdown into sections
//   const splitIntoDays = (md) => {
//     if (!md) return [];
//     const re = /(?=^#{1,3}\s*Day\s*\d+.*$)/gim;
//     let parts = md.split(re).map((p) => p.trim()).filter(Boolean);
//     if (parts.length < 2) parts = md.split(/(?=Day\s\d+:)/g).map((p) => p.trim()).filter(Boolean);
//     if (parts.length === 1 && md.length > 500) return [md]; 
//     return parts;
//   };

//   const daySections = splitIntoDays(result);

//   // --- STATE 1: IDLE ---
//   if (!loading && !result && logs.length === 0) {
//     return (
//       <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0B1120]/80 backdrop-blur-md rounded-[2rem] border border-white/5 border-dashed p-10 text-center animate-in fade-in zoom-in-95 duration-500 group cursor-default">
//         <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 relative">
//             <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:blur-3xl transition-all duration-700"></div>
//             <Map className="w-10 h-10 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-500" />
//         </div>
//         <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Awaiting Coordinates</h3>
//         <p className="text-slate-400 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">
//           Initialize the AI agent on the left to begin your journey generation.
//         </p>
//       </div>
//     );
//   }

//   // --- STATE 2: LOADING (TERMINAL) ---
//   if (loading || (!result && logs.length > 0)) {
//     return (
//       <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
//         <div className="bg-[#050505] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[650px] relative font-mono">
//           {/* Terminal Header */}
//           <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-sm">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
//               <div className="w-3 h-3 rounded-full bg-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
//               <div className="w-3 h-3 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
//             </div>
//             <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
//               <Terminal className="w-3 h-3 text-emerald-500" />
//               SYSTEM_ACTIVE
//             </div>
//           </div>
//           {/* Terminal Body */}
//           <div className="flex-1 p-6 overflow-y-auto space-y-3 scrollbar-hide">
//             {logs.map((log, i) => (
//               <div key={i} className="flex gap-4 text-sm font-light animate-in fade-in slide-in-from-left-2 duration-300 group">
//                 <span className="text-slate-700 shrink-0 select-none text-xs pt-0.5 font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
//                 <span className="text-blue-500 shrink-0 select-none">➜</span>
//                 <span className={`${
//                   log.includes("Error") ? "text-red-400" : 
//                   log.includes("Complete") ? "text-emerald-400 font-medium" : "text-slate-300"
//                 }`}>
//                   {log}
//                 </span>
//               </div>
//             ))}
//             <div ref={logsEndRef} />
//           </div>
//           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
//         </div>
//       </div>
//     );
//   }

//   // --- STATE 3: RESULT (VERTICAL TIMELINE JOURNEY) ---
//   return (
//     <div className="h-full animate-in fade-in zoom-in-95 duration-700">
//       <div className="bg-[#0F172A] rounded-[2.5rem] shadow-2xl overflow-hidden h-full border border-slate-800 relative flex flex-col">
        
//         {/* Header - Glassmorphism */}
//         <div className="bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-700/50 p-6 z-20 sticky top-0 flex justify-between items-center shadow-lg shadow-black/20">
//             <div>
//                 <div className="flex items-center gap-2 mb-1.5">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Mission Report</span>
//                     {isCached && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">CACHED</span>}
//                 </div>
//                 <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
//                     Your Itinerary <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
//                 </h2>
//             </div>
//             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
//                 <Plane className="w-6 h-6 text-blue-400" />
//             </div>
//         </div>

//         {/* Content - Timeline Layout */}
//         <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0F172A] relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
//             {/* Background decorative line */}
//             <div className="absolute left-[2.85rem] md:left-[3.5rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-transparent" />

//             <div className="space-y-16 relative z-10 pb-20">
//                 {daySections.map((section, idx) => {
//                     const lines = section.split("\n");
//                     const title = lines[0].replace(/^#+\s*/, "").replace(/\*\*/g, ""); 
//                     const content = lines.slice(1).join("\n");

//                     return (
//                         <div key={idx} className="relative pl-16 md:pl-24 group">
                            
//                             {/* Timeline Node */}
//                             <div className="absolute left-3 md:left-6 top-0 w-12 h-12 flex flex-col items-center justify-center">
//                                 <div className="w-4 h-4 rounded-full bg-[#0F172A] border-[3px] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-20 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-500" />
//                                 <div className="mt-3 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-bold text-slate-300 backdrop-blur-md shadow-lg">
//                                     DAY {idx + 1}
//                                 </div>
//                             </div>

//                             {/* Content Card */}
//                             <div className="relative bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-[2rem] 
//                                           hover:bg-slate-800/60 hover:border-white/10 transition-all duration-500 
//                                           hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 group-hover:shadow-cyan-900/10">
                                
//                                 {/* Card Glow Effect */}
//                                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

//                                 <div className="relative z-10">
//                                     <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
//                                         <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
//                                             <Calendar className="w-6 h-6" />
//                                         </div>
//                                         <h3 className="text-2xl font-bold text-white tracking-wide">
//                                             {title || `Day ${idx + 1}`}
//                                         </h3>
//                                     </div>

//                                     <div className="prose prose-invert prose-lg max-w-none">
//                                         <ReactMarkdown components={MarkdownComponents}>
//                                             {content}
//                                         </ReactMarkdown>
//                                     </div>

//                                     <div className="mt-8 flex items-center gap-6 text-xs font-semibold text-slate-500 border-t border-white/5 pt-6">
//                                         <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-default">
//                                             <Clock size={16} /> Full Day Plan
//                                         </span>
//                                         <span className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-default">
//                                             <Star size={16} /> Top Rated Spots
//                                         </span>
//                                         <div className="ml-auto flex items-center gap-1.5 text-slate-600 bg-black/20 px-3 py-1 rounded-full">
//                                             <Navigation size={14} />
//                                             <span>AI Optimized</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
            
//             {/* End Marker */}
//             <div className="relative pl-16 md:pl-24 opacity-40 hover:opacity-100 transition-opacity duration-300">
//                 <div className="absolute left-3 md:left-6 top-0 w-12 flex justify-center">
//                     <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
//                 </div>
//                 <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
//                     <MapPin size={16} />
//                     End of Itinerary
//                 </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf"; // Only jsPDF is needed now
import {
  Terminal,
  Map,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Sun,
  Moon,
  Coffee,
  Plane,
  Star,
  Download 
} from "lucide-react";

// --- Custom Components for Premium Markdown Styling ---
const MarkdownComponents = {
  p: ({ children }) => (
    <p className="text-slate-300/90 leading-7 mb-4 text-[15px] font-normal tracking-wide">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
      <Sparkles className="w-5 h-5 text-amber-400" />
      <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        {children}
      </span>
    </h3>
  ),
  ul: ({ children }) => <ul className="space-y-4 my-6 pl-2">{children}</ul>,
  li: ({ children }) => (
    <li className="flex items-start gap-4 text-slate-200 text-[15px] group transition-all duration-300 hover:translate-x-1">
      <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] flex-shrink-0 group-hover:scale-125 transition-transform" />
      <span className="leading-relaxed">{children}</span>
    </li>
  ),
  strong: ({ children }) => {
    const text = String(children).toLowerCase();
    let icon = null;
    let colorClass = "text-white bg-white/10 border-white/20";

    if (text.includes("morning")) {
        icon = <Sun size={14} />;
        colorClass = "text-amber-200 bg-amber-500/20 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
    } else if (text.includes("afternoon") || text.includes("lunch")) {
        icon = <Coffee size={14} />;
        colorClass = "text-orange-200 bg-orange-500/20 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]";
    } else if (text.includes("evening") || text.includes("night") || text.includes("dinner")) {
        icon = <Moon size={14} />;
        colorClass = "text-indigo-200 bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]";
    }

    return (
      <span className={`inline-flex items-center gap-2 font-bold px-3 py-1 rounded-full border text-xs uppercase tracking-wider ${colorClass} mx-1 transform hover:scale-105 transition-transform`}>
        {icon} {children}
      </span>
    );
  },
};

export default function TravelItinerary({ result, logs, loading, isCached }) {
  const logsEndRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const splitIntoDays = (md) => {
    if (!md) return [];
    const re = /(?=^#{1,3}\s*Day\s*\d+.*$)/gim;
    let parts = md.split(re).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) parts = md.split(/(?=Day\s\d+:)/g).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 1 && md.length > 500) return [md]; 
    return parts;
  };

  const daySections = splitIntoDays(result);

  // --- SIMPLE TEXT PDF GENERATOR ---
  const handleDownloadPDF = () => {
    if (!result) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF();
      
      // 1. Setup Document
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // 2. Clean up Markdown symbols for plain text
      const cleanText = result
        .replace(/\*\*/g, "")      // Remove bold
        .replace(/###/g, "")       // Remove H3
        .replace(/##/g, "")        // Remove H2
        .replace(/#/g, "")         // Remove H1
        .replace(/\[.*?\]/g, "")   // Remove citations/links
        .replace(/\n\s*\n/g, "\n") // Remove extra empty lines
        .trim();

      // 3. Add Title
      doc.setFontSize(18);
      doc.text("Travel Itinerary Plan", 20, 20);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28);
      
      // 4. Wrap text to fit page width
      doc.setFontSize(11);
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);
      
      const splitText = doc.splitTextToSize(cleanText, maxLineWidth);
      
      // 5. Add text line by line (handling page breaks)
      let y = 40; // Start position
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.getHeight();

      splitText.forEach(line => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = 20; // Reset Y for new page
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      // 6. Save
      doc.save("My_Travel_Plan.pdf");

    } catch (error) {
      console.error("PDF Error", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // --- STATE 1: IDLE ---
  if (!loading && !result && logs.length === 0) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0B1120]/80 backdrop-blur-md rounded-[2rem] border border-white/5 border-dashed p-10 text-center animate-in fade-in zoom-in-95 duration-500 group cursor-default">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:blur-3xl transition-all duration-700"></div>
            <Map className="w-10 h-10 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Awaiting Coordinates</h3>
        <p className="text-slate-400 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">
          Initialize the AI agent on the left to begin your journey generation.
        </p>
      </div>
    );
  }

  // --- STATE 2: LOADING ---
  if (loading || (!result && logs.length > 0)) {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#050505] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[650px] relative font-mono">
          <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <Terminal className="w-3 h-3 text-emerald-500" />
              SYSTEM_ACTIVE
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-3 scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 text-sm font-light animate-in fade-in slide-in-from-left-2 duration-300 group">
                <span className="text-slate-700 shrink-0 select-none text-xs pt-0.5 font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                <span className="text-blue-500 shrink-0 select-none">➜</span>
                <span className={`${
                  log.includes("Error") ? "text-red-400" : 
                  log.includes("Complete") ? "text-emerald-400 font-medium" : "text-slate-300"
                }`}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  // --- STATE 3: RESULT ---
  return (
    <div className="h-full animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-[#0F172A] rounded-[2.5rem] shadow-2xl overflow-hidden h-full border border-slate-800 relative flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-700/50 p-6 z-20 sticky top-0 flex justify-between items-center shadow-lg shadow-black/20">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Mission Report</span>
                    {isCached && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">CACHED</span>}
                </div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                    Your Itinerary <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </h2>
            </div>
            
            <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDownloading ? (
                   <span className="animate-pulse">Saving...</span> 
                ) : (
                    <>
                        <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Download Travel plan</span>
                    </>
                )}
            </button>
        </div>

        {/* Content - Timeline Layout (Visible to User) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0F172A] relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="absolute left-[2.85rem] md:left-[3.5rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-transparent" />

            <div className="space-y-16 relative z-10 pb-20">
                {daySections.map((section, idx) => {
                    const lines = section.split("\n");
                    const title = lines[0].replace(/^#+\s*/, "").replace(/\*\*/g, ""); 
                    const content = lines.slice(1).join("\n");

                    return (
                        <div key={idx} className="relative pl-16 md:pl-24 group">
                            <div className="absolute left-3 md:left-6 top-0 w-12 h-12 flex flex-col items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-[#0F172A] border-[3px] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-20 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-500" />
                                <div className="mt-3 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-bold text-slate-300 backdrop-blur-md shadow-lg">
                                    DAY {idx + 1}
                                </div>
                            </div>

                            <div className="relative bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-[2rem] hover:bg-slate-800/60 hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 group-hover:shadow-cyan-900/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-wide">{title || `Day ${idx + 1}`}</h3>
                                    </div>
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
                                    </div>
                                    <div className="mt-8 flex items-center gap-6 text-xs font-semibold text-slate-500 border-t border-white/5 pt-6">
                                        <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-default">
                                            <Clock size={16} /> Full Day Plan
                                        </span>
                                        <span className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-default">
                                            <Star size={16} /> Top Rated Spots
                                        </span>
                                        <div className="ml-auto flex items-center gap-1.5 text-slate-600 bg-black/20 px-3 py-1 rounded-full">
                                            <Navigation size={14} />
                                            <span>AI Optimized</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="relative pl-16 md:pl-24 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute left-3 md:left-6 top-0 w-12 flex justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
                </div>
                <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <MapPin size={16} /> End of Itinerary
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}