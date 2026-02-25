import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, Search, Filter, MoreVertical,
    Edit, Trash2, Eye, Users, X, ChevronDown
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/dropdown-menu";
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

const ALL_CATEGORIES   = [...new Set(dummyEvents.map(e => e.category))];
const ALL_STATUSES     = ['Open', 'Closed', 'Draft'];
const SPONSORSHIP_RANGES = [
    { label: 'Any',            min: 0,      max: Infinity },
    { label: 'Under $5,000',   min: 0,      max: 5000 },
    { label: '$5k – $20k',     min: 5000,   max: 20000 },
    { label: '$20k – $50k',    min: 20000,  max: 50000 },
    { label: 'Above $50,000',  min: 50000,  max: Infinity },
];

export default function CollegeManageEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);

    // ── Filter state ──
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatuses,   setSelectedStatuses]   = useState([]);
    const [selectedRange,      setSelectedRange]      = useState(SPONSORSHIP_RANGES[0]);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
    }, [navigate]);

    // Close filter panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const toggle = (item, list, setList) => {
        setList(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedStatuses([]);
        setSelectedRange(SPONSORSHIP_RANGES[0]);
    };

    const activeFilterCount = selectedCategories.length + selectedStatuses.length +
        (selectedRange.label !== 'Any' ? 1 : 0);

    // ── Apply all filters ──
    const filteredEvents = dummyEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
        const matchesStatus   = selectedStatuses.length === 0   || selectedStatuses.includes(event.status);
        const matchesRange    = event.minSponsorship >= selectedRange.min && event.minSponsorship <= selectedRange.max;
        return matchesSearch && matchesCategory && matchesStatus && matchesRange;
    });

    const sidebarItems = [
        { label: 'Dashboard',           icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event',         icon: PlusCircle,      page: 'CollegeCreateEvent' },
        { label: 'Manage Events',        icon: Calendar,        page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText,        page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records',      icon: CreditCard,      page: 'CollegePayments' },
        { label: 'Profile Settings',     icon: Settings,        page: 'CollegeSettings' },
    ];

    const statusColors = {
        'Open':   'bg-green-100 text-green-700',
        'Closed': 'bg-slate-100 text-slate-700',
        'Draft':  'bg-yellow-100 text-yellow-700',
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

                        {/* ── Page Header ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Manage Events</h1>
                                <p className="text-slate-600 mt-1">View and manage all your events</p>
                            </div>
                            <Link to={createPageUrl('CollegeCreateEvent')}>
                                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Create Event
                                </Button>
                            </Link>
                        </div>

                        {/* ── Search + Filter Bar ── */}
                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Filter Button + Panel */}
                                <div className="relative" ref={filterRef}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilter(prev => !prev)}
                                        className={activeFilterCount > 0 ? 'border-[#1E3A8A] text-[#1E3A8A]' : ''}
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filters
                                        {activeFilterCount > 0 && (
                                            <span className="ml-2 w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-xs flex items-center justify-center">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
                                    </Button>

                                    {/* ── Filter Dropdown Panel ── */}
                                    {showFilter && (
                                        <div className="absolute right-0 top-12 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-5">

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-[#1F2937]">Filters</h3>
                                                <div className="flex items-center gap-2">
                                                    {activeFilterCount > 0 && (
                                                        <button
                                                            onClick={clearFilters}
                                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                        >
                                                            Clear all
                                                        </button>
                                                    )}
                                                    <button onClick={() => setShowFilter(false)}>
                                                        <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div className="mb-5">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ALL_CATEGORIES.map(cat => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => toggle(cat, selectedCategories, setSelectedCategories)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                                                selectedCategories.includes(cat)
                                                                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#1E3A8A]'
                                                            }`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="mb-5">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ALL_STATUSES.map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => toggle(status, selectedStatuses, setSelectedStatuses)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                                                selectedStatuses.includes(status)
                                                                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#1E3A8A]'
                                                            }`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sponsorship Range */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Sponsorship Range</p>
                                                <div className="flex flex-col gap-1">
                                                    {SPONSORSHIP_RANGES.map(range => (
                                                        <button
                                                            key={range.label}
                                                            onClick={() => setSelectedRange(range)}
                                                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                                selectedRange.label === range.label
                                                                    ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold'
                                                                    : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {range.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Apply Button */}
                                            <div className="mt-5 pt-4 border-t">
                                                <Button
                                                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                                                    onClick={() => setShowFilter(false)}
                                                >
                                                    Apply Filters
                                                    {activeFilterCount > 0 && ` (${filteredEvents.length} results)`}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Active Filter Tags ── */}
                            {activeFilterCount > 0 && (
                                <div className="px-4 pb-3 flex flex-wrap gap-2">
                                    {selectedCategories.map(cat => (
                                        <span key={cat} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
                                            {cat}
                                            <button onClick={() => toggle(cat, selectedCategories, setSelectedCategories)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {selectedStatuses.map(s => (
                                        <span key={s} className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium border border-purple-100">
                                            {s}
                                            <button onClick={() => toggle(s, selectedStatuses, setSelectedStatuses)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {selectedRange.label !== 'Any' && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-100">
                                            {selectedRange.label}
                                            <button onClick={() => setSelectedRange(SPONSORSHIP_RANGES[0])}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* ── Results Count ── */}
                        <p className="text-sm text-slate-500 mb-3">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span> of {dummyEvents.length} events
                        </p>

                        {/* ── Table ── */}
                        <Card>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Attendees</TableHead>
                                            <TableHead>Sponsorship</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                                            <TableRow key={event.id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-[#1F2937]">{event.title}</p>
                                                            <p className="text-sm text-slate-500">{event.location}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{event.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{event.category}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-slate-600">
                                                        <Users className="w-4 h-4" />
                                                        {event.expectedAttendees.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-[#22C55E]">
                                                        ${event.minSponsorship.toLocaleString()} – ${event.maxSponsorship.toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[event.status]}>
                                                        {event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="w-4 h-4 mr-2" /> Edit Event
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                                    <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                    <p className="font-medium">No events match your filters</p>
                                                    <button onClick={clearFilters} className="text-sm text-[#1E3A8A] mt-1 hover:underline">
                                                        Clear filters
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )}
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