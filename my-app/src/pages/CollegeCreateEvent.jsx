import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, Upload, X, Plus, Trash2, CheckCircle
} from 'lucide-react';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";

// ✅ Global helper to get all events (dummy + college-created)
export function getAllEvents() {
    const { dummyEvents } = require('C:/Users/USER/sponza/project/my-app/src/components/data/dummyData');
    try {
        const saved = localStorage.getItem('sponza_events');
        const collegeEvents = saved ? JSON.parse(saved) : [];
        return [...dummyEvents, ...collegeEvents];
    } catch { return dummyEvents; }
}

export default function CollegeCreateEvent() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        title: '', description: '', category: '', date: '', endDate: '',
        eventTime: '', duration: '', location: '', website: '',
        expectedAttendees: '', ticketPrice: '', estimatedRevenue: '',
        collegeName: '', universityAffiliated: '', collegeCity: '',
        collegeState: '', collegeWebsite: '', collegeType: '',
        organizerName: '', organizerDesignation: '', organizerEmail: '',
        organizerPhone: '', organizerWhatsapp: '',
        totalBudgetNeeded: '', pastSponsorshipHistory: '', sponsorBenefits: '',
        instagram: '', twitter: '', linkedin: '', facebook: '',
    });

    const [packages, setPackages] = useState([
        { name: 'Platinum', price: '', benefits: [''] },
        { name: 'Gold', price: '', benefits: [''] },
    ]);

    const [posterPreview, setPosterPreview] = useState(null);
    const [proposalFile, setProposalFile] = useState(null);
    const [authLetterFile, setAuthLetterFile] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);

        // ✅ Pre-fill college info from settings
        const collegeProfile = localStorage.getItem('sponza_college_profile');
        if (collegeProfile) {
            const { basicForm, contactForm } = JSON.parse(collegeProfile);
            setFormData(prev => ({
                ...prev,
                collegeName:   basicForm?.collegeName  || parsed.name || '',
                collegeType:   basicForm?.collegeType  || '',
                collegeCity:   contactForm?.city       || '',
                collegeState:  contactForm?.state      || '',
                collegeWebsite: contactForm?.website   || '',
                universityAffiliated: basicForm?.university || '',
                organizerEmail: contactForm?.officialEmail || parsed.email || '',
                organizerPhone: contactForm?.phone     || parsed.phone || '',
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                collegeName:    parsed.collegeName || parsed.name || '',
                organizerEmail: parsed.email || '',
                organizerPhone: parsed.phone || '',
            }));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard',           icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event',         icon: PlusCircle,      page: 'CollegeCreateEvent' },
        { label: 'Manage Events',        icon: Calendar,        page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText,        page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records',      icon: CreditCard,      page: 'CollegePayments' },
        { label: 'Profile Settings',     icon: Settings,        page: 'CollegeSettings' },
    ];

    const categories    = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Hackathon', 'Seminar'];
    const collegeTypes  = ['Engineering','Autonomous', 'Arts & Science', 'Medical', 'Law', 'Management', 'Polytechnic', 'Other'];
    const designations  = ['Student Coordinator', 'Faculty Coordinator', 'Event Manager', 'Principal', 'Other'];
    const indianStates  = [
        'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
        'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
        'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
        'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
        'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
    ];

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handlePackageChange = (index, field, value) => {
        const updated = [...packages];
        updated[index][field] = value;
        setPackages(updated);
    };
    const handleBenefitChange = (pkgIndex, benIndex, value) => {
        const updated = [...packages];
        updated[pkgIndex].benefits[benIndex] = value;
        setPackages(updated);
    };
    const addBenefit    = (pkgIndex) => { const u = [...packages]; u[pkgIndex].benefits.push(''); setPackages(u); };
    const removeBenefit = (pkgIndex, benIndex) => { const u = [...packages]; u[pkgIndex].benefits.splice(benIndex, 1); setPackages(u); };
    const addPackage    = () => setPackages([...packages, { name: '', price: '', benefits: [''] }]);
    const removePackage = (index) => setPackages(packages.filter((_, i) => i !== index));

    const handlePosterUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPosterPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // ✅ On submit — build event object and save to localStorage
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const budget = Number(formData.totalBudgetNeeded) || 0;
        const newEvent = {
            id: `college_${Date.now()}`,
            title:              formData.title,
            description:        formData.description,
            category:           formData.category,
            date:               formData.date,
            endDate:            formData.endDate,
            eventTime:          formData.eventTime,
            duration:           formData.duration,
            location:           formData.location,
            website:            formData.website,
            expectedAttendees:  Number(formData.expectedAttendees) || 0,
            ticketPrice:        Number(formData.ticketPrice) || 0,
            estimatedRevenue:   Number(formData.estimatedRevenue) || 0,
            college:            formData.collegeName,
            collegeCity:        formData.collegeCity,
            collegeState:       formData.collegeState,
            collegeType:        formData.collegeType,
            universityAffiliated: formData.universityAffiliated,
            organizer:          formData.organizerName,
            organizerDesignation: formData.organizerDesignation,
            organizerEmail:     formData.organizerEmail,
            organizerPhone:     formData.organizerPhone,
            sponsorBenefits:    formData.sponsorBenefits,
            totalBudgetNeeded:  budget,
            minSponsorship:     Math.round(budget * 0.1),
            maxSponsorship:     budget,
            packages:           packages.filter(p => p.name),
            image:              posterPreview || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
            status:             'Open',
            createdBy:          user?.email,
            createdAt:          new Date().toISOString(),
            social: {
                instagram: formData.instagram,
                twitter:   formData.twitter,
                linkedin:  formData.linkedin,
                facebook:  formData.facebook,
            },
        };

        // ✅ Save to sponza_events (college-created events list)
        const existing = JSON.parse(localStorage.getItem('sponza_events') || '[]');
        existing.push(newEvent);
        localStorage.setItem('sponza_events', JSON.stringify(existing));

        // ✅ Also sync admin_events so AdminPanel reflects it immediately
        const { dummyEvents } = require('C:/Users/USER/sponza/project/my-app/src/components/data/dummyData');
        const adminSaved = localStorage.getItem('admin_events');
        const adminEvents = adminSaved ? JSON.parse(adminSaved) : dummyEvents.map(e => ({ ...e, status: 'Open' }));
        adminEvents.push({ ...newEvent, status: 'Open' });
        localStorage.setItem('admin_events', JSON.stringify(adminEvents));

        setTimeout(() => {
            setLoading(false);
            setSuccessMsg(true);
            setTimeout(() => navigate(createPageUrl('CollegeManageEvents')), 1200);
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="college" />
            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="CollegeSettings" />
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Create New Event</h1>
                            <p className="text-slate-600 mt-2">Fill in the details to create a new sponsorship opportunity</p>
                        </div>

                        {/* ✅ Success banner */}
                        {successMsg && (
                            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
                                <CheckCircle className="w-5 h-5" />
                                Event created successfully! Redirecting...
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* ── 1. Event Details ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Event Details</h2>
                                <div className="grid gap-6">
                                    <div>
                                        <Label>Event Title *</Label>
                                        <Input placeholder="Enter event title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} className="mt-1" required />
                                    </div>
                                    <div>
                                        <Label>Description *</Label>
                                        <Textarea placeholder="Describe your event in detail..." value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="mt-1 min-h-[120px]" required />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Category *</Label>
                                            <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                                                <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Expected Attendees *</Label>
                                            <Input type="number" placeholder="e.g., 5000" value={formData.expectedAttendees} onChange={e => handleInputChange('expectedAttendees', e.target.value)} className="mt-1" required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Start Date *</Label>
                                            <Input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)} className="mt-1" required min={tomorrow} />
                                        </div>
                                        <div>
                                            <Label>End Date</Label>
                                            <Input type="date" value={formData.endDate} onChange={e => handleInputChange('endDate', e.target.value)} className="mt-1" min={formData.date || tomorrow} />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Event Time *</Label>
                                            <Input type="time" value={formData.eventTime} onChange={e => handleInputChange('eventTime', e.target.value)} className="mt-1" required />
                                        </div>
                                        <div>
                                            <Label>Duration</Label>
                                            <Input placeholder="e.g., 2 days / 6 hours" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} className="mt-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Venue / Location *</Label>
                                        <Input placeholder="Full venue address" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="mt-1" required />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Registration Fee (₹)</Label>
                                            <Input type="number" placeholder="0 if free" value={formData.ticketPrice} onChange={e => handleInputChange('ticketPrice', e.target.value)} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Estimated Revenue (₹)</Label>
                                            <Input type="number" placeholder="e.g., 200000" value={formData.estimatedRevenue} onChange={e => handleInputChange('estimatedRevenue', e.target.value)} className="mt-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Event Website (Optional)</Label>
                                        <Input placeholder="https://..." value={formData.website} onChange={e => handleInputChange('website', e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                            </Card>

                            {/* ── 2. College Info ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">College Information</h2>
                                <div className="grid gap-6">
                                    <div>
                                        <Label>College Name *</Label>
                                        <Input placeholder="Enter your college name" value={formData.collegeName} onChange={e => handleInputChange('collegeName', e.target.value)} className="mt-1" required />
                                    </div>
                                    <div>
                                        <Label>Affiliated University *</Label>
                                        <Input placeholder="e.g., Anna University" value={formData.universityAffiliated} onChange={e => handleInputChange('universityAffiliated', e.target.value)} className="mt-1" required />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>College Type *</Label>
                                            <Select value={formData.collegeType} onValueChange={v => handleInputChange('collegeType', v)}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                                                <SelectContent>{collegeTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>College Website</Label>
                                            <Input placeholder="https://college.edu" value={formData.collegeWebsite} onChange={e => handleInputChange('collegeWebsite', e.target.value)} className="mt-1" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>City *</Label>
                                            <Input placeholder="e.g., Chennai" value={formData.collegeCity} onChange={e => handleInputChange('collegeCity', e.target.value)} className="mt-1" required />
                                        </div>
                                        <div>
                                            <Label>State *</Label>
                                            <Select value={formData.collegeState} onValueChange={v => handleInputChange('collegeState', v)}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                                                <SelectContent>{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* ── 3. Organizer Info ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Organizer / Point of Contact</h2>
                                <div className="grid gap-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Organizer Name *</Label>
                                            <Input placeholder="Full name" value={formData.organizerName} onChange={e => handleInputChange('organizerName', e.target.value)} className="mt-1" required />
                                        </div>
                                        <div>
                                            <Label>Designation *</Label>
                                            <Select value={formData.organizerDesignation} onValueChange={v => handleInputChange('organizerDesignation', v)}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select designation" /></SelectTrigger>
                                                <SelectContent>{designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Email Address *</Label>
                                            <Input type="email" placeholder="organizer@college.edu" value={formData.organizerEmail} onChange={e => handleInputChange('organizerEmail', e.target.value)} className="mt-1" required />
                                        </div>
                                        <div>
                                            <Label>Phone Number *</Label>
                                            <Input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.organizerPhone} onChange={e => handleInputChange('organizerPhone', e.target.value)} className="mt-1" required />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>WhatsApp Number (Optional)</Label>
                                        <Input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.organizerWhatsapp} onChange={e => handleInputChange('organizerWhatsapp', e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                            </Card>

                            {/* ── 4. Sponsorship Info ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Sponsorship Requirements</h2>
                                <div className="grid gap-6">
                                    <div>
                                        <Label>Total Budget Needed (₹) *</Label>
                                        <Input type="number" placeholder="e.g., 500000" value={formData.totalBudgetNeeded} onChange={e => handleInputChange('totalBudgetNeeded', e.target.value)} className="mt-1" required />
                                    </div>
                                    <div>
                                        <Label>What Sponsors Get in Return *</Label>
                                        <Textarea placeholder="e.g., Logo on banners, stage mentions..." value={formData.sponsorBenefits} onChange={e => handleInputChange('sponsorBenefits', e.target.value)} className="mt-1 min-h-[100px]" required />
                                    </div>
                                    <div>
                                        <Label>Past Sponsorship History (Optional)</Label>
                                        <Textarea placeholder="Mention any past sponsors..." value={formData.pastSponsorshipHistory} onChange={e => handleInputChange('pastSponsorshipHistory', e.target.value)} className="mt-1 min-h-[100px]" />
                                    </div>

                                    {/* Packages */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <Label className="text-base font-semibold">Sponsorship Packages</Label>
                                            <Button type="button" variant="outline" size="sm" onClick={addPackage}>
                                                <Plus className="w-4 h-4 mr-1" /> Add Package
                                            </Button>
                                        </div>
                                        {packages.map((pkg, pkgIndex) => (
                                            <div key={pkgIndex} className="border border-slate-200 rounded-xl p-4 mb-4 bg-slate-50">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-medium text-[#1E3A8A]">Package {pkgIndex + 1}</span>
                                                    {packages.length > 1 && (
                                                        <button type="button" onClick={() => removePackage(pkgIndex)}>
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <Label>Package Name</Label>
                                                        <Input placeholder="e.g., Platinum" value={pkg.name} onChange={e => handlePackageChange(pkgIndex, 'name', e.target.value)} className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Price (₹)</Label>
                                                        <Input type="number" placeholder="e.g., 100000" value={pkg.price} onChange={e => handlePackageChange(pkgIndex, 'price', e.target.value)} className="mt-1" />
                                                    </div>
                                                </div>
                                                <Label>Benefits</Label>
                                                {pkg.benefits.map((benefit, benIndex) => (
                                                    <div key={benIndex} className="flex gap-2 mt-2">
                                                        <Input placeholder="e.g., Logo on main banner" value={benefit} onChange={e => handleBenefitChange(pkgIndex, benIndex, e.target.value)} />
                                                        {pkg.benefits.length > 1 && (
                                                            <button type="button" onClick={() => removeBenefit(pkgIndex, benIndex)}>
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => addBenefit(pkgIndex)} className="mt-2 text-sm text-[#1E3A8A] hover:underline flex items-center gap-1">
                                                    <Plus className="w-3 h-3" /> Add Benefit
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            {/* ── 5. Social Media ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Social Media Handles (Optional)</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div><Label>Instagram</Label><Input placeholder="@yourhandle" value={formData.instagram} onChange={e => handleInputChange('instagram', e.target.value)} className="mt-1" /></div>
                                    <div><Label>Twitter / X</Label><Input placeholder="@yourhandle" value={formData.twitter} onChange={e => handleInputChange('twitter', e.target.value)} className="mt-1" /></div>
                                    <div><Label>LinkedIn</Label><Input placeholder="linkedin.com/in/..." value={formData.linkedin} onChange={e => handleInputChange('linkedin', e.target.value)} className="mt-1" /></div>
                                    <div><Label>Facebook</Label><Input placeholder="facebook.com/..." value={formData.facebook} onChange={e => handleInputChange('facebook', e.target.value)} className="mt-1" /></div>
                                </div>
                            </Card>

                            {/* ── 6. Event Poster ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Event Poster</h2>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1E3A8A] transition-colors">
                                    {posterPreview ? (
                                        <div className="relative inline-block">
                                            <img src={posterPreview} alt="Event poster" className="max-h-64 rounded-lg" />
                                            <button type="button" onClick={() => setPosterPreview(null)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                            <p className="text-lg font-medium text-[#1F2937]">Upload Event Poster</p>
                                            <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                                            <input type="file" accept="image/*" onChange={handlePosterUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </Card>

                            {/* ── 7. Documents ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Supporting Documents</h2>
                                <div className="grid gap-6">
                                    {[
                                        { label: 'Event Proposal / Brochure (PDF)', state: proposalFile, setter: setProposalFile },
                                        { label: 'College Authorization Letter (PDF)', state: authLetterFile, setter: setAuthLetterFile },
                                    ].map(({ label, state, setter }) => (
                                        <div key={label}>
                                            <Label>{label}</Label>
                                            <div className="mt-1 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#1E3A8A] transition-colors">
                                                {state ? (
                                                    <div className="flex items-center justify-between px-4">
                                                        <span className="text-sm text-[#1F2937] font-medium">{state.name}</span>
                                                        <button type="button" onClick={() => setter(null)}><X className="w-4 h-4 text-red-500" /></button>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer">
                                                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                                        <p className="text-sm text-slate-600">Upload file</p>
                                                        <p className="text-xs text-slate-400 mt-1">PDF up to 10MB</p>
                                                        <input type="file" accept=".pdf" className="hidden" onChange={e => setter(e.target.files[0])} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Submit */}
                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl('CollegeDashboard'))}>Cancel</Button>
                                <Button type="submit" className="bg-[#22C55E] hover:bg-[#22C55E]/90 px-8" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}