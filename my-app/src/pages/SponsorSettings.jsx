import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, User, Building2, Bell, Lock, Camera, Globe
} from 'lucide-react';

import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { Switch } from "C:/Users/USER/sponza/project/my-app/src/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "C:/Users/USER/sponza/project/my-app/src/components/ui/avatar";

export default function SponsorSettings() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // ── Success/Error messages per tab ──
    const [profileMsg, setProfileMsg]   = useState(null);
    const [companyMsg, setCompanyMsg]   = useState(null);
    const [prefsMsg, setPrefsMsg]       = useState(null);
    const [securityMsg, setSecurityMsg] = useState(null);

    // ── Profile form ──
    const [profileForm, setProfileForm] = useState({
        name: '', email: '', phone: '', whatsapp: '', designation: '', officialEmail: '',
    });

    // ── Company form ──
    const [companyForm, setCompanyForm] = useState({
        companyName: '', industry: '', companyType: '', companySize: '',
        yearEstablished: '', companyWebsite: '', description: '',
        targetAudience: '', pastHistory: '',
        instagram: '', twitter: '', linkedin: '', facebook: '',
        gstNumber: '', registeredAddress: '',
    });

    // ── Preferences ──
    const [selectedCategories, setSelectedCategories]     = useState([]);
    const [selectedSponsorTypes, setSelectedSponsorTypes] = useState([]);
    const [selectedGoals, setSelectedGoals]               = useState([]);
    const [selectedStates, setSelectedStates]             = useState([]);
    const [budgetRange, setBudgetRange]                   = useState('');
    const [notifications, setNotifications]               = useState([true, true, false, false, false]);

    // ── Security form ──
    const [securityForm, setSecurityForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: '',
    });
    const [securityErrors, setSecurityErrors] = useState({});

    const allCategories    = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Hackathon', 'Seminar'];
    const sponsorshipTypes = ['Title Sponsor', 'Co-Sponsor', 'Associate Sponsor', 'Prize Sponsor', 'In-Kind Sponsor'];
    const sponsorGoals     = ['Brand Awareness', 'Lead Generation', 'Hiring / Recruitment', 'Product Launch', 'Community Engagement', 'CSR Initiative'];
    const industries       = [
        'Technology', 'Finance & Banking', 'Healthcare', 'Retail & E-commerce',
        'Automobile', 'FMCG', 'Education', 'Real Estate', 'Media & Entertainment',
        'Telecom', 'Manufacturing', 'Logistics', 'Food & Beverage', 'Other'
    ];
    const companyTypes = ['Startup', 'SME', 'MNC', 'Public Listed', 'Government', 'NGO', 'Other'];
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
    ];
    const budgetRanges = [
        '₹0 – ₹10,000', '₹10,000 – ₹50,000', '₹50,000 – ₹2,00,000',
        '₹2,00,000 – ₹5,00,000', '₹5,00,000 – ₹10,00,000', '₹10,00,000+'
    ];

    const toggleItem = (item, list, setList) => {
        setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const showMsg = (setter, type, text) => {
        setter({ type, text });
        setTimeout(() => setter(null), 3000);
    };

    // ── Load all data from localStorage on mount ──
    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const p = JSON.parse(auth);
        if (p.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(p);
        if (p.avatar) setProfilePhotoPreview(p.avatar);
        if (p.companyLogo) setLogoPreview(p.companyLogo);

        // ✅ Profile tab — pre-fill from registration data
        setProfileForm({
            name:          p.name          || '',
            email:         p.email         || '',
            phone:         p.phone         || '',
            whatsapp:      p.whatsapp      || '',
            designation:   p.designation   || '',
            officialEmail: p.officialEmail || p.email || '',
        });

        // ✅ Company tab — pre-fill companyName & companyWebsite from registration
        setCompanyForm({
            companyName:       p.companyName       || '',
            industry:          p.industry          || '',
            companyType:       p.companyType       || '',
            companySize:       p.companySize       || '',
            yearEstablished:   p.yearEstablished   || '',
            companyWebsite:    p.companyWebsite    || '',
            description:       p.description       || '',
            targetAudience:    p.targetAudience    || '',
            pastHistory:       p.pastHistory       || '',
            instagram:         p.instagram         || '',
            twitter:           p.twitter           || '',
            linkedin:          p.linkedin          || '',
            facebook:          p.facebook          || '',
            gstNumber:         p.gstNumber         || '',
            registeredAddress: p.registeredAddress || '',
        });

        // ✅ Preferences — restore if previously saved
        if (p.selectedCategories)   setSelectedCategories(p.selectedCategories);
        if (p.selectedSponsorTypes) setSelectedSponsorTypes(p.selectedSponsorTypes);
        if (p.selectedGoals)        setSelectedGoals(p.selectedGoals);
        if (p.selectedStates)       setSelectedStates(p.selectedStates);
        if (p.budgetRange)          setBudgetRange(p.budgetRange);
        if (p.notifications)        setNotifications(p.notifications);
    }, [navigate]);

    const saveToStorage = (data) => {
        const updated = { ...user, ...data };
        localStorage.setItem('sponza_auth', JSON.stringify(updated));
        setUser(updated);
    };

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const handleProfilePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // ── 1. Save Profile ──
    const handleSaveProfile = () => {
        if (!profileForm.name.trim()) {
            showMsg(setProfileMsg, 'error', 'Full name is required.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            showMsg(setProfileMsg, 'error', 'Enter a valid email address.');
            return;
        }
        saveToStorage({ ...profileForm, avatar: profilePhotoPreview || user.avatar });
        showMsg(setProfileMsg, 'success', '✅ Profile saved successfully!');
    };

    // ── 2. Save Company ──
    const handleSaveCompany = () => {
        if (!companyForm.companyName.trim()) {
            showMsg(setCompanyMsg, 'error', 'Company name is required.');
            return;
        }
        saveToStorage({ ...companyForm, companyLogo: logoPreview || user.companyLogo });
        showMsg(setCompanyMsg, 'success', '✅ Company info saved successfully!');
    };

    // ── 3. Save Preferences ──
    const handleSavePreferences = () => {
        saveToStorage({
            selectedCategories, selectedSponsorTypes,
            selectedGoals, selectedStates, budgetRange, notifications,
        });
        showMsg(setPrefsMsg, 'success', '✅ Preferences saved successfully!');
    };

    // ── 4. Update Password ──
    const handleUpdatePassword = () => {
        const e = {};
        if (!securityForm.currentPassword) {
            e.currentPassword = 'Current password is required';
        } else if (securityForm.currentPassword !== user.password) {
            e.currentPassword = 'Current password is incorrect';
        }
        if (!securityForm.newPassword) {
            e.newPassword = 'New password is required';
        } else if (securityForm.newPassword.length < 8) {
            e.newPassword = 'Minimum 8 characters required';
        } else if (!/[A-Z]/.test(securityForm.newPassword)) {
            e.newPassword = 'Must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(securityForm.newPassword)) {
            e.newPassword = 'Must contain at least one number';
        } else if (!/[!@#$%^&*]/.test(securityForm.newPassword)) {
            e.newPassword = 'Must contain a special character (!@#$%^&*)';
        }
        if (!securityForm.confirmPassword) {
            e.confirmPassword = 'Please confirm your new password';
        } else if (securityForm.newPassword !== securityForm.confirmPassword) {
            e.confirmPassword = 'Passwords do not match';
        }
        setSecurityErrors(e);
        if (Object.keys(e).length > 0) return;

        saveToStorage({ password: securityForm.newPassword });
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSecurityErrors({});
        showMsg(setSecurityMsg, 'success', '✅ Password updated successfully!');
    };

    // ── Message banner ──
    const MsgBanner = ({ msg }) => {
        if (!msg) return null;
        return (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${
                msg.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
            }`}>
                {msg.text}
            </div>
        );
    };

    const sidebarItems = [
        { label: 'Dashboard',           icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events',       icon: Search,          page: 'SponsorBrowseEvents' },
        { label: 'My Applications',     icon: Calendar,        page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History,         page: 'SponsorHistory' },
        { label: 'Profile Settings',    icon: Settings,        page: 'SponsorSettings' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="SponsorSettings"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
                            <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
                        </div>

                        <Tabs defaultValue="profile">
                            <TabsList className="mb-6">
                                <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
                                <TabsTrigger value="company"><Building2 className="w-4 h-4 mr-2" />Company</TabsTrigger>
                                <TabsTrigger value="preferences"><Bell className="w-4 h-4 mr-2" />Preferences</TabsTrigger>
                                <TabsTrigger value="security"><Lock className="w-4 h-4 mr-2" />Security</TabsTrigger>
                            </TabsList>

                            {/* ── PROFILE TAB ── */}
                            <TabsContent value="profile">
                                <Card className="p-6">
                                    <MsgBanner msg={profileMsg} />

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24">
                                                <AvatarImage src={profilePhotoPreview || user?.avatar} />
                                                <AvatarFallback className="bg-[#1E3A8A] text-white text-2xl">
                                                    {user?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <label className="cursor-pointer absolute bottom-0 right-0">
                                                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white hover:bg-[#1E3A8A]/80 transition-colors">
                                                    <Camera className="w-4 h-4" />
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} />
                                            </label>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#1F2937]">{profileForm.name || user?.name}</h3>
                                            <p className="text-slate-500">{profileForm.email || user?.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">Click the camera icon to update your photo</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Full Name</Label>
                                                <Input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <Input value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} className="mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Phone Number</Label>
                                                <Input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>WhatsApp Number (Optional)</Label>
                                                <Input value={profileForm.whatsapp} onChange={e => setProfileForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Designation</Label>
                                                <Select value={profileForm.designation} onValueChange={v => setProfileForm(p => ({ ...p, designation: v }))}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select designation" /></SelectTrigger>
                                                    <SelectContent>
                                                        {['CEO', 'CMO', 'Marketing Manager', 'Brand Manager', 'Sponsorship Manager', 'HR Manager', 'Other'].map(d => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Official Email</Label>
                                                <Input value={profileForm.officialEmail} onChange={e => setProfileForm(p => ({ ...p, officialEmail: e.target.value }))} placeholder="you@company.com" type="email" className="mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSaveProfile}>Save Changes</Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ── COMPANY TAB ── */}
                            <TabsContent value="company">
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Basic Company Info</h3>
                                    <MsgBanner msg={companyMsg} />

                                    <div className="mb-6">
                                        <Label>Company Logo</Label>
                                        <div className="mt-2 flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
                                                {logoPreview
                                                    ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain" />
                                                    : <Building2 className="w-8 h-8 text-slate-400" />}
                                            </div>
                                            <label className="cursor-pointer">
                                                <div className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors">
                                                    Upload Logo
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div>
                                            <Label>Company Name *</Label>
                                            <Input value={companyForm.companyName} onChange={e => setCompanyForm(p => ({ ...p, companyName: e.target.value }))} placeholder="Enter company name" className="mt-1" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Industry / Sector *</Label>
                                                <Select value={companyForm.industry} onValueChange={v => setCompanyForm(p => ({ ...p, industry: v }))}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry" /></SelectTrigger>
                                                    <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Company Type *</Label>
                                                <Select value={companyForm.companyType} onValueChange={v => setCompanyForm(p => ({ ...p, companyType: v }))}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                                                    <SelectContent>{companyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Company Size</Label>
                                                <Select value={companyForm.companySize} onValueChange={v => setCompanyForm(p => ({ ...p, companySize: v }))}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select size" /></SelectTrigger>
                                                    <SelectContent>
                                                        {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => (
                                                            <SelectItem key={s} value={s}>{s} employees</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Year Established</Label>
                                                <Input type="number" value={companyForm.yearEstablished} onChange={e => setCompanyForm(p => ({ ...p, yearEstablished: e.target.value }))} placeholder="e.g., 2010" className="mt-1" min="1900" max={new Date().getFullYear()} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Company Website</Label>
                                            <div className="relative mt-1">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input value={companyForm.companyWebsite} onChange={e => setCompanyForm(p => ({ ...p, companyWebsite: e.target.value }))} placeholder="https://yourcompany.com" className="pl-10" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Company Description *</Label>
                                            <Textarea value={companyForm.description} onChange={e => setCompanyForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your company..." className="mt-1 min-h-[100px]" />
                                        </div>
                                        <div>
                                            <Label>Target Audience</Label>
                                            <Input value={companyForm.targetAudience} onChange={e => setCompanyForm(p => ({ ...p, targetAudience: e.target.value }))} placeholder="e.g., Engineering students, Gen Z" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Past Sponsorship History (Optional)</Label>
                                            <Textarea value={companyForm.pastHistory} onChange={e => setCompanyForm(p => ({ ...p, pastHistory: e.target.value }))} placeholder="Mention any events or colleges you have sponsored before..." className="mt-1 min-h-[80px]" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Social Media */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Social Media Handles</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Instagram</Label>
                                            <Input value={companyForm.instagram} onChange={e => setCompanyForm(p => ({ ...p, instagram: e.target.value }))} placeholder="@yourcompany" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Twitter / X</Label>
                                            <Input value={companyForm.twitter} onChange={e => setCompanyForm(p => ({ ...p, twitter: e.target.value }))} placeholder="@yourcompany" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>LinkedIn</Label>
                                            <Input value={companyForm.linkedin} onChange={e => setCompanyForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="linkedin.com/company/..." className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Facebook</Label>
                                            <Input value={companyForm.facebook} onChange={e => setCompanyForm(p => ({ ...p, facebook: e.target.value }))} placeholder="facebook.com/..." className="mt-1" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Legal & Financial */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Legal & Financial Info</h3>
                                    <div className="grid gap-6">
                                        <div>
                                            <Label>GST Number</Label>
                                            <Input value={companyForm.gstNumber} onChange={e => setCompanyForm(p => ({ ...p, gstNumber: e.target.value }))} placeholder="e.g., 22AAAAA0000A1Z5" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Registered Business Address *</Label>
                                            <Textarea value={companyForm.registeredAddress} onChange={e => setCompanyForm(p => ({ ...p, registeredAddress: e.target.value }))} placeholder="Enter full registered address..." className="mt-1 min-h-[80px]" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Documents */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Documents</h3>
                                    <div className="grid gap-6">
                                        {[
                                            { label: 'GST Certificate', key: 'gstCert' },
                                            { label: 'Brand Guidelines / Logo Kit (Optional)', key: 'brandKit' },
                                        ].map(({ label, key }) => (
                                            <div key={key}>
                                                <Label>{label}</Label>
                                                <div className="mt-1 border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-[#1E3A8A] transition-colors">
                                                    <label className="cursor-pointer flex flex-col items-center gap-1">
                                                        <p className="text-sm text-slate-600">Click to upload PDF</p>
                                                        <p className="text-xs text-slate-400">PDF up to 10MB</p>
                                                        <input type="file" accept=".pdf,.zip" className="hidden" />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div className="flex justify-end">
                                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSaveCompany}>Save Company Info</Button>
                                </div>
                            </TabsContent>

                            {/* ── PREFERENCES TAB ── */}
                            <TabsContent value="preferences">
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Sponsorship Preferences</h3>
                                    <MsgBanner msg={prefsMsg} />

                                    <div className="grid gap-6">
                                        <div>
                                            <Label>Sponsorship Budget Range (₹)</Label>
                                            <Select value={budgetRange} onValueChange={setBudgetRange}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select budget range" /></SelectTrigger>
                                                <SelectContent>
                                                    {budgetRanges.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Preferred Event Categories</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {allCategories.map(cat => (
                                                    <button key={cat} type="button"
                                                        onClick={() => toggleItem(cat, selectedCategories, setSelectedCategories)}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                            selectedCategories.includes(cat)
                                                                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                                : 'bg-white text-slate-600 border-slate-300 hover:border-[#1E3A8A]'
                                                        }`}>
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Preferred Sponsorship Type</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {sponsorshipTypes.map(type => (
                                                    <button key={type} type="button"
                                                        onClick={() => toggleItem(type, selectedSponsorTypes, setSelectedSponsorTypes)}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                            selectedSponsorTypes.includes(type)
                                                                ? 'bg-[#22C55E] text-white border-[#22C55E]'
                                                                : 'bg-white text-slate-600 border-slate-300 hover:border-[#22C55E]'
                                                        }`}>
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Goals from Sponsorship</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {sponsorGoals.map(goal => (
                                                    <button key={goal} type="button"
                                                        onClick={() => toggleItem(goal, selectedGoals, setSelectedGoals)}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                            selectedGoals.includes(goal)
                                                                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                                : 'bg-white text-slate-600 border-slate-300 hover:border-[#1E3A8A]'
                                                        }`}>
                                                        {goal}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Preferred Locations / States</Label>
                                            <Select onValueChange={v => toggleItem(v, selectedStates, setSelectedStates)}>
                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select states" /></SelectTrigger>
                                                <SelectContent>
                                                    {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            {selectedStates.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedStates.map(state => (
                                                        <span key={state} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1">
                                                            {state}
                                                            <button type="button" onClick={() => toggleItem(state, selectedStates, setSelectedStates)} className="text-slate-400 hover:text-red-500 ml-1">×</button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {/* Notifications */}
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Notifications</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'New event recommendations', desc: 'Get notified about events matching your preferences' },
                                            { label: 'Application updates',       desc: 'Updates on your sponsorship applications' },
                                            { label: 'Weekly digest',             desc: 'Summary of top sponsorship opportunities' },
                                            { label: 'Payment reminders',         desc: 'Reminders for pending sponsorship payments' },
                                            { label: 'Event alerts',              desc: 'Alerts when events you sponsored are approaching' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-[#1F2937]">{item.label}</p>
                                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                                </div>
                                                <Switch
                                                    checked={notifications[i]}
                                                    onCheckedChange={val => setNotifications(prev => {
                                                        const updated = [...prev];
                                                        updated[i] = val;
                                                        return updated;
                                                    })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSavePreferences}>Save Preferences</Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ── SECURITY TAB ── */}
                            <TabsContent value="security">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Change Password</h3>
                                    <MsgBanner msg={securityMsg} />

                                    <div className="grid gap-6 max-w-md">
                                        <div>
                                            <Label>Current Password</Label>
                                            <Input
                                                type="password"
                                                value={securityForm.currentPassword}
                                                onChange={e => { setSecurityForm(p => ({ ...p, currentPassword: e.target.value })); setSecurityErrors(p => ({ ...p, currentPassword: '' })); }}
                                                className="mt-1"
                                            />
                                            {securityErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{securityErrors.currentPassword}</p>}
                                        </div>
                                        <div>
                                            <Label>New Password</Label>
                                            <Input
                                                type="password"
                                                value={securityForm.newPassword}
                                                onChange={e => { setSecurityForm(p => ({ ...p, newPassword: e.target.value })); setSecurityErrors(p => ({ ...p, newPassword: '' })); }}
                                                placeholder="Min 8 chars, uppercase, number, special char"
                                                className="mt-1"
                                            />
                                            {securityErrors.newPassword && <p className="text-red-500 text-xs mt-1">{securityErrors.newPassword}</p>}
                                        </div>
                                        <div>
                                            <Label>Confirm New Password</Label>
                                            <Input
                                                type="password"
                                                value={securityForm.confirmPassword}
                                                onChange={e => { setSecurityForm(p => ({ ...p, confirmPassword: e.target.value })); setSecurityErrors(p => ({ ...p, confirmPassword: '' })); }}
                                                className="mt-1"
                                            />
                                            {securityErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{securityErrors.confirmPassword}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleUpdatePassword}>Update Password</Button>
                                    </div>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}