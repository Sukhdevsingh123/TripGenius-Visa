import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Terminal, CheckCircle2, Map, Sparkles } from 'lucide-react';

export default function TravelItinerary({ result, logs, loading }) {
  const logsEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // STATE 1: IDLE (No search yet)
  if (!loading && !result && logs.length === 0) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 border-dashed text-blue-200/40 p-10 text-center">
        <div className="w-24 h-24 bg-blue-500/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Map className="w-10 h-10 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Ready to Plan</h3>
        <p className="max-w-xs mx-auto">Enter your details on the left to start the multi-agent planning process.</p>
      </div>
    );
  }

  // STATE 2: LOADING / STREAMING (Show Terminal)
  if (loading || (!result && logs.length > 0)) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
          
          {/* Terminal Header */}
          <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-green-400/80">
              <Terminal className="w-3 h-3" />
              AGENT_LIVE_STREAM
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-green-400/90 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="opacity-50 select-none">{'>'}</span>
                <span className="break-words leading-relaxed">{log}</span>
              </div>
            ))}
            
            {/* Typing Cursor */}
            <div className="flex gap-3 text-green-500/50 mt-2">
              <span className="opacity-50">{'>'}</span>
              <span className="w-2 h-5 bg-green-500/50 animate-pulse block" />
            </div>
            <div ref={logsEndRef} />
          </div>

          {/* Glowing effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  // STATE 3: RESULT (Show Markdown)
  return (
    <div className="h-full animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden h-full border border-white/20 relative">
        
        {/* Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="flex items-center gap-2 text-blue-100 font-semibold text-sm uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Travel Plan Ready
            </div>
            <h2 className="text-3xl font-bold">Your Itinerary</h2>
          </div>
          {/* Success Badge */}
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Generated successfully
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 h-[calc(100%-128px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-strong:text-slate-800">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}