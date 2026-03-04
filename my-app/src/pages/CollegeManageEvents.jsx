import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, Search, Filter, MoreVertical,
    Edit, Trash2, Eye, Users, X, ChevronDown,
    MapPin, Clock, Package, Save, FileText as FileTextIcon
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/dropdown-menu";
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export const EVENTS_KEY = 'sponza_events';

// ─── FIXED loadEvents ────────────────────────────────────────────────────────
// Always merges stored events with dummyEvents, but stored version WINS for
// any event that exists in both (so edits are never overwritten by dummy data)
export function loadEvents() {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        const storedEvents = stored ? JSON.parse(stored) : [];
        const storedIds = new Set(storedEvents.map(e => String(e.id)));
        // Only add dummy events that are NOT already in stored (preserved edits)
        const merged = [
            ...storedEvents,
            ...dummyEvents.filter(e => !storedIds.has(String(e.id))),
        ];
        // Always persist the merged list so dummy events are saved too
        localStorage.setItem(EVENTS_KEY, JSON.stringify(merged));
        return merged;
    } catch {}
    localStorage.setItem(EVENTS_KEY, JSON.stringify(dummyEvents));
    return dummyEvents;
}

// ─── FIXED saveEvents ────────────────────────────────────────────────────────
// Saves the FULL list (including edited dummy events) directly to localStorage
export function saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

const ALL_CATEGORIES = [...new Set(dummyEvents.map(e => e.category))];
const ALL_STATUSES   = ['Open', 'Closed', 'Draft'];
const SPONSORSHIP_RANGES = [
    { label: 'Any',           min: 0,     max: Infinity },
    { label: 'Under ₹5,000',  min: 0,     max: 5000 },
    { label: '₹5k – ₹20k',   min: 5000,  max: 20000 },
    { label: '₹20k – ₹50k',  min: 20000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: Infinity },
];

