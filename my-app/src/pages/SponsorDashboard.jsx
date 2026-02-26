import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, TrendingUp, DollarSign, Target, Award, Sparkles
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

    // ── Preferences from SponsorSettings ──
    const [preferences, setPreferences] = useState({
        selectedCategories: [],
        selectedStates: [],
        budgetRange: '',
    });

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);

        // ✅ Load preferences saved from SponsorSettings → Preferences tab
        setPreferences({
            selectedCategories: parsed.selectedCategories || [],
            selectedStates:     parsed.selectedStates     || [],
            budgetRange:        parsed.budgetRange        || '',
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    // ✅ Parse budget range string → min and max numbers
    // budgetRange examples: '₹10,000 – ₹50,000', '₹50,000 – ₹2,00,000', '₹10,00,000+'
    const parseBudgetRange = (rangeStr) => {
        if (!rangeStr) return { min: 0, max: Infinity };
        // Remove ₹, commas, spaces
        const cleaned = rangeStr.replace(/₹|,|\s/g, '');
        if (cleaned.includes('+')) {
            const min = Number(cleaned.replace('+', '').split('–')[0]);
            return { min, max: Infinity };
        }
        const parts = cleaned.split('–');
        return {
            min: Number(parts[0]) || 0,
            max: Number(parts[1]) || Infinity,
        };
    };

    // ✅ Score each event based on how well it matches user preferences
    // Higher score = better match = shown first
    const getRecommendedEvents = () => {
        const { selectedCategories, selectedStates, budgetRange } = preferences;
        const { min: budgetMin, max: budgetMax } = parseBudgetRange(budgetRange);

        const hasPreferences =
            selectedCategories.length > 0 ||
            selectedStates.length > 0 ||
            budgetRange;

        // If no preferences set — return first 4 events as default
        if (!hasPreferences) return dummyEvents.slice(0, 4);

        const scored = dummyEvents.map(event => {
            let score = 0;
            const reasons = [];

            // +3 points if category matches
            if (
                selectedCategories.length > 0 &&
                selectedCategories.some(cat =>
                    event.category?.toLowerCase() === cat.toLowerCase()
                )
            ) {
                score += 3;
                reasons.push(`Matches your interest in ${event.category}`);
            }

            // +2 points if state/location matches
            if (
                selectedStates.length > 0 &&
                selectedStates.some(state =>
                    event.location?.toLowerCase().includes(state.toLowerCase())
                )
            ) {
                score += 2;
                reasons.push('In your preferred location');
            }

            // +2 points if budget overlaps with event's sponsorship range
            if (budgetRange) {
                const eventMin = event.minSponsorship || 0;
                const eventMax = event.maxSponsorship || Infinity;
                const budgetOverlaps = budgetMin <= eventMax && budgetMax >= eventMin;
                if (budgetOverlaps) {
                    score += 2;
                    reasons.push('Within your budget range');
                }
            }

            return { ...event, score, reasons };
        });

        // Sort by score descending, return top 4
        return scored
            .filter(e => e.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);
    };

    const recommendedEvents = getRecommendedEvents();
    const hasPreferences =
        preferences.selectedCategories.length > 0 ||
        preferences.selectedStates.length > 0 ||
        preferences.budgetRange;

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events', icon: Search, page: 'SponsorBrowseEvents' },
        { label: 'My Applications', icon: Calendar, page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History, page: 'SponsorHistory' },
        { label: 'Profile Settings', icon: Settings, page: 'SponsorSettings' },
    ];

    const stats = [
        { title: 'Active Sponsorships', value: '3', change: '+1', trend: 'up', icon: Target, iconBg: 'bg-blue-100' },
        { title: 'Total Invested', value: '₹85K', change: '+20%', trend: 'up', icon: DollarSign, iconBg: 'bg-green-100' },
        { title: 'Events Reached', value: '12K', icon: TrendingUp, iconBg: 'bg-orange-100' },
        { title: 'Brand Exposure', value: '500K', icon: Award, iconBg: 'bg-purple-100' },
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

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <StatsCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* ── Recommended Events ── */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                            {hasPreferences ? (
                                                <>
                                                    <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                                                    Recommended For You
                                                </>
                                            ) : (
                                                'Recommended Events'
                                            )}
                                        </h2>

                                        {/* ✅ Show active preference tags */}
                                        {hasPreferences && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {preferences.selectedCategories.slice(0, 3).map(cat => (
                                                    <span key={cat} className="px-2 py-0.5 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs">
                                                        {cat}
                                                    </span>
                                                ))}
                                                {preferences.selectedStates.slice(0, 2).map(state => (
                                                    <span key={state} className="px-2 py-0.5 bg-[#22C55E]/10 text-[#16a34a] rounded-full text-xs">
                                                        📍 {state}
                                                    </span>
                                                ))}
                                                {preferences.budgetRange && (
                                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs">
                                                        💰 {preferences.budgetRange}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Link to={createPageUrl('SponsorBrowseEvents')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>

                                {/* ✅ No preferences set — prompt to set them */}
                                {!hasPreferences && (
                                    <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                                            <p className="text-sm text-[#1E3A8A]">
                                                Set your preferences to get personalized recommendations
                                            </p>
                                        </div>
                                        <Link to={createPageUrl('SponsorSettings')}>
                                            <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-xs">
                                                Set Preferences
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* ✅ No matched events */}
                                {hasPreferences && recommendedEvents.length === 0 && (
                                    <div className="mb-4 px-4 py-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-500 font-medium">No events match your current preferences</p>
                                        <p className="text-slate-400 text-sm mt-1 mb-3">Try updating your preferences or browse all events</p>
                                        <div className="flex justify-center gap-3">
                                            <Link to={createPageUrl('SponsorSettings')}>
                                                <Button variant="outline" size="sm">Update Preferences</Button>
                                            </Link>
                                            <Link to={createPageUrl('SponsorBrowseEvents')}>
                                                <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Browse All</Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Event cards grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {recommendedEvents.map(event => (
                                        <div key={event.id} className="relative">
                                            <EventCard event={event} />

                                            {/* ✅ Match reason badge */}
                                            {event.reasons && event.reasons.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {event.reasons.map((reason, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-0.5 bg-[#1E3A8A]/8 text-[#1E3A8A] border border-[#1E3A8A]/20 rounded-full text-xs"
                                                        >
                                                            ✓ {reason}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Recent Activity ── */}
                            <div>
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-[#1F2937] mb-6">Recent Activity</h2>
                                    <div className="space-y-4">
                                        {dummySponsorshipHistory.map(item => (
                                            <div key={item.id} className="p-4 bg-slate-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-[#1F2937] text-sm">{item.eventTitle}</h3>
                                                    <Badge className={
                                                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'active'    ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-500">{item.college}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-slate-400">{item.date}</span>
                                                    <span className="font-semibold text-[#22C55E]">₹{item.amount.toLocaleString()}</span>
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