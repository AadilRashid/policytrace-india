'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function BillPage() {
  const params = useParams();
  const [bill, setBill] = useState(null);
  const [pincode, setPincode] = useState('');
  const [language, setLanguage] = useState('english');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billLoading, setBillLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [expandedSection, setExpandedSection] = useState('summary');

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const res = await fetch(`/api/bills/${params.id}`);
      const data = await res.json();
      setBill(data.bill);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBillLoading(false);
    }
  };

  const analyzeImpact = async () => {
    if (!pincode) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId: params.id, pincode, language })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API error:', errorData);
        return;
      }
      
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on the bill analysis, ${chatInput.toLowerCase().includes('district') ? 'this bill will affect your district through changes in local implementation.' : 'I can help you understand this legislation better.'}` 
      }]);
    }, 1000);
    setChatInput('');
  };

  if (billLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bill...</p>
        </div>
      </div>
    );
  }

  if (!bill) return <div className="p-6 text-black">Bill not found</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bills
          </a>
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
              <option value="tamil">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Filters & Navigation */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Navigation</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setExpandedSection('summary')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                expandedSection === 'summary' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setExpandedSection('impact')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                expandedSection === 'impact' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Impact Analysis
            </button>
            <button
              onClick={() => setExpandedSection('fulltext')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                expandedSection === 'fulltext' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Full Text
            </button>
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Bill Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">{bill.status}</span>
              </div>
              <div className="text-xs text-gray-500">{bill.ministry}</div>
            </div>
          </div>

          {/* Placeholder Image */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Impact visualization</p>
          </div>
        </aside>

        {/* Main Content - Bill Details */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-2">{bill.title}</h1>
          <div className="flex gap-3 mb-6">
            <span className="px-3 py-1 bg-black text-white rounded-full text-sm">
              {bill.status}
            </span>
            <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-sm">
              {bill.ministry}
            </span>
          </div>

          {/* Progressive Disclosure */}
          {expandedSection === 'summary' && (
            <div className="space-y-6">
              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-border">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{bill.summary}</p>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-border">
                <h2 className="text-lg font-semibold mb-4">Check Your Area Impact</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter pincode (e.g., 110001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={analyzeImpact}
                    disabled={loading || !pincode}
                    className="px-6 py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg font-medium transition"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </section>
            </div>
          )}

          {expandedSection === 'fulltext' && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-border">
              <h2 className="text-lg font-semibold mb-4">Full Bill Text</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bill.full_text || bill.summary}</p>
            </section>
          )}
        </main>

        {/* Right Panel - AI Insights */}
        <aside className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Insights
            </h3>
          </div>

          {/* AI Analysis Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {analysis ? (
              <>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-border">
                  <h4 className="text-sm font-semibold text-black mb-2">Impact Summary</h4>
                  <p className="text-sm text-gray-700">{analysis.english_summary}</p>
                </div>

                {analysis.affected_groups && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Who's Affected</h4>
                    {analysis.affected_groups.map((group, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 shadow-border">
                        <p className="text-sm font-medium text-black">{group.group}</p>
                        <p className="text-xs text-gray-600 mt-1">{group.impact}</p>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.impact_scores && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-border">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Impact Scores</h4>
                    {Object.entries(analysis.impact_scores).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 capitalize">{key}</span>
                          <span className="text-black font-medium">{value}/10</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-black" style={{width: `${value * 10}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-sm">Enter your pincode to see AI-powered impact analysis</p>
              </div>
            )}
          </div>

          {/* AI Chat Interface */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 max-h-48 overflow-y-auto space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-sm p-2 rounded-lg ${
                  msg.role === 'user' ? 'bg-black text-white ml-4' : 'bg-gray-100 text-gray-700 mr-4'
                }`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about this bill..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button
                onClick={sendChatMessage}
                className="p-2 bg-black hover:bg-gray-800 text-white rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
