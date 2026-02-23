import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Settings, TrendingUp, DollarSign, 
    Building2, GraduationCap, AlertCircle
} from 'lucide-react';

import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import StatsCard from '../components/shared/StatsCard';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";

import { dummyAdminStats, allUsers, dummyEvents } 
from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function AdminPanel() {
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
        if (parsed.role !== 'admin') {
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
        { label: 'Dashboard', icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users', icon: Users, page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar, page: 'AdminEvents' },
        { label: 'Sponsorships', icon: FileText, page: 'AdminSponsorships' },
        { label: 'Reports', icon: BarChart3, page: 'AdminReports' },
    ];

    const stats = [
        { title: 'Total Users', value: dummyAdminStats.totalUsers.toLocaleString(), icon: Users, iconBg: 'bg-blue-100', change: '+12%', trend: 'up' },
        { title: 'Total Events', value: dummyAdminStats.totalEvents.toString(), icon: Calendar, iconBg: 'bg-green-100', change: '+8%', trend: 'up' },
        { title: 'Total Sponsorship', value: `$${(dummyAdminStats.totalSponsorship / 1000000).toFixed(1)}M`, icon: DollarSign, iconBg: 'bg-orange-100', change: '+25%', trend: 'up' },
        { title: 'Pending Approvals', value: dummyAdminStats.pendingApprovals.toString(), icon: AlertCircle, iconBg: 'bg-red-100' },
    ];

    const recentUsers = allUsers.slice(0, 5);
    const recentEvents = dummyEvents.slice(0, 4);

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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Admin Dashboard</h1>
                            <p className="text-slate-600 mt-1">Platform overview and management</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <StatsCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-8">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">User Distribution</h2>
                                <div className="space-y-4">

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1F2937]">Colleges</p>
                                                <p className="text-sm text-slate-500">{dummyAdminStats.totalColleges} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#1E3A8A]">
                                            {Math.round(dummyAdminStats.totalColleges / dummyAdminStats.totalUsers * 100)}%
                                        </span>
                                    </div>

                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${dummyAdminStats.totalColleges / dummyAdminStats.totalUsers * 100}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1F2937]">Sponsors</p>
                                                <p className="text-sm text-slate-500">{dummyAdminStats.totalSponsors} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#22C55E]">
                                            {Math.round(dummyAdminStats.totalSponsors / dummyAdminStats.totalUsers * 100)}%
                                        </span>
                                    </div>

                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${dummyAdminStats.totalSponsors / dummyAdminStats.totalUsers * 100}%` }}
                                        />
                                    </div>

                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Event Status</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-xl">
                                        <p className="text-sm text-green-700 mb-1">Active Events</p>
                                        <p className="text-3xl font-bold text-green-600">{dummyAdminStats.activeEvents}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-600 mb-1">Completed</p>
                                        <p className="text-3xl font-bold text-slate-700">{dummyAdminStats.completedEvents}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-xl">
                                        <p className="text-sm text-yellow-700 mb-1">Pending Review</p>
                                        <p className="text-3xl font-bold text-yellow-600">{dummyAdminStats.pendingApprovals}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <p className="text-sm text-blue-700 mb-1">Total Events</p>
                                        <p className="text-3xl font-bold text-blue-600">{dummyAdminStats.totalEvents}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Users</h2>
                                    <Link to={createPageUrl('AdminUsers')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentUsers.map((u) => (
                                        <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    u.role === 'college' ? 'bg-blue-100' : 'bg-green-100'
                                                }`}>
                                                    {u.role === 'college'
                                                        ? <GraduationCap className="w-5 h-5 text-blue-600" />
                                                        : <Building2 className="w-5 h-5 text-green-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1F2937]">{u.name}</p>
                                                    <p className="text-sm text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                            <Badge>{u.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Events</h2>
                                    <Link to={createPageUrl('AdminEvents')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentEvents.map((event) => (
                                        <div key={event.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg">
                                            <img 
                                                src={event.image} 
                                                alt={event.title}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-[#1F2937]">{event.title}</p>
                                                <p className="text-sm text-slate-500">{event.college}</p>
                                            </div>
                                            <Badge variant="outline">{event.category}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
