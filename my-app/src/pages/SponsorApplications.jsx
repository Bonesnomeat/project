import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, Clock, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";

export default function SponsorApplications() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const applications = [
        {
            id: 1,
            eventTitle: 'TechFest 2024',
            college: 'Tech University',
            package: 'Gold',
            amount: 25000,
            status: 'pending',
            appliedDate: '2024-02-15',
            eventDate: 'March 15-17, 2024',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
        },
        {
            id: 2,
            eventTitle: 'AI Workshop Series',
            college: 'Tech Institute',
            package: 'Knowledge Partner',
            amount: 15000,
            status: 'approved',
            appliedDate: '2024-02-10',
            eventDate: 'June 1-2, 2024',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop'
        },
        {
            id: 3,
            eventTitle: 'Cultural Night 2024',
            college: 'State College',
            package: 'Co-Sponsor',
            amount: 10000,
            status: 'rejected',
            appliedDate: '2024-02-05',
            eventDate: 'April 5, 2024',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop'
        },
    ];

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

    const statusConfig = {
        pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
        approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Approved' },
        rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
    };

    const filteredApplications = activeTab === 'all' 
        ? applications 
        : applications.filter(a => a.status === activeTab);

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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">My Applications</h1>
                            <p className="text-slate-600 mt-1">Track your sponsorship applications</p>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList>
                                <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                                <TabsTrigger value="pending">Pending ({applications.filter(a => a.status === 'pending').length})</TabsTrigger>
                                <TabsTrigger value="approved">Approved ({applications.filter(a => a.status === 'approved').length})</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredApplications.map((app) => {
                                const status = statusConfig[app.status];
                                return (
                                    <Card key={app.id} className="overflow-hidden">
                                        <img 
                                            src={app.image}
                                            alt={app.eventTitle}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-[#1F2937]">{app.eventTitle}</h3>
                                                <Badge className={status.color}>
                                                    <status.icon className="w-3 h-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                            </div>
                                            
                                            <p className="text-sm text-slate-500 mb-2">{app.college}</p>
                                            <p className="text-sm text-slate-500 mb-4">
                                                {app.package} • {app.eventDate}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div>
                                                    <p className="text-xs text-slate-400">Applied</p>
                                                    <p className="text-sm font-medium">{app.appliedDate}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Amount</p>
                                                    <p className="text-lg font-bold text-[#22C55E]">
                                                        ${app.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="w-full mt-4">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {filteredApplications.length === 0 && (
                            <Card className="p-12 text-center">
                                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-[#1F2937]">No applications found</h3>
                                <p className="text-slate-500">You haven't applied to any events in this category.</p>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
