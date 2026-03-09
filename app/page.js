'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMinistry, setSelectedMinistry] = useState('all');

  const categories = [
    { id: 'all', name: 'All Bills', count: bills.length },
    { id: 'passed', name: 'Passed', count: bills.filter(b => b.status === 'Passed').length },
    { id: 'pending', name: 'Pending', count: bills.filter(b => b.status === 'Pending').length },
    { id: 'introduced', name: 'Introduced', count: bills.filter(b => b.status === 'Introduced').length },
    { id: 'review', name: 'Under Review', count: bills.filter(b => b.status === 'Under Review').length },
  ];

  const years = ['all', '2024', '2023'];
  const ministries = ['all', ...new Set(bills.map(b => b.ministry).filter(Boolean))];

  useEffect(() => {
    fetchBills();
    autoSyncBills();
  }, []);

  const autoSyncBills = async () => {
    try {
      const res = await fetch('/api/bills');
      const data = await res.json();
      if (!data.bills || data.bills.length === 0) {
        setSyncing(true);
        await fetch('/api/sync-bills', { method: 'POST' });
        await fetchBills();
        setSyncing(false);
      }
    } catch (error) {
      console.error('Auto-sync error:', error);
      setSyncing(false);
    }
  };

  const manualSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/sync-bills', { method: 'POST' });
      await fetchBills();
    } catch (error) {
      console.error('Manual sync error:', error);
    }
    setSyncing(false);
  };

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills');
      const data = await res.json();
      setBills(data.bills || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bills.filter(b => {
    const matchesSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      b.status?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'review' && b.status === 'Under Review');
    const matchesYear = selectedYear === 'all' || b.introduced_date?.startsWith(selectedYear);
    const matchesMinistry = selectedMinistry === 'all' || b.ministry === selectedMinistry;
    return matchesSearch && matchesCategory && matchesYear && matchesMinistry;
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-semibold">PolicyTrace India</h1>
          </div>
          {bills.length === 0 && !loading && (
            <button
              onClick={manualSync}
              disabled={syncing}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {syncing ? 'Loading Bills...' : 'Load Bills'}
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="w-56 flex-shrink-0 space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Status</h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-60">{category.count}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Year</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year === 'all' ? 'All Years' : year}</option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Ministry</h2>
              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
              >
                {ministries.map(ministry => (
                  <option key={ministry} value={ministry}>
                    {ministry === 'all' ? 'All Ministries' : ministry}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search bills..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-black transition text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                  <div className="col-span-2 text-center py-20 text-gray-500">
                    <p className="text-sm">No bills found</p>
                  </div>
                ) : (
                  filtered.map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/bill/${bill.id}`}
                      className="block p-6 border border-gray-200 rounded-lg hover:border-black transition-colors group bg-white"
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h2 className="text-base font-semibold group-hover:underline flex-1">
                            {bill.title}
                          </h2>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{bill.summary}</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-black text-white rounded">
                          {bill.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {bill.ministry}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
