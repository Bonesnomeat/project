import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Download, TrendingUp, DollarSign, Target,
    ChevronDown, FileSpreadsheet
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { dummyAdminStats } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
    { month: 'Jan', revenue: 125000, events: 12 },
    { month: 'Feb', revenue: 180000, events: 18 },
    { month: 'Mar', revenue: 220000, events: 22 },
    { month: 'Apr', revenue: 280000, events: 28 },
    { month: 'May', revenue: 350000, events: 35 },
    { month: 'Jun', revenue: 420000, events: 42 },
];

const categoryData = [
    { name: 'Tech',       value: 45, color: '#1E3A8A' },
    { name: 'Cultural',   value: 20, color: '#22C55E' },
    { name: 'Sports',     value: 15, color: '#F97316' },
    { name: 'Workshop',   value: 12, color: '#8B5CF6' },
    { name: 'Conference', value:  8, color: '#EC4899' },
];

export default function AdminReports() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [timeRange, setTimeRange] = useState('6months');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportRef = useRef(null);

    useEffect(() => {
        const adminUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
        if (!adminUnlocked) { navigate(createPageUrl('AdminPanel')); return; }
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            setUser(JSON.parse(auth));
        } else {
            setUser({ id: 'admin-1', name: 'Admin', email: 'admin@sponza.com', role: 'admin' });
        }
    }, [navigate]);

    // ✅ Close dropdown when clicking outside
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
        sessionStorage.removeItem('admin_unlocked');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard',     icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users',  icon: Users,           page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar,        page: 'AdminEvents' },
        { label: 'Sponsorships',  icon: FileText,        page: 'AdminSponsorships' },
        { label: 'Reports',       icon: BarChart3,       page: 'AdminReports' },
    ];

    const timeRangeLabel = {
        '30days':  'Last 30 Days',
        '3months': 'Last 3 Months',
        '6months': 'Last 6 Months',
        '1year':   'Last Year',
    }[timeRange];

    // ✅ Export as CSV
    const exportCSV = () => {
        const date = new Date().toISOString().slice(0, 10);

        // Revenue & Events table
        const revenueHeaders = ['Month', 'Revenue (₹)', 'Events Created'];
        const revenueRows = revenueData.map(r => [
            r.month, r.revenue, r.events
        ].join(','));

        // Category breakdown table
        const catHeaders = ['Category', 'Share (%)'];
        const catRows = categoryData.map(c => `"${c.name}",${c.value}`);

        // Summary stats
        const summaryHeaders = ['Metric', 'Value'];
        const summaryRows = [
            '"Total Sponsorship Raised","₹2.5M"',
            '"Avg. Sponsorship","₹18.5K"',
            '"Success Rate","87%"',
            '"Active Users","1250"',
        ];

        const csvContent = [
            `SPONZA PLATFORM REPORT — ${timeRangeLabel}`,
            `Generated: ${new Date().toLocaleDateString('en-IN')}`,
            '',
            'SUMMARY STATS',
            summaryHeaders.join(','),
            ...summaryRows,
            '',
            'REVENUE & EVENTS BY MONTH',
            revenueHeaders.join(','),
            ...revenueRows,
            '',
            'EVENTS BY CATEGORY',
            catHeaders.join(','),
            ...catRows,
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `sponza-report-${date}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    // ✅ Export as PDF
    const exportPDF = () => {
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

        const revenueRows = revenueData.map(r => `
            <tr>
                <td>${r.month}</td>
                <td style="color:#1E3A8A;font-weight:600;">₹${r.revenue.toLocaleString()}</td>
                <td style="color:#22C55E;font-weight:600;">${r.events}</td>
            </tr>
        `).join('');

        const catRows = categoryData.map(c => `
            <tr>
                <td>
                    <span style="display:inline-flex;align-items:center;gap:6px;">
                        <span style="width:10px;height:10px;border-radius:50%;background:${c.color};display:inline-block;"></span>
                        ${c.name}
                    </span>
                </td>
                <td>
                    <div style="background:#F1F5F9;border-radius:4px;height:10px;width:100%;overflow:hidden;">
                        <div style="background:${c.color};height:10px;width:${c.value}%;"></div>
                    </div>
                </td>
                <td style="font-weight:600;color:${c.color};">${c.value}%</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Platform Report — Sponza Admin</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1F2937; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                    .brand { font-size: 26px; font-weight: 800; color: #1E3A8A; }
                    .brand span { color: #22C55E; }
                    .meta { text-align: right; font-size: 13px; color: #6B7280; }
                    .meta strong { display: block; font-size: 15px; color: #1F2937; }
                    .period { display: inline-block; margin-bottom: 24px; padding: 4px 12px; background: #EFF6FF; color: #1E3A8A; border-radius: 20px; font-size: 13px; font-weight: 600; }
                    .stats { display: flex; gap: 14px; margin-bottom: 32px; }
                    .stat { flex: 1; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 16px; }
                    .stat-label { font-size: 11px; color: #6B7280; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
                    .stat-value { font-size: 20px; font-weight: 800; }
                    .stat-trend { font-size: 11px; color: #22C55E; margin-top: 4px; }
                    h2 { font-size: 15px; font-weight: 700; margin: 28px 0 12px; color: #1E3A8A; border-bottom: 2px solid #E5E7EB; padding-bottom: 6px; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
                    th { background: #1E3A8A; color: white; padding: 9px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                    td { padding: 9px 14px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
                    tr:nth-child(even) td { background: #F8FAFC; }
                    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; text-align: center; }
                    @media print { body { padding: 20px; } @page { margin: 1cm; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">Spon<span>za</span> <span style="font-size:14px;font-weight:500;color:#6B7280;">Admin Report</span></div>
                    <div class="meta">
                        <strong>Reports & Analytics</strong>
                        Generated: ${date}
                    </div>
                </div>

                <div class="period">📅 ${timeRangeLabel}</div>

                <!-- Summary Stats -->
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">Total Sponsorship Raised</div>
                        <div class="stat-value" style="color:#1E3A8A;">₹2.5M</div>
                        <div class="stat-trend">↑ +32% from last period</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Avg. Sponsorship</div>
                        <div class="stat-value" style="color:#22C55E;">₹18.5K</div>
                        <div class="stat-trend">↑ +12% from last period</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Success Rate</div>
                        <div class="stat-value" style="color:#8B5CF6;">87%</div>
                        <div class="stat-trend">↑ +5% from last period</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Active Users</div>
                        <div class="stat-value" style="color:#F97316;">1,250</div>
                        <div class="stat-trend">↑ +18% from last period</div>
                    </div>
                </div>

                <!-- Revenue & Events -->
                <h2>Revenue & Events by Month</h2>
                <table>
                    <thead>
                        <tr><th>Month</th><th>Revenue (₹)</th><th>Events Created</th></tr>
                    </thead>
                    <tbody>${revenueRows}</tbody>
                </table>

                <!-- Category Breakdown -->
                <h2>Events by Category</h2>
                <table>
                    <thead>
                        <tr><th>Category</th><th>Distribution</th><th>Share</th></tr>
                    </thead>
                    <tbody>${catRows}</tbody>
                </table>

                <div class="footer">Sponza Admin — Fueling Events. Empowering Ideas.</div>

                <script>window.onload = () => { window.print(); }</script>
            </body>
            </html>
        `;

        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        setShowExportMenu(false);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar
                items={sidebarItems}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                userRole="admin"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="AdminPanel"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Reports & Analytics</h1>
                                <p className="text-slate-600 mt-1">Platform performance insights</p>
                            </div>
                            <div className="flex gap-3">
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30days">Last 30 Days</SelectItem>
                                        <SelectItem value="3months">Last 3 Months</SelectItem>
                                        <SelectItem value="6months">Last 6 Months</SelectItem>
                                        <SelectItem value="1year">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* ✅ Export dropdown */}
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

                                    {showExportMenu && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
                        </div>

                        {/* Summary Stats */}
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Total Sponsorship Raised</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">₹2.5M</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+32% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Avg. Sponsorship</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">₹18.5K</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+12% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Success Rate</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">87%</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+5% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Active Users</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">1,250</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+18% from last period</span>
                                </div>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-2 gap-8 mb-8">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Revenue Trend</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis dataKey="month" stroke="#64748B" />
                                            <YAxis stroke="#64748B" tickFormatter={v => `₹${v/1000}K`} />
                                            <Tooltip
                                                formatter={value => [`₹${value.toLocaleString()}`, 'Revenue']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#1E3A8A"
                                                fill="url(#colorRevenue)"
                                                strokeWidth={2}
                                            />
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#1E3A8A" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Events by Category</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={value => [`${value}%`, 'Share']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    {categoryData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-slate-600">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-[#1F2937] mb-6">Events Created per Month</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="month" stroke="#64748B" />
                                        <YAxis stroke="#64748B" />
                                        <Tooltip
                                            formatter={value => [value, 'Events']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="events" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}