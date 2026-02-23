import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, Filter, SlidersHorizontal
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import EventCard from '../components/shared/EventCard';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function SponsorBrowseEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

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

    const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Conference'];

    const filteredEvents = dummyEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category === 'all' || event.category === category;
        return matchesSearch && matchesCategory;
    });

    const handleApply = (event) => {
        navigate(createPageUrl('SponsorApply') + `?eventId=${event.id}`);
    };

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
                            <h1 className="text-3xl font-bold text-[#1F2937]">Browse Events</h1>
                            <p className="text-slate-600 mt-1">Discover sponsorship opportunities</p>
                        </div>

                        <Card className="p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    More Filters
                                </Button>
                            </div>

                            {showFilters && (
                                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                    {categories.slice(1).map(cat => (
                                        <Badge 
                                            key={cat}
                                            variant={category === cat.toLowerCase() ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => setCategory(category === cat.toLowerCase() ? 'all' : cat.toLowerCase())}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Card>

                        <p className="text-slate-600 mb-6">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span> events
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard 
                                    key={event.id} 
                                    event={event}
                                    showApplyButton
                                    onApply={handleApply}
                                />
                            ))}
                        </div>

                        {filteredEvents.length === 0 && (
                            <Card className="p-12 text-center">
                                <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-[#1F2937]">No events found</h3>
                                <p className="text-slate-500">Try adjusting your filters</p>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
