import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, FileText,
    BarChart3, Download, TrendingUp, ChevronDown,
    FileSpreadsheet
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import { dummySponsorshipRequests, dummyPaymentRecords, dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function AdminSponsorships() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
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

    const totalValue   = dummyPaymentRecords.reduce((sum, p) => sum + p.amount, 0);
    const pendingValue = dummyPaymentRecords.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

    // ✅ Export as CSV — exports BOTH sponsorship requests and payment records
    const exportCSV = () => {
        const date = new Date().toISOString().slice(0, 10);

        // Section 1: Sponsorship Requests
        const reqHeaders = ['Sponsor', 'Event', 'College', 'Location', 'Package', 'Amount (₹)', 'Date', 'Status'];
        const reqRows = dummySponsorshipRequests.map(r => {
            const ev = dummyEvents.find(e => e.id === r.eventId);
            return [
                `"${r.sponsor}"`,
                `"${r.eventTitle}"`,
                `"${ev?.college || '—'}"`,
                `"${ev?.location || '—'}"`,
                `"${r.package}"`,
                r.amount,
                `"${r.date}"`,
                `"${r.status}"`,
            ].join(',');
        });

        // Section 2: Payment Records
        const payHeaders = ['Sponsor', 'Event', 'Amount (₹)', 'Method', 'Date', 'Status'];
        const payRows = dummyPaymentRecords.map(p => [
            `"${p.sponsor}"`,
            `"${p.event}"`,
            p.amount,
            `"${p.method}"`,
            `"${p.date}"`,
            `"${p.status}"`,
        ].join(','));

        const csvContent = [
            'SPONSORSHIP REQUESTS',
            reqHeaders.join(','),
            ...reqRows,
            '',
            'PAYMENT RECORDS',
            payHeaders.join(','),
            ...payRows,
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `sponza-sponsorships-${date}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    // ✅ Export as PDF — styled print report
    const exportPDF = () => {
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

        const reqRows = dummySponsorshipRequests.map(r => {
            const ev = dummyEvents.find(e => e.id === r.eventId);
            return `
                <tr>
                    <td>${r.sponsor}</td>
                    <td>${r.eventTitle}</td>
                    <td>${ev?.college || '—'}</td>
                    <td style="font-size:12px;color:#6B7280">${ev?.location || '—'}</td>
                    <td>${r.package}</td>
                    <td style="color:#22C55E;font-weight:600;">₹${r.amount.toLocaleString()}</td>
                    <td>${r.date}</td>
                    <td>
                        <span style="
                            padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;
                            background:${r.status === 'approved' ? '#dcfce7' : r.status === 'pending' ? '#fef9c3' : '#fee2e2'};
                            color:${r.status === 'approved' ? '#15803d' : r.status === 'pending' ? '#a16207' : '#b91c1c'};
                        ">${r.status}</span>
                    </td>
                </tr>`;
        }).join('');

        const payRows = dummyPaymentRecords.map(p => `
            <tr>
                <td>${p.sponsor}</td>
                <td>${p.event}</td>
                <td style="color:#22C55E;font-weight:600;">₹${p.amount.toLocaleString()}</td>
                <td>${p.method}</td>
                <td>${p.date}</td>
                <td>
                    <span style="
                        padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;
                        background:${p.status === 'paid' ? '#dcfce7' : '#fef9c3'};
                        color:${p.status === 'paid' ? '#15803d' : '#a16207'};
                    ">${p.status}</span>
                </td>
            </tr>`
        ).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Sponsorship Report — Sponza Admin</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1F2937; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                    .brand { font-size: 26px; font-weight: 800; color: #1E3A8A; }
                    .brand span { color: #22C55E; }
                    .meta { text-align: right; font-size: 13px; color: #6B7280; }
                    .meta strong { display: block; font-size: 15px; color: #1F2937; }
                    .stats { display: flex; gap: 16px; margin-bottom: 32px; }
                    .stat { flex: 1; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 18px; }
                    .stat-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
                    .stat-value { font-size: 22px; font-weight: 800; }
                    h2 { font-size: 16px; font-weight: 700; margin: 28px 0 12px; color: #1E3A8A; border-bottom: 2px solid #E5E7EB; padding-bottom: 6px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
                    th { background: #1E3A8A; color: white; padding: 9px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                    td { padding: 9px 12px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
                    tr:nth-child(even) td { background: #F8FAFC; }
                    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF; text-align: center; }
                    @media print { body { padding: 20px; } @page { margin: 1cm; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">Spon<span>za</span> <span style="font-size:14px;font-weight:500;color:#6B7280;">Admin Report</span></div>
                    <div class="meta">
                        <strong>Sponsorship Monitoring</strong>
                        Generated: ${date}
                    </div>
                </div>

                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">Total Sponsorships</div>
                        <div class="stat-value" style="color:#1E3A8A;">₹${totalValue.toLocaleString()}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Pending Payments</div>
                        <div class="stat-value" style="color:#F97316;">₹${pendingValue.toLocaleString()}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Active Deals</div>
                        <div class="stat-value" style="color:#22C55E;">${dummySponsorshipRequests.filter(r => r.status === 'approved').length}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Pending Requests</div>
                        <div class="stat-value" style="color:#1F2937;">${dummySponsorshipRequests.filter(r => r.status === 'pending').length}</div>
                    </div>
                </div>

                <h2>Sponsorship Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sponsor</th><th>Event</th><th>College</th><th>Location</th>
                            <th>Package</th><th>Amount</th><th>Date</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${reqRows}</tbody>
                </table>

                <h2>Payment Records</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sponsor</th><th>Event</th><th>Amount</th>
                            <th>Method</th><th>Date</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>${payRows}</tbody>
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
                                <h1 className="text-3xl font-bold text-[#1F2937]">Sponsorship Monitoring</h1>
                                <p className="text-slate-600 mt-1">Track all sponsorship activities</p>
                            </div>

                            {/* ✅ Export dropdown */}
                            <div className="relative" ref={exportRef}>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Data
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

                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Total Sponsorships</p>
                                <p className="text-3xl font-bold text-[#1E3A8A] mt-2">₹{totalValue.toLocaleString()}</p>
                                <div className="flex items-center mt-2 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm">+25% this month</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Pending Payments</p>
                                <p className="text-3xl font-bold text-[#F97316] mt-2">₹{pendingValue.toLocaleString()}</p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Active Deals</p>
                                <p className="text-3xl font-bold text-[#22C55E] mt-2">
                                    {dummySponsorshipRequests.filter(r => r.status === 'approved').length}
                                </p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Pending Requests</p>
                                <p className="text-3xl font-bold text-[#1F2937] mt-2">
                                    {dummySponsorshipRequests.filter(r => r.status === 'pending').length}
                                </p>
                            </Card>
                        </div>

                        {/* Recent Sponsorship Requests */}
                        <Card className="mb-8">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-[#1F2937]">Recent Sponsorship Requests</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sponsor</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Package</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dummySponsorshipRequests.map(request => {
                                            const matchedEvent = dummyEvents.find(e => e.id === request.eventId);
                                            return (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={request.sponsorLogo}
                                                                alt={request.sponsor}
                                                                className="w-10 h-10 rounded-lg object-cover"
                                                            />
                                                            <span className="font-medium">{request.sponsor}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{request.eventTitle}</TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-[#1F2937]">
                                                            {matchedEvent?.college || '—'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-slate-500 text-sm">
                                                            {matchedEvent?.location || '—'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{request.package}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-[#22C55E]">
                                                        ₹{request.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{request.date}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            request.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }>
                                                            {request.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* Payment Records */}
                        <Card>
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-[#1F2937]">Payment Records</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sponsor</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dummyPaymentRecords.map(payment => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-medium">{payment.sponsor}</TableCell>
                                                <TableCell>{payment.event}</TableCell>
                                                <TableCell className="font-semibold text-[#22C55E]">
                                                    ₹{payment.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        payment.status === 'paid'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }>
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}