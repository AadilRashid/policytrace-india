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
        alert('Error analyzing impact: ' + (errorData.error || 'Unknown error'));
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze impact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (billLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) return <div className="p-6">Bill not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 shadow-lg">
        <div className="container mx-auto">
          <a href="/" className="text-sm opacity-75 hover:opacity-100 mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all bills
          </a>
          <h1 className="text-3xl font-bold">{bill.title}</h1>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Bill Summary</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{bill.summary}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-blue-700">{bill.status}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600">Ministry</p>
              <p className="font-semibold text-indigo-700">{bill.ministry}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Check Impact on Your Area</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="tamil">தமிழ் (Tamil)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
              <option value="bengali">বাংলা (Bengali)</option>
              <option value="marathi">मराठी (Marathi)</option>
              <option value="gujarati">ગુજરાતી (Gujarati)</option>
              <option value="kannada">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter your pincode (e.g., 110001)"
              className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button
              onClick={analyzeImpact}
              disabled={loading || !pincode}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analyze Impact</span>
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Impact Summary</h3>
                <p className="mb-2"><strong>English:</strong> {analysis.english_summary}</p>
                <p><strong>हिंदी:</strong> {analysis.hindi_summary}</p>
              </div>

              {analysis.affected_groups && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Who is Affected</h3>
                  {analysis.affected_groups.map((group, i) => (
                    <div key={i} className="mb-2 pb-2 border-b last:border-0">
                      <p className="font-medium">{group.group}</p>
                      <p className="text-sm text-gray-700">Impact: {group.impact}</p>
                      <p className="text-sm text-blue-600">Action: {group.action}</p>
                    </div>
                  ))}
                </div>
              )}

              {analysis.financial_impact && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Financial Impact</h3>
                  <p><strong>Benefits:</strong> {analysis.financial_impact.benefits}</p>
                  <p><strong>Costs:</strong> {analysis.financial_impact.costs}</p>
                  <p><strong>Net Impact:</strong> {analysis.financial_impact.net_impact}</p>
                </div>
              )}

              {analysis.action_steps && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold mb-2">What You Should Do</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {analysis.action_steps.map((step, i) => (
                      <li key={i} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
                
              {analysis.impact_scores && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Impact Scores (0-10)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(analysis.impact_scores).map(([group, score]) => (
                      <div key={group} className="flex justify-between">
                        <span className="capitalize">{group.replace('_', ' ')}:</span>
                        <span className="font-semibold">{score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
