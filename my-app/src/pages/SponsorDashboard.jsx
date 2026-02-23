import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, TrendingUp, DollarSign, Target, Award
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from 'C:/Users/USER/sponza/project/my-app/src/components/shared/Sidebar';
import DashboardHeader from 'C:/Users/USER/sponza/project/my-app/src/components/shared/DashboardHeader';
import StatsCard from 'C:/Users/USER/sponza/project/my-app/src/components/shared/StatsCard';
import EventCard from 'C:/Users/USER/sponza/project/my-app/src/components/shared/EventCard';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { dummyEvents, dummySponsorshipHistory } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function SponsorDashboard() {
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

    const stats = [
        { title: 'Active Sponsorships', value: '3', change: '+1', trend: 'up', icon: Target, iconBg: 'bg-blue-100' },
        { title: 'Total Invested', value: '$85K', change: '+20%', trend: 'up', icon: DollarSign, iconBg: 'bg-green-100' },
        { title: 'Events Reached', value: '12K', icon: TrendingUp, iconBg: 'bg-orange-100' },
        { title: 'Brand Exposure', value: '500K', icon: Award, iconBg: 'bg-purple-100' },
    ];

    const recommendedEvents = dummyEvents.slice(0, 3);

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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <StatsCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recommended Events</h2>
                                    <Link to={createPageUrl('SponsorBrowseEvents')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {recommendedEvents.slice(0, 2).map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-[#1F2937] mb-6">Recent Activity</h2>
                                    <div className="space-y-4">
                                        {dummySponsorshipHistory.map((item) => (
                                            <div key={item.id} className="p-4 bg-slate-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-[#1F2937] text-sm">{item.eventTitle}</h3>
                                                    <Badge className={
                                                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-500">{item.college}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-slate-400">{item.date}</span>
                                                    <span className="font-semibold text-[#22C55E]">${item.amount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to={createPageUrl('SponsorHistory')}>
                                        <Button variant="outline" className="w-full mt-4">
                                            View All History
                                        </Button>
                                    </Link>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
