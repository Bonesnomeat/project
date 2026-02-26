import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, SlidersHorizontal, MapPin, X
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

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export default function SponsorBrowseEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    // ── Filters ──
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedCity, setSelectedCity] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);

        // ✅ Auto-apply user's preferred states from Settings → Preferences
        if (parsed.selectedStates && parsed.selectedStates.length > 0) {
            setSelectedState(parsed.selectedStates[0]);
        }
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

    // ── Apply all filters ──
    const filteredEvents = dummyEvents.filter(event => {

        // Search — matches title, college, location
        const matchesSearch =
            !searchQuery ||
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase());

        // Category
        const matchesCategory =
            category === 'all' ||
            event.category?.toLowerCase() === category.toLowerCase();

        // State — checks event.location string
        const matchesState =
            selectedState === 'all' ||
            event.state?.toLowerCase() === selectedState.toLowerCase() ||
            event.location?.toLowerCase().includes(selectedState.toLowerCase());

        // City — checks event.location string
        const matchesCity =
            !selectedCity ||
            event.city?.toLowerCase().includes(selectedCity.toLowerCase()) ||
            event.location?.toLowerCase().includes(selectedCity.toLowerCase());

        // ✅ Budget — uses minSponsorship & maxSponsorship from dummyData
        // Shows event if sponsor's budget range overlaps with event's sponsorship range
        const matchesBudgetMin =
            !budgetMin ||
            (event.maxSponsorship && event.maxSponsorship >= Number(budgetMin));
        const matchesBudgetMax =
            !budgetMax ||
            (event.minSponsorship && event.minSponsorship <= Number(budgetMax));

        return matchesSearch && matchesCategory && matchesState && matchesCity && matchesBudgetMin && matchesBudgetMax;
    });

    // ── Active filters check ──
    const hasActiveFilters =
        searchQuery ||
        category !== 'all' ||
        selectedState !== 'all' ||
        selectedCity ||
        budgetMin ||
        budgetMax;

    // ── Clear all filters ──
    const clearAllFilters = () => {
        setSearchQuery('');
        setCategory('all');
        setSelectedState('all');
        setSelectedCity('');
        setBudgetMin('');
        setBudgetMax('');
    };

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

                        {/* ── Search + Filter Card ── */}
                        <Card className="p-4 mb-6">

                            {/* Top row */}
                            <div className="flex flex-col md:flex-row gap-4">

                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search events, colleges, locations..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Category dropdown */}
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* More Filters toggle */}
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={showFilters ? 'border-[#1E3A8A] text-[#1E3A8A]' : ''}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    More Filters
                                    {(selectedState !== 'all' || selectedCity || budgetMin || budgetMax) && (
                                        <span className="ml-2 w-5 h-5 bg-[#1E3A8A] text-white rounded-full text-xs flex items-center justify-center">
                                            {[selectedState !== 'all', !!selectedCity, !!(budgetMin || budgetMax)].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </div>

                            {/* ── Expanded filter panel ── */}
                            {showFilters && (
                                <div className="mt-4 pt-4 border-t">

                                    {/* Category pills */}
                                    <div className="mb-5">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Category</p>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <Badge
                                                    key={cat}
                                                    variant={category === cat.toLowerCase() ? 'default' : 'outline'}
                                                    className={`cursor-pointer transition-colors ${
                                                        category === cat.toLowerCase()
                                                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                            : 'hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                                                    }`}
                                                    onClick={() => setCategory(category === cat.toLowerCase() ? 'all' : cat.toLowerCase())}
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ✅ Location filters */}
                                    <div className="mb-5">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Location
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-3">

                                            {/* State dropdown */}
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">State</p>
                                                <Select value={selectedState} onValueChange={setSelectedState}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All States</SelectItem>
                                                        {indianStates.map(state => (
                                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* City search */}
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">City</p>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <Input
                                                        placeholder="Search city..."
                                                        value={selectedCity}
                                                        onChange={e => setSelectedCity(e.target.value)}
                                                        className="pl-9"
                                                    />
                                                    {selectedCity && (
                                                        <button
                                                            onClick={() => setSelectedCity('')}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ Budget range filter */}
                                    <div className="mb-4">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                                            Sponsorship Budget Range (₹)
                                        </p>
                                        <p className="text-xs text-slate-400 mb-2">
                                            Shows events where your budget overlaps with their sponsorship range
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Min Budget (₹)</p>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 5000"
                                                    value={budgetMin}
                                                    onChange={e => setBudgetMin(e.target.value)}
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Max Budget (₹)</p>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 50000"
                                                    value={budgetMax}
                                                    onChange={e => setBudgetMax(e.target.value)}
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        {/* ✅ Quick budget presets */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {[
                                                { label: 'Under ₹10K', min: '', max: '10000' },
                                                { label: '₹10K–₹25K', min: '10000', max: '25000' },
                                                { label: '₹25K–₹50K', min: '25000', max: '50000' },
                                                { label: '₹50K+', min: '50000', max: '' },
                                            ].map(preset => (
                                                <button
                                                    key={preset.label}
                                                    type="button"
                                                    onClick={() => { setBudgetMin(preset.min); setBudgetMax(preset.max); }}
                                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                                        budgetMin === preset.min && budgetMax === preset.max
                                                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                            : 'bg-white text-slate-600 border-slate-300 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                                                    }`}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clear all */}
                                    {hasActiveFilters && (
                                        <div className="flex justify-end pt-3 border-t">
                                            <Button
                                                variant="ghost"
                                                onClick={clearAllFilters}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* ── Active filter tags ── */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {searchQuery && (
                                    <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                        Search: "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {category !== 'all' && (
                                    <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                        Category: {category}
                                        <button onClick={() => setCategory('all')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {selectedState !== 'all' && (
                                    <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> State: {selectedState}
                                        <button onClick={() => setSelectedState('all')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {selectedCity && (
                                    <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> City: {selectedCity}
                                        <button onClick={() => setSelectedCity('')}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {(budgetMin || budgetMax) && (
                                    <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs flex items-center gap-1">
                                        Budget: ₹{budgetMin || '0'} – ₹{budgetMax || '∞'}
                                        <button onClick={() => { setBudgetMin(''); setBudgetMax(''); }}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                <button
                                    onClick={clearAllFilters}
                                    className="px-3 py-1 text-red-500 hover:text-red-600 text-xs underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Results count */}
                        <p className="text-slate-600 mb-6">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span>
                            {hasActiveFilters && ` of ${dummyEvents.length}`} events
                        </p>

                        {/* Event cards grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    showApplyButton
                                    onApply={handleApply}
                                />
                            ))}
                        </div>

                        {/* Empty state */}
                        {filteredEvents.length === 0 && (
                            <Card className="p-12 text-center">
                                <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-[#1F2937]">No events found</h3>
                                <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={clearAllFilters}>
                                        Clear All Filters
                                    </Button>
                                )}
                            </Card>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}