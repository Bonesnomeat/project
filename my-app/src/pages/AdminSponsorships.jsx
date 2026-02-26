import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, FileText,
    BarChart3, Search, Filter, Download, TrendingUp
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import { dummySponsorshipRequests, dummyPaymentRecords, dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';
export default function AdminSponsorships() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // ✅ Check sessionStorage for admin unlock
        const adminUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
        if (!adminUnlocked) {
            navigate(createPageUrl('AdminPanel'));
            return;
        }
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            const parsed = JSON.parse(auth);
            setUser(parsed);
        } else {
            setUser({
                id: 'admin-1',
                name: 'Admin',
                email: 'admin@sponza.com',
                role: 'admin',
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked'); // ✅ Clear session on logout
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users', icon: Users, page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar, page: 'AdminEvents' },
        { label: 'Sponsorships', icon: FileText, page: 'AdminSponsorships' },
        { label: 'Reports', icon: BarChart3, page: 'AdminReports' },
    ];

    const totalValue = dummyPaymentRecords.reduce((sum, p) => sum + p.amount, 0);
    const pendingValue = dummyPaymentRecords.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Sponsorship Monitoring</h1>
                                <p className="text-slate-600 mt-1">Track all sponsorship activities</p>
                            </div>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Total Sponsorships</p>
                                <p className="text-3xl font-bold text-[#1E3A8A] mt-2">${totalValue.toLocaleString()}</p>
                                <div className="flex items-center mt-2 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm">+25% this month</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Pending Payments</p>
                                <p className="text-3xl font-bold text-[#F97316] mt-2">${pendingValue.toLocaleString()}</p>
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
                                        {dummySponsorshipRequests.map((request) => {
                                            // ✅ Find matching event from dummyEvents to get college + location
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
                                                    {/* ✅ College name */}
                                                    <TableCell>
                                                        <span className="font-medium text-[#1F2937]">
                                                            {matchedEvent?.college || '—'}
                                                        </span>
                                                    </TableCell>
                                                    {/* ✅ Location */}
                                                    <TableCell>
                                                        <span className="text-slate-500 text-sm">
                                                            {matchedEvent?.location || '—'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{request.package}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-[#22C55E]">
                                                        ${request.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{request.date}</TableCell>
                                                    <TableCell>
                                                        <Badge className={
                                                            request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
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
                                        {dummyPaymentRecords.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-medium">{payment.sponsor}</TableCell>
                                                <TableCell>{payment.event}</TableCell>
                                                <TableCell className="font-semibold text-[#22C55E]">
                                                    ${payment.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                            'bg-yellow-100 text-yellow-700'
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