// ─── View Details Modal ───────────────────────────────────────────────────────
function ViewDetailsModal({ event, onClose }) {
    if (!event) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="relative h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-t-2xl" />
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white text-[#1E3A8A]">{event.category}</Badge>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#1F2937]">{event.title}</h2>
                        <Badge className={
                            event.status === 'Open' ? 'bg-green-100 text-green-700' :
                            event.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                            'bg-yellow-100 text-yellow-700'
                        }>{event.status}</Badge>
                    </div>

                    <p className="text-slate-600 mb-6">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                            <div>
                                <p className="text-xs text-slate-400">Date</p>
                                <p className="text-sm font-medium">{event.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                            <div>
                                <p className="text-xs text-slate-400">Location</p>
                                <p className="text-sm font-medium">{event.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Users className="w-4 h-4 text-[#1E3A8A]" />
                            <div>
                                <p className="text-xs text-slate-400">Expected Attendees</p>
                                <p className="text-sm font-medium">{(event.expectedAttendees || 0).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Package className="w-4 h-4 text-[#1E3A8A]" />
                            <div>
                                <p className="text-xs text-slate-400">Sponsorship Range</p>
                                <p className="text-sm font-medium text-[#22C55E]">
                                    ₹{(event.minSponsorship || 0).toLocaleString()} – ₹{(event.maxSponsorship || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {event.college && (
                            <div className="flex items-center gap-2 text-slate-600 col-span-2">
                                <FileTextIcon className="w-4 h-4 text-[#1E3A8A]" />
                                <div>
                                    <p className="text-xs text-slate-400">Organized by</p>
                                    <p className="text-sm font-medium">{event.college}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {event.packages && event.packages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-[#1F2937] mb-3">Sponsorship Packages</h3>
                            <div className="space-y-3">
                                {event.packages.map((pkg, i) => (
                                    <div key={i} className="border border-slate-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-[#1F2937]">{pkg.name}</span>
                                            <span className="text-lg font-bold text-[#22C55E]">₹{(pkg.price || 0).toLocaleString()}</span>
                                        </div>
                                        {pkg.benefits && pkg.benefits.length > 0 && (
                                            <ul className="space-y-1">
                                                {pkg.benefits.filter(Boolean).map((b, j) => (
                                                    <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] flex-shrink-0" />{b}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}

// ─── Edit Event Modal ─────────────────────────────────────────────────────────
function EditEventModal({ event, onClose, onSave }) {
    if (!event) return null;

    const [form, setForm] = useState({
        title:             event.title || '',
        description:       event.description || '',
        category:          event.category || '',
        date:              event.date || '',
        location:          event.location || '',
        expectedAttendees: event.expectedAttendees || '',
        minSponsorship:    event.minSponsorship || '',
        maxSponsorship:    event.maxSponsorship || '',
        status:            event.status || 'Open',
    });
    const [packages, setPackages] = useState(
        event.packages?.length
            ? event.packages.map(p => ({ ...p, benefits: [...(p.benefits || [])] }))
            : []
    );

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
    const handlePkgChange = (i, field, val) => { const u = [...packages]; u[i][field] = val; setPackages(u); };
    const handleBenefitChange = (pi, bi, val) => { const u = [...packages]; u[pi].benefits[bi] = val; setPackages(u); };
    const addBenefit    = (pi) => { const u = [...packages]; u[pi].benefits.push(''); setPackages(u); };
    const removeBenefit = (pi, bi) => { const u = [...packages]; u[pi].benefits.splice(bi, 1); setPackages(u); };
    const addPackage    = () => setPackages([...packages, { name: '', price: '', benefits: [''] }]);
    const removePackage = (i) => setPackages(packages.filter((_, idx) => idx !== i));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...event,                                          // keep ALL original fields (image, id, createdBy, etc.)
            ...form,                                           // overwrite with edited fields
            expectedAttendees: Number(form.expectedAttendees) || 0,
            minSponsorship:    Number(form.minSponsorship) || 0,
            maxSponsorship:    Number(form.maxSponsorship) || 0,
            packages,
        });
    };

    const categories = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Hackathon', 'Seminar'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-[#1F2937]">Edit Event</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <Label>Event Title *</Label>
                        <Input value={form.title} onChange={e => set('title', e.target.value)} className="mt-1" required />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={form.description} onChange={e => set('description', e.target.value)} className="mt-1 min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Category</Label>
                            <Select value={form.category} onValueChange={v => set('category', v)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={v => set('status', v)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input value={form.date} onChange={e => set('date', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label>Expected Attendees</Label>
                            <Input type="number" value={form.expectedAttendees} onChange={e => set('expectedAttendees', e.target.value)} className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input value={form.location} onChange={e => set('location', e.target.value)} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Min Sponsorship (₹)</Label>
                            <Input type="number" value={form.minSponsorship} onChange={e => set('minSponsorship', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label>Max Sponsorship (₹)</Label>
                            <Input type="number" value={form.maxSponsorship} onChange={e => set('maxSponsorship', e.target.value)} className="mt-1" />
                        </div>
                    </div>

                    {/* Packages */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label className="text-base font-semibold">Sponsorship Packages</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addPackage}>+ Add Package</Button>
                        </div>
                        {packages.map((pkg, pi) => (
                            <div key={pi} className="border border-slate-200 rounded-xl p-4 mb-3 bg-slate-50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-[#1E3A8A]">Package {pi + 1}</span>
                                    <button type="button" onClick={() => removePackage(pi)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <Label>Name</Label>
                                        <Input placeholder="e.g. Platinum" value={pkg.name} onChange={e => handlePkgChange(pi, 'name', e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label>Price (₹)</Label>
                                        <Input type="number" placeholder="e.g. 50000" value={pkg.price} onChange={e => handlePkgChange(pi, 'price', e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                                <Label>Benefits</Label>
                                {pkg.benefits.map((b, bi) => (
                                    <div key={bi} className="flex gap-2 mt-2">
                                        <Input placeholder="e.g. Logo on banner" value={b} onChange={e => handleBenefitChange(pi, bi, e.target.value)} />
                                        {pkg.benefits.length > 1 && (
                                            <button type="button" onClick={() => removeBenefit(pi, bi)}>
                                                <X className="w-4 h-4 text-red-400" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addBenefit(pi)} className="mt-2 text-xs text-[#1E3A8A] hover:underline">+ Add Benefit</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 justify-end pt-2 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#22C55E] hover:bg-[#22C55E]/90">
                            <Save className="w-4 h-4 mr-2" />Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CollegeManageEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const [events, setEvents] = useState(() => loadEvents());
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatuses,   setSelectedStatuses]   = useState([]);
    const [selectedRange,      setSelectedRange]      = useState(SPONSORSHIP_RANGES[0]);
    const [viewEvent, setViewEvent] = useState(null);
    const [editEvent, setEditEvent] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
        setEvents(loadEvents());
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const fresh = loadEvents();
            setEvents(prev => JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const handleDelete = (eventId) => {
        const updated = events.filter(e => String(e.id) !== String(eventId));
        setEvents(updated);
        saveEvents(updated);
    };

    const handleStatusChange = (eventId, newStatus) => {
        const updated = events.map(e => String(e.id) === String(eventId) ? { ...e, status: newStatus } : e);
        setEvents(updated);
        saveEvents(updated);
    };

    // ─── FIXED handleSaveEdit ─────────────────────────────────────────────────
    // Updates the event in the current list, then saves the ENTIRE list to
    // localStorage so every other page (BrowseEvents, Dashboard) sees the change
    const handleSaveEdit = (updatedEvent) => {
        const updated = events.map(e =>
            String(e.id) === String(updatedEvent.id) ? updatedEvent : e
        );
        setEvents(updated);
        saveEvents(updated);   // writes full list including edited dummy events
        setEditEvent(null);
    };

    const toggle = (item, list, setList) =>
        setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedStatuses([]);
        setSelectedRange(SPONSORSHIP_RANGES[0]);
    };

    const activeFilterCount = selectedCategories.length + selectedStatuses.length +
        (selectedRange.label !== 'Any' ? 1 : 0);

    const filteredEvents = events.filter(event => {
        const matchesSearch   = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
        const matchesStatus   = selectedStatuses.length === 0   || selectedStatuses.includes(event.status);
        const matchesRange    = (event.minSponsorship || 0) >= selectedRange.min &&
                                (event.minSponsorship || 0) <= selectedRange.max;
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
        Open:   'bg-green-100 text-green-700',
        Closed: 'bg-slate-100 text-slate-700',
        Draft:  'bg-yellow-100 text-yellow-700',
        Ended:  'bg-red-100 text-red-700',
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {viewEvent && <ViewDetailsModal event={viewEvent} onClose={() => setViewEvent(null)} />}
            {editEvent && <EditEventModal event={editEvent} onClose={() => setEditEvent(null)} onSave={handleSaveEdit} />}

            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="college" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="CollegeSettings" />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Manage Events</h1>
                                <p className="text-slate-600 mt-1">View and manage all your events</p>
                            </div>
                            <Link to={createPageUrl('CollegeCreateEvent')}>
                                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                    <PlusCircle className="w-5 h-5 mr-2" />Create Event
                                </Button>
                            </Link>
                        </div>

                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                                </div>

                                <div className="relative" ref={filterRef}>
                                    <Button variant="outline" onClick={() => setShowFilter(p => !p)} className={activeFilterCount > 0 ? 'border-[#1E3A8A] text-[#1E3A8A]' : ''}>
                                        <Filter className="w-4 h-4 mr-2" />Filters
                                        {activeFilterCount > 0 && (
                                            <span className="ml-2 w-5 h-5 rounded-full bg-[#1E3A8A] text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
                                        )}
                                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
                                    </Button>

                                    {showFilter && (
                                        <div className="absolute right-0 top-12 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-[#1F2937]">Filters</h3>
                                                <div className="flex items-center gap-2">
                                                    {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-red-500 font-medium">Clear all</button>}
                                                    <button onClick={() => setShowFilter(false)}><X className="w-4 h-4 text-slate-400" /></button>
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ALL_CATEGORIES.map(cat => (
                                                        <button key={cat} onClick={() => toggle(cat, selectedCategories, setSelectedCategories)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${selectedCategories.includes(cat) ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1E3A8A]'}`}>
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ALL_STATUSES.map(status => (
                                                        <button key={status} onClick={() => toggle(status, selectedStatuses, setSelectedStatuses)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${selectedStatuses.includes(status) ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1E3A8A]'}`}>
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Sponsorship Range</p>
                                                <div className="flex flex-col gap-1">
                                                    {SPONSORSHIP_RANGES.map(range => (
                                                        <button key={range.label} onClick={() => setSelectedRange(range)}
                                                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRange.label === range.label ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                            {range.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-5 pt-4 border-t">
                                                <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={() => setShowFilter(false)}>
                                                    Apply Filters{activeFilterCount > 0 && ` (${filteredEvents.length} results)`}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {activeFilterCount > 0 && (
                                <div className="px-4 pb-3 flex flex-wrap gap-2">
                                    {selectedCategories.map(cat => (
                                        <span key={cat} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                            {cat} <button onClick={() => toggle(cat, selectedCategories, setSelectedCategories)}><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    {selectedStatuses.map(s => (
                                        <span key={s} className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100">
                                            {s} <button onClick={() => toggle(s, selectedStatuses, setSelectedStatuses)}><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    {selectedRange.label !== 'Any' && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                                            {selectedRange.label} <button onClick={() => setSelectedRange(SPONSORSHIP_RANGES[0])}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </Card>

                        <p className="text-sm text-slate-500 mb-3">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span> of {events.length} events
                        </p>

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
                                        {filteredEvents.length > 0 ? filteredEvents.map(event => (
                                            <TableRow key={event.id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                                                        <div>
                                                            <p className="font-semibold text-[#1F2937]">{event.title}</p>
                                                            <p className="text-sm text-slate-500">{event.location}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{event.date}</TableCell>
                                                <TableCell><Badge variant="outline">{event.category}</Badge></TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-slate-600">
                                                        <Users className="w-4 h-4" />{(event.expectedAttendees || 0).toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-[#22C55E]">
                                                        ₹{(event.minSponsorship || 0).toLocaleString()} – ₹{(event.maxSponsorship || 0).toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[event.status] || 'bg-slate-100 text-slate-700'}>{event.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setViewEvent(event)}>
                                                                <Eye className="w-4 h-4 mr-2" />View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setEditEvent(event)}>
                                                                <Edit className="w-4 h-4 mr-2" />Edit Event
                                                            </DropdownMenuItem>
                                                            {event.status !== 'Open' && (
                                                                <DropdownMenuItem className="text-green-600" onClick={() => handleStatusChange(event.id, 'Open')}>Mark as Open</DropdownMenuItem>
                                                            )}
                                                            {event.status !== 'Closed' && (
                                                                <DropdownMenuItem className="text-slate-600" onClick={() => handleStatusChange(event.id, 'Closed')}>Mark as Closed</DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(event.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" />Delete
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
                                                    <button onClick={clearFilters} className="text-sm text-[#1E3A8A] mt-1 hover:underline">Clear filters</button>
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