import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, Download, Filter
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

import { dummySponsorshipHistory } 
from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function SponsorHistory() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) {
            navigate(createPageUrl('SignIn'));
            return;
        }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') {
            navigate(createPageUrl('Home'));
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events', icon: Search, page: 'SponsorBrowseEvents' },
        { label: 'My Applications', icon: Calendar, page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History, page: 'SponsorHistory' },
        { label: 'Profile Settings', icon: Settings, page: 'SponsorSettings' },
    ];

    const totalSpent = dummySponsorshipHistory.reduce((sum, s) => sum + s.amount, 0);

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Sponsorship History</h1>
                                <p className="text-slate-600 mt-1">View all your past and current sponsorships</p>
                            </div>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Report
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Total Invested</p>
                                <p className="text-3xl font-bold text-[#1E3A8A] mt-2">
                                    ${totalSpent.toLocaleString()}
                                </p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Events Sponsored</p>
                                <p className="text-3xl font-bold text-[#22C55E] mt-2">
                                    {dummySponsorshipHistory.length}
                                </p>
                            </Card>
                            <Card className="p-6">
                                <p className="text-sm text-slate-500">Active Sponsorships</p>
                                <p className="text-3xl font-bold text-[#F97316] mt-2">
                                    {dummySponsorshipHistory.filter(s => s.status === 'active').length}
                                </p>
                            </Card>
                        </div>

                        <Card>
                            <div className="p-4 border-b flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input placeholder="Search history..." className="pl-10" />
                                </div>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>

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
                                        {dummySponsorshipHistory.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.eventTitle}</TableCell>
                                                <TableCell>{item.college}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.package}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-[#22C55E]">
                                                    ${item.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        item.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }>
                                                        {item.status}
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
