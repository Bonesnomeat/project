import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, Clock, CheckCircle, XCircle, Eye, CreditCard,
    MapPin, Users, Tag, Building2, CalendarDays, DollarSign,
    Package, X, Star, Smartphone, BadgeCheck
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";

const APPLICATIONS_KEY = 'sponza_applications';
const EVENTS_KEY = 'sponza_events';

// ── FIXED: Never seeds/overwrites. Just reads what's there. ──
function loadApplications() {
    try {
        const raw = localStorage.getItem(APPLICATIONS_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function loadEvents() {
    try { const r = localStorage.getItem(EVENTS_KEY); if (r) return JSON.parse(r); } catch {}
    return [];
}

// ── Event Detail Modal ──
function EventDetailModal({ app, onClose }) {
    if (!app) return null;

    const events = loadEvents();
    const event  = events.find(e => String(e.id) === String(app.eventId) || e.title === app.eventTitle) || {};

    const statusColors = {
        Open:   'bg-green-100 text-green-700',
        Closed: 'bg-slate-100 text-slate-700',
        Draft:  'bg-yellow-100 text-yellow-700',
        Ended:  'bg-red-100 text-red-700',
    };

    const appStatusColors = {
        pending:  'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const Row = ({ icon: Icon, label, value }) => {
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-[#1F2937] font-semibold mt-0.5">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                    <div className="relative">
                        <img
                            src={app.image || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=300&fit=crop'}
                            alt={app.eventTitle}
                            className="w-full h-52 object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl" />
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-end justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-bold text-white leading-tight">{app.eventTitle}</h2>
                                    <p className="text-blue-200 text-sm mt-0.5">{app.college}</p>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    {event.status && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[event.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {event.status}
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${appStatusColors[app.status] || 'bg-yellow-100 text-yellow-700'}`}>
                                        Application: {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {(event.description || app.description) && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">About This Event</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{event.description || app.description}</p>
                            </div>
                        )}

                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Event Details</p>
                        <div className="mb-5">
                            <Row icon={Building2}    label="Organizer / College"  value={event.college || app.college} />
                            <Row icon={CalendarDays} label="Event Date"           value={app.eventDate || event.date} />
                            <Row icon={MapPin}       label="Location / Venue"     value={event.location} />
                            <Row icon={Tag}          label="Category"             value={event.category || app.category} />
                            <Row icon={Users}        label="Expected Attendees"   value={event.expectedAttendees ? event.expectedAttendees.toLocaleString() : null} />
                            <Row icon={DollarSign}   label="Sponsorship Range"
                                value={event.minSponsorship && event.maxSponsorship
                                    ? `₹${event.minSponsorship.toLocaleString()} – ₹${event.maxSponsorship.toLocaleString()}`
                                    : null}
                            />
                        </div>

                        {event.packages?.length > 0 && (
                            <>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Sponsorship Packages</p>
                                <div className="grid gap-2 mb-5">
                                    {event.packages.map((pkg, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                app.package === pkg.name
                                                    ? 'border-[#1E3A8A] bg-blue-50'
                                                    : 'border-slate-100 bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {app.package === pkg.name && <BadgeCheck className="w-4 h-4 text-[#1E3A8A]" />}
                                                <div>
                                                    <p className="font-semibold text-[#1F2937] text-sm">{pkg.name}</p>
                                                    {pkg.benefits?.length > 0 && (
                                                        <p className="text-xs text-slate-500 mt-0.5">{pkg.benefits.slice(0, 2).join(' • ')}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-[#22C55E] text-sm">₹{Number(pkg.price)?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">My Application</p>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400">Package Applied</p>
                                <p className="font-semibold text-[#1F2937] mt-0.5">{app.package}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400">Amount</p>
                                <p className="font-bold text-[#22C55E] mt-0.5">₹{app.amount?.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400">Applied On</p>
                                <p className="font-semibold text-[#1F2937] mt-0.5">{app.appliedDate}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400">Application Status</p>
                                <p className={`font-semibold mt-0.5 capitalize ${
                                    app.status === 'approved' ? 'text-green-600' :
                                    app.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'
                                }`}>{app.status}</p>
                            </div>
                            {app.message && (
                                <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                                    <p className="text-xs text-slate-400">Your Message</p>
                                    <p className="text-sm text-[#1F2937] mt-0.5">{app.message}</p>
                                </div>
                            )}
                        </div>

                        {app.paymentDetails && (
                            <>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Payment History</p>
                                <div className="mb-5 space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                                        <div>
                                            <p className="text-xs text-slate-400">Paid Amount</p>
                                            <p className="font-bold text-[#22C55E] text-lg">
                                                ₹{app.paymentDetails.payableNow?.toLocaleString() || app.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Payment Date</p>
                                            <p className="font-semibold text-[#1F2937] text-sm">
                                                {app.paymentDetails.submittedAt
                                                    ? new Date(app.paymentDetails.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {app.status === 'rejected' && app.rejectionReason && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-5">
                                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Reason for Rejection</p>
                                <p className="text-sm text-red-700">{app.rejectionReason}</p>
                            </div>
                        )}

                        <div className="pt-4 border-t flex justify-end">
                            <button onClick={onClose} className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function SponsorApplications() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
        setApplications(loadApplications());
    }, [navigate]);

    // Poll every second to pick up new applications and college approval changes
    useEffect(() => {
        const interval = setInterval(() => {
            const fresh = loadApplications();
            setApplications(prev =>
                JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard',          icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events',       icon: Search,          page: 'SponsorBrowseEvents' },
        { label: 'My Applications',     icon: Calendar,        page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History,         page: 'SponsorHistory' },
        { label: 'Profile Settings',    icon: Settings,        page: 'SponsorSettings' },
    ];

    const statusConfig = {
        pending:  { icon: Clock,       color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
        approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700',   label: 'Approved' },
        rejected: { icon: XCircle,     color: 'bg-red-100 text-red-700',       label: 'Rejected' },
    };

    const filteredApplications = activeTab === 'all'
        ? applications
        : applications.filter(a => a.status === activeTab);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="SponsorSettings" />

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
                                const status = statusConfig[app.status] || statusConfig['pending'];

                                return (
                                    <Card key={app.id} className="overflow-hidden">
                                        <img
                                            src={app.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'}
                                            alt={app.eventTitle}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3 gap-2">
                                                <h3 className="font-semibold text-[#1F2937] leading-tight">{app.eventTitle}</h3>
                                                <Badge className={`${status.color} flex-shrink-0`}>
                                                    <status.icon className="w-3 h-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-slate-500 mb-1">{app.college}</p>
                                            <p className="text-sm text-slate-500 mb-3">
                                                {app.package}{app.eventDate ? ` • ${app.eventDate}` : ''}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div>
                                                    <p className="text-xs text-slate-400">Applied</p>
                                                    <p className="text-sm font-medium">{app.appliedDate}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Amount</p>
                                                    <p className="text-lg font-bold text-[#22C55E]">₹{Number(app.amount || 0).toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => setSelectedApp(app)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />View Details
                                                </Button>

                                                {app.status === 'approved' && (
                                                    <Button
                                                        className="flex-1 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white"
                                                        onClick={() => navigate(createPageUrl('Sponsorpayment') + `?id=${app.id}`)}
                                                    >
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        {app.paymentStatus ? 'Pay Again' : 'Pay Now'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {filteredApplications.length === 0 && (
                            <Card className="p-12 text-center">
                                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-[#1F2937]">No applications found</h3>
                                <p className="text-slate-500">
                                    {activeTab === 'all'
                                        ? "You haven't applied to any events yet."
                                        : `You have no ${activeTab} applications.`}
                                </p>
                            </Card>
                        )}

                    </div>
                </main>
            </div>

            {selectedApp && (
                <EventDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
            )}
        </div>
    );
}