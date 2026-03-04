import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Search, MoreVertical,
    Eye, Trash2, X, MapPin, Package,
    Building2, DollarSign, CheckCircle
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/dropdown-menu";
import { dummyEvents, dummySponsorshipRequests } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

// ─────────────────────────────────────────────
//  Shared localStorage helpers
//  Same key used by College, Sponsor pages
// ─────────────────────────────────────────────
const EVENTS_KEY = 'sponza_events';

function loadEvents() {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        const storedEvents = stored ? JSON.parse(stored) : [];
        // Merge: keep stored events + any dummyEvents not already present (by id)
        const storedIds = new Set(storedEvents.map(e => e.id));
        const merged = [
            ...storedEvents,
            ...dummyEvents.filter(e => !storedIds.has(e.id)),
        ];
        if (merged.length !== storedEvents.length) {
            localStorage.setItem(EVENTS_KEY, JSON.stringify(merged));
        }
        return merged;
    } catch {}
    localStorage.setItem(EVENTS_KEY, JSON.stringify(dummyEvents));
    return dummyEvents;
}

function saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// ── Event Detail Modal ──
function EventDetailModal({ event, onClose }) {
    if (!event) return null;

    const eventSponsors  = dummySponsorshipRequests.filter(r => r.eventId === event.id && r.status === 'approved');
    const pendingSponsors = dummySponsorshipRequests.filter(r => r.eventId === event.id && r.status === 'pending');
    const totalRaised    = eventSponsors.reduce((sum, s) => sum + s.amount, 0);

    const InfoRow = ({ icon, label, value }) => {
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">{icon}</div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-[#1F2937] font-medium mt-0.5">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="relative">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
                        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{event.title}</h2>
                                    <p className="text-blue-100 text-sm">{event.college}</p>
                                </div>
                                <Badge className={event.status === 'Ended' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>{event.status}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{event.description}</p>

                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Event Details</h3>
                        <div className="mb-6">
                            <InfoRow icon={<Package className="w-4 h-4 text-[#1E3A8A]" />} label="Category" value={event.category} />
                            <InfoRow icon={<MapPin className="w-4 h-4 text-[#1E3A8A]" />} label="Venue" value={event.location} />
                            <InfoRow icon={<Building2 className="w-4 h-4 text-[#1E3A8A]" />} label="College / Organizer" value={event.college} />
                            <InfoRow icon={<Calendar className="w-4 h-4 text-[#1E3A8A]" />} label="Event Date" value={event.date} />
                            <InfoRow icon={<Users className="w-4 h-4 text-[#1E3A8A]" />} label="Expected Attendees" value={event.expectedAttendees?.toLocaleString()} />
                            <InfoRow
                                icon={<DollarSign className="w-4 h-4 text-[#1E3A8A]" />}
                                label="Sponsorship Range"
                                value={event.minSponsorship && event.maxSponsorship
                                    ? `₹${event.minSponsorship.toLocaleString()} – ₹${event.maxSponsorship.toLocaleString()}`
                                    : null}
                            />
                        </div>

                        {event.packages?.length > 0 && (
                            <>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Sponsorship Packages</h3>
                                <div className="grid gap-2 mb-6">
                                    {event.packages.map((pkg, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-[#1F2937] text-sm">{pkg.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{pkg.benefits?.slice(0, 2).join(' • ')}</p>
                                            </div>
                                            <span className="font-bold text-[#22C55E] text-sm">₹{pkg.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Sponsorship Status</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-green-600">{eventSponsors.length}</p>
                                <p className="text-xs text-green-700 mt-0.5">Confirmed</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-yellow-600">{pendingSponsors.length}</p>
                                <p className="text-xs text-yellow-700 mt-0.5">Pending</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-[#1E3A8A]">₹{totalRaised.toLocaleString()}</p>
                                <p className="text-xs text-[#1E3A8A] mt-0.5">Raised</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end">
                            <Button variant="outline" onClick={onClose}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Main Component ──
export default function AdminEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ✅ Read from sponza_events (shared with College/Sponsor)
    const [events, setEvents] = useState(() => loadEvents());

    useEffect(() => {
        const adminUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
        if (!adminUnlocked) { navigate(createPageUrl('AdminPanel')); return; }
        const auth = localStorage.getItem('sponza_auth');
        setUser(auth ? JSON.parse(auth) : { id: 'admin-1', name: 'Admin', email: 'admin@sponza.com', role: 'admin' });
        setEvents(loadEvents());
    }, [navigate]);

    // ✅ Poll every second — picks up new events created by college in real time
    useEffect(() => {
        const interval = setInterval(() => {
            const fresh = loadEvents();
            setEvents(prev =>
                JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked');
        navigate(createPageUrl('Home'));
    };

    // ✅ Status change → persist to sponza_events
    const handleSetStatus = (eventId, newStatus) => {
        const updated = events.map(e => e.id === eventId ? { ...e, status: newStatus } : e);
        setEvents(updated);
        saveEvents(updated);
    };

    // ✅ Remove → persist to sponza_events
    const handleRemove = (eventId) => {
        const updated = events.filter(e => e.id !== eventId);
        setEvents(updated);
        saveEvents(updated);
    };

    const sidebarItems = [
        { label: 'Dashboard',     icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users',  icon: Users,           page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar,        page: 'AdminEvents' },
        { label: 'Sponsorships',  icon: FileText,        page: 'AdminSponsorships' },
        { label: 'Reports',       icon: BarChart3,       page: 'AdminReports' },
    ];

    const filteredEvents = events.filter(event => {
        const matchesSearch   = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Dynamic category list from actual events
    const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="admin" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="AdminPanel" />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Manage Events</h1>
                            <p className="text-slate-600 mt-1">Review and manage all platform events</p>
                        </div>

                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <p className="text-sm text-slate-500 mb-4">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span> of {events.length} events
                        </p>

                        <Card>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Sponsorship Range</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.map(event => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                                                        <div>
                                                            <p className="font-medium text-[#1F2937]">{event.title}</p>
                                                            <p className="text-sm text-slate-500">{event.expectedAttendees?.toLocaleString()} attendees</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{event.college}</TableCell>
                                                <TableCell><Badge variant="outline">{event.category}</Badge></TableCell>
                                                <TableCell className="text-slate-600">{event.date}</TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-[#22C55E]">
                                                        ₹{event.minSponsorship?.toLocaleString()} – ₹{event.maxSponsorship?.toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={event.status === 'Ended' ? 'bg-red-100 text-red-700' : event.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                                        {event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedEvent(event)}>
                                                                <Eye className="w-4 h-4 mr-2 text-slate-500" />View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer text-green-600" onClick={() => handleSetStatus(event.id, 'Open')} disabled={event.status === 'Open'}>
                                                                <CheckCircle className="w-4 h-4 mr-2" />Mark as Open
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer text-orange-600" onClick={() => handleSetStatus(event.id, 'Ended')} disabled={event.status === 'Ended'}>
                                                                <X className="w-4 h-4 mr-2" />Mark as Ended
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleRemove(event.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" />Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredEvents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                                    No events found matching your filters
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

            {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
}