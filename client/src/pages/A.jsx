import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Plane, Calendar, MapPin, Wallet, Users, Sparkles, Loader2, FileText } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCached, setIsCached] = useState(false);
  
  const [formData, setFormData] = useState({
    origin: '',
    destinations: '',
    start_date: '',
    end_date: '',
    budget_range: 'mid-range',
    travel_style: 'cultural',
    interests: '',
    group_size: 1
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setIsCached(false);

    // Format data for Python API
    const payload = {
      ...formData,
      destinations: formData.destinations.split(',').map(s => s.trim()),
      interests: formData.interests.split(',').map(s => s.trim()),
      group_size: parseInt(formData.group_size) || 1
    };

    try {
      const response = await axios.post('http://localhost:8000/api/plan-trip', payload);
      setResult(response.data.itinerary);
      if (response.data.cached) setIsCached(true);
    } catch (error) {
      console.error(error);
      setResult("❌ Error: Could not connect to the server. Is python running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUT FORM */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <Plane className="w-6 h-6 text-blue-500" />
                AI Travel Planner
              </h1>
              <p className="text-sm text-slate-500 mt-1">Powered by OpenAI & Python</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origin & Destination */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Where</label>
                <div className="mt-2 space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input name="origin" placeholder="Origin (e.g. Goa)" required
                      className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                      onChange={handleChange} />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                    <input name="destinations" placeholder="Destinations (e.g. Italy, France)" required
                      className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                      onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">When</label>
                <div className="mt-2 flex gap-2">
                  <input type="date" name="start_date" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={handleChange} />
                  <input type="date" name="end_date" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={handleChange} />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <select name="budget_range" className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none" onChange={handleChange}>
                      <option value="mid-range">Mid-Range</option>
                      <option value="budget">Budget</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="number" name="group_size" min="1" defaultValue="1" 
                      className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Style & Interests */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Style</label>
                <select name="travel_style" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-3" onChange={handleChange}>
                  <option value="cultural">Cultural</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="adventure">Adventure</option>
                  <option value="romantic">Romantic</option>
                  <option value="business">Business</option>
                </select>
                
                <input name="interests" placeholder="Interests (e.g. Photography, Food)" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={handleChange} />
              </div>

              <button type="submit" disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate Plan</>}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fadeIn">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-blue-500" /> Your Itinerary
                </h2>
                {isCached && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">⚡ Loaded from Cache</span>}
              </div>
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
              {loading ? (
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="font-medium text-slate-600">Consulting AI Travel Experts...</p>
                  <p className="text-sm">Analysing weather, costs, and local gems.</p>
                </div>
              ) : (
                <>
                  <Plane className="w-16 h-16 mb-4 opacity-20" />
                  <p>Fill out the form to generate your dream trip.</p>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;