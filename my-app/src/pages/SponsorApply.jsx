import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, ArrowLeft, CheckCircle, Users, MapPin
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
import { RadioGroup, RadioGroupItem } from "C:/Users/USER/sponza/project/my-app/src/components/ui/radio-group";

import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

const APPLICATIONS_KEY = 'sponza_applications';
const EVENTS_KEY = 'sponza_events';

// Load all events — same logic everywhere
function loadAllEvents() {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        const storedEvents = stored ? JSON.parse(stored) : [];
        const storedIds = new Set(storedEvents.map(e => String(e.id)));
        const merged = [
            ...storedEvents,
            ...dummyEvents.filter(e => !storedIds.has(String(e.id))),
        ];
        return merged;
    } catch {}
    return dummyEvents;
}

export default function SponsorApply() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('eventId');

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [event, setEvent] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
        setCompanyName(parsed.companyName || parsed.name || '');
        setEmail(parsed.email || '');

        const allEvents = loadAllEvents();
        const found = allEvents.find(e => String(e.id) === String(eventId));
        setEvent(found || null);
    }, [navigate, eventId]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Find selected package details
        const pkg = event.packages?.find(p => p.name === selectedPackage);

        // Build application object
        const newApplication = {
            id: Date.now(),
            eventId: event.id,
            eventTitle: event.title,
            college: event.college || '',
            package: selectedPackage,
            amount: pkg?.price || 0,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0],
            eventDate: event.date || '',
            image: event.image || '',
            message: message,
            companyName: companyName,
            sponsorEmail: email,
            paymentStatus: null,
        };

        // Save to sponza_applications in localStorage
        try {
            const existing = localStorage.getItem(APPLICATIONS_KEY);
            const apps = existing ? JSON.parse(existing) : [];
            apps.push(newApplication);
            localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
        } catch (err) {
            console.error('Failed to save application', err);
        }

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1000);
    };

    if (!user) return null;

    // Event not found
    if (!event) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Card className="p-12 text-center max-w-md">
                    <h2 className="text-xl font-bold text-[#1F2937] mb-4">Event Not Found</h2>
                    <p className="text-slate-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
                    <Link to={createPageUrl('SponsorBrowseEvents')}>
                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Back to Events</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex">
                <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />
                <div className="flex-1 flex flex-col min-h-screen">
                    <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="SponsorSettings" />
                    <main className="flex-1 p-6 lg:p-8 overflow-auto flex items-center justify-center">
                        <Card className="p-12 text-center max-w-md">
                            <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-[#22C55E]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Application Submitted!</h2>
                            <p className="text-slate-600 mb-8">
                                Your sponsorship application for <strong>{event.title}</strong> has been submitted successfully.
                                The organizers will review and respond soon.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link to={createPageUrl('SponsorApplications')}>
                                    <Button variant="outline">View Applications</Button>
                                </Link>
                                <Link to={createPageUrl('SponsorBrowseEvents')}>
                                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Browse More Events</Button>
                                </Link>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="SponsorSettings" />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <Link to={createPageUrl('SponsorBrowseEvents')} className="inline-flex items-center text-slate-600 hover:text-[#1E3A8A] mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Apply for Sponsorship</h1>
                            <p className="text-slate-600 mt-1">Submit your sponsorship application</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Event Info Card */}
                            <Card className="lg:col-span-1 p-6 h-fit">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-40 object-cover rounded-xl mb-4"
                                />
                                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{event.title}</h3>
                                <Badge className="mb-4">{event.category}</Badge>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users className="w-4 h-4" />
                                        <span>{event.expectedAttendees?.toLocaleString()} attendees</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Application Form */}
                            <Card className="lg:col-span-2 p-6">
                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-xl font-semibold text-[#1F2937] mb-6">Select Sponsorship Package</h3>

                                    {event.packages && event.packages.length > 0 ? (
                                        <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage} className="space-y-4 mb-8">
                                            {event.packages.map((pkg, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                        selectedPackage === pkg.name
                                                            ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                    onClick={() => setSelectedPackage(pkg.name)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <RadioGroupItem value={pkg.name} id={`pkg-${index}`} />
                                                            <div>
                                                                <Label htmlFor={`pkg-${index}`} className="text-lg font-semibold cursor-pointer">
                                                                    {pkg.name}
                                                                </Label>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {pkg.benefits?.slice(0, 3).map((b, i) => (
                                                                        <Badge key={i} variant="outline" className="text-xs">{b}</Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-2xl font-bold text-[#22C55E]">
                                                            ₹{Number(pkg.price)?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        <div className="mb-8 p-4 bg-slate-50 rounded-xl text-slate-500 text-sm">
                                            No packages defined for this event yet.
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <Label>Company Name</Label>
                                            <Input
                                                value={companyName}
                                                onChange={e => setCompanyName(e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Contact Email</Label>
                                            <Input
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Message to Organizers</Label>
                                            <Textarea
                                                placeholder="Tell the organizers why you'd like to sponsor this event..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="mt-1 min-h-[120px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4 justify-end">
                                        <Link to={createPageUrl('SponsorBrowseEvents')}>
                                            <Button type="button" variant="outline">Cancel</Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            className="bg-[#22C55E] hover:bg-[#22C55E]/90 px-8"
                                            disabled={(!selectedPackage && event.packages?.length > 0) || loading}
                                        >
                                            {loading ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}