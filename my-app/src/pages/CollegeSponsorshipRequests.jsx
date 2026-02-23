import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, Search, CheckCircle, XCircle, Clock, Mail
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";
import { dummySponsorshipRequests } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function CollegeSponsorshipRequests() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [requests, setRequests] = useState(dummySponsorshipRequests);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) {
            navigate(createPageUrl('SignIn'));
            return;
        }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') {
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
        { label: 'Dashboard', icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event', icon: PlusCircle, page: 'CollegeCreateEvent' },
        { label: 'Manage Events', icon: Calendar, page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText, page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records', icon: CreditCard, page: 'CollegePayments' },
        { label: 'Profile Settings', icon: Settings, page: 'CollegeSettings' },
    ];

    const handleApprove = (id) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    };

    const handleReject = (id) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    };

    const filteredRequests = activeTab === 'all' 
        ? requests 
        : requests.filter(r => r.status === activeTab);

    const statusConfig = {
        pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
        approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Approved' },
        rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar 
                items={sidebarItems} 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed}
                userRole="college"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader 
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="CollegeSettings"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Sponsorship Requests</h1>
                            <p className="text-slate-600 mt-1">Review and manage sponsorship applications</p>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList>
                                <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
                                <TabsTrigger value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
                                <TabsTrigger value="approved">Approved ({requests.filter(r => r.status === 'approved').length})</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected ({requests.filter(r => r.status === 'rejected').length})</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="space-y-4">
                            {filteredRequests.map((request) => {
                                const status = statusConfig[request.status];
                                return (
                                    <Card key={request.id} className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <img 
                                                    src={request.sponsorLogo} 
                                                    alt={request.sponsor}
                                                    className="w-16 h-16 rounded-xl object-cover"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-semibold text-[#1F2937]">{request.sponsor}</h3>
                                                        <Badge className={status.color}>
                                                            <status.icon className="w-3 h-3 mr-1" />
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-slate-600">
                                                        <span className="font-medium">{request.eventTitle}</span>
                                                        {' • '}
                                                        <span className="text-[#1E3A8A]">{request.package} Package</span>
                                                    </p>
                                                    <p className="text-sm text-slate-500 mt-2">{request.message}</p>
                                                    <p className="text-sm text-slate-400 mt-2">Applied on {request.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-slate-500">Sponsorship Amount</p>
                                                    <p className="text-2xl font-bold text-[#22C55E]">
                                                        ${request.amount.toLocaleString()}
                                                    </p>
                                                </div>

                                                {request.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={() => handleReject(request.id)}
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleApprove(request.id)}
                                                            className="bg-[#22C55E] hover:bg-[#22C55E]/90"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                )}

                                                {request.status !== 'pending' && (
                                                    <Button variant="outline">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Contact Sponsor
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}

                            {filteredRequests.length === 0 && (
                                <Card className="p-12 text-center">
                                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-[#1F2937]">No requests found</h3>
                                    <p className="text-slate-500">There are no sponsorship requests in this category.</p>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
