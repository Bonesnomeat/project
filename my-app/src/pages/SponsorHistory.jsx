import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, Download, Filter, X, FileText, FileSpreadsheet, ChevronDown
} from 'lucide-react';

import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";

import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";

import { dummySponsorshipHistory } 
from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function SponsorHistory() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [packageFilter, setPackageFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Export dropdown
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportRef = useRef(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
    }, [navigate]);

    // ✅ Close export dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportRef.current && !exportRef.current.contains(e.target)) {
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const uniquePackages = ['all', ...new Set(dummySponsorshipHistory.map(s => s.package))];
    const uniqueStatuses = ['all', ...new Set(dummySponsorshipHistory.map(s => s.status))];

    const filteredHistory = dummySponsorshipHistory.filter(item => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            !query ||
            item.eventTitle?.toLowerCase().includes(query) ||
            item.college?.toLowerCase().includes(query) ||
            item.package?.toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query) ||
            item.amount?.toString().includes(query) ||
            item.date?.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesPackage = packageFilter === 'all' || item.package === packageFilter;
        return matchesSearch && matchesStatus && matchesPackage;
    });

    const totalSpent = filteredHistory.reduce((sum, s) => sum + s.amount, 0);
    const activeCount = filteredHistory.filter(s => s.status === 'active').length;

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPackageFilter('all');
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || packageFilter !== 'all';

    // ✅ Export as CSV
    const exportCSV = () => {
        const headers = ['Event', 'College', 'Package', 'Amount (₹)', 'Date', 'Status'];
        const rows = filteredHistory.map(item => [
            `"${item.eventTitle}"`,
            `"${item.college}"`,
            `"${item.package}"`,
            item.amount,
            `"${item.date}"`,
            `"${item.status}"`,
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sponza-history-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    // ✅ Export as PDF using browser print
    const exportPDF = () => {
        const companyName = user?.companyName || user?.name || 'Sponsor';
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

        const rows = filteredHistory.map(item => `
            <tr>
                <td>${item.eventTitle}</td>
                <td>${item.college}</td>
                <td>${item.package}</td>
                <td style="color:#22C55E;font-weight:600;">₹${item.amount.toLocaleString()}</td>
                <td>${item.date}</td>
                <td>
                    <span style="
                        padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;
                        background:${item.status === 'completed' ? '#f1f5f9' : item.status === 'active' ? '#dcfce7' : '#fef9c3'};
                        color:${item.status === 'completed' ? '#475569' : item.status === 'active' ? '#15803d' : '#a16207'};
                    ">${item.status}</span>
                </td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Sponsorship History — ${companyName}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1F2937; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                    .brand { font-size: 26px; font-weight: 800; color: #1E3A8A; letter-spacing: -0.5px; }
                    .brand span { color: #22C55E; }
                    .meta { text-align: right; font-size: 13px; color: #6B7280; }
                    .meta strong { display: block; font-size: 15px; color: #1F2937; margin-bottom: 2px; }
                    h2 { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
                    .subtitle { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
                    .stats { display: flex; gap: 16px; margin-bottom: 28px; }
                    .stat { flex: 1; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 18px; }
                    .stat-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
                    .stat-value { font-size: 22px; font-weight: 800; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    th { background: #1E3A8A; color: white; padding: 10px 14px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                    td { padding: 10px 14px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
                    tr:nth-child(even) td { background: #F8FAFC; }
                    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; text-align: center; }
                    @media print {
                        body { padding: 20px; }
                        @page { margin: 1cm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">Spon<span>za</span></div>
                    <div class="meta">
                        <strong>${companyName}</strong>
                        Report generated: ${date}
                    </div>
                </div>

                <h2>Sponsorship History Report</h2>
                <p class="subtitle">
                    ${hasActiveFilters ? `Filtered results — ${filteredHistory.length} of ${dummySponsorshipHistory.length} records` : `All records — ${filteredHistory.length} entries`}
                </p>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">Total Invested</div>
                        <div class="stat-value" style="color:#1E3A8A;">₹${totalSpent.toLocaleString()}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Events Sponsored</div>
                        <div class="stat-value" style="color:#22C55E;">${filteredHistory.length}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Active Sponsorships</div>
                        <div class="stat-value" style="color:#F97316;">${activeCount}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>College</th>
                            <th>Package</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>

                <div class="footer">
                    This report was generated by Sponza — Fueling Events. Empowering Ideas.
                </div>

                <script>window.onload = () => { window.print(); }</script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        setShowExportMenu(false);
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events', icon: Search, page: 'SponsorBrowseEvents' },
        { label: 'My Applications', icon: Calendar, page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History, page: 'SponsorHistory' },
        { label: 'Profile Settings', icon: Settings, page: 'SponsorSettings' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar 
                items={sidebarItems} 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed}
                userRole="sponsor"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader 
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="SponsorSettings"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Sponsorship History</h1>
                                <p className="text-slate-600 mt-1">View all your past and current sponsorships</p>
                            </div>

                            {/* ✅ Export dropdown button */}
                            <div className="relative" ref={exportRef}>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Report
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                                </Button>

                                {/* Dropdown menu */}
                                {showExportMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                        <button
                                            onClick={exportCSV}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                            <div className="text-left">
                                                <p className="font-medium">Export as CSV</p>
                                                <p className="text-xs text-slate-400">Excel compatible</p>
                                            </div>
                                        </button>
                                        <div className="border-t border-slate-100" />
                                        <button
                                            onClick={exportPDF}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-red-500" />
                                            <div className="text-left">
                                                <p className="font-medium">Export as PDF</p>
                                                <p className="text-xs text-slate-400">Print-ready report</p>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">
                                    Total Invested {hasActiveFilters && <span className="text-xs text-[#1E3A8A]">(filtered)</span>}
                                </p>
                                <p className="text-3xl font-bold text-[#1E3A8A] mt-2">₹{totalSpent.toLocaleString()}</p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">
                                    Events Sponsored {hasActiveFilters && <span className="text-xs text-[#1E3A8A]">(filtered)</span>}
                                </p>
                                <p className="text-3xl font-bold text-[#22C55E] mt-2">{filteredHistory.length}</p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">
                                    Active Sponsorships {hasActiveFilters && <span className="text-xs text-[#1E3A8A]">(filtered)</span>}
                                </p>
                                <p className="text-3xl font-bold text-[#F97316] mt-2">{activeCount}</p>
                            </Card>
                        </div>

                        <Card>
                            {/* Search + Filter Bar */}
                            <div className="p-4 border-b">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            placeholder="Search by event, college, package, status..."
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={showFilters ? 'border-[#1E3A8A] text-[#1E3A8A]' : ''}
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filter
                                        {(statusFilter !== 'all' || packageFilter !== 'all') && (
                                            <span className="ml-2 w-5 h-5 bg-[#1E3A8A] text-white rounded-full text-xs flex items-center justify-center">
                                                {[statusFilter !== 'all', packageFilter !== 'all'].filter(Boolean).length}
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {showFilters && (
                                    <div className="mt-3 flex flex-col md:flex-row gap-3 pt-3 border-t">
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Status</p>
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Filter by status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {uniqueStatuses.map(s => (
                                                        <SelectItem key={s} value={s}>
                                                            {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Package</p>
                                            <Select value={packageFilter} onValueChange={setPackageFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Filter by package" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {uniquePackages.map(p => (
                                                        <SelectItem key={p} value={p}>
                                                            {p === 'all' ? 'All Packages' : p}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {hasActiveFilters && (
                                            <div className="flex items-end">
                                                <Button variant="ghost" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <X className="w-4 h-4 mr-1" />
                                                    Clear All
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Active filter tags */}
                            {hasActiveFilters && (
                                <div className="px-4 py-2 flex flex-wrap gap-2 border-b bg-slate-50">
                                    <span className="text-xs text-slate-500 self-center">Active filters:</span>
                                    {searchQuery && (
                                        <span className="px-2 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                            Search: "{searchQuery}"
                                            <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                    {statusFilter !== 'all' && (
                                        <span className="px-2 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                            Status: {statusFilter}
                                            <button onClick={() => setStatusFilter('all')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                    {packageFilter !== 'all' && (
                                        <span className="px-2 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                            Package: {packageFilter}
                                            <button onClick={() => setPackageFilter('all')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Package</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.length > 0 ? (
                                            filteredHistory.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.eventTitle}</TableCell>
                                                    <TableCell>{item.college}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{item.package}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-[#22C55E]">
                                                        ₹{item.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            item.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                                            item.status === 'active'    ? 'bg-green-100 text-green-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-16">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Search className="w-10 h-10 text-slate-300" />
                                                        <p className="text-slate-500 font-medium">No results found</p>
                                                        <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                                                        {hasActiveFilters && (
                                                            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
                                                                Clear Filters
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Results count */}
                            {filteredHistory.length > 0 && (
                                <div className="px-4 py-3 border-t bg-slate-50 text-sm text-slate-500">
                                    Showing {filteredHistory.length} of {dummySponsorshipHistory.length} records
                                </div>
                            )}
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}