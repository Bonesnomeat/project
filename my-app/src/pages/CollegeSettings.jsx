import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, PlusCircle, FileText,
    CreditCard, Settings, User, Building2, Bell, Lock, Camera, Globe
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

const COLLEGE_TYPES = ['Government', 'Private', 'Deemed', 'Autonomous'];
const NAAC_GRADES   = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Graded'];
const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

export default function CollegeSettings() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser]   = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

    // ── Per-tab message banners ──
    const [profileMsg, setProfileMsg]   = useState(null);
    const [orgMsg, setOrgMsg]           = useState(null);
    const [securityMsg, setSecurityMsg] = useState(null);
    const [securityErrors, setSecurityErrors] = useState({});
    const [securityForm, setSecurityForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: '',
    });

    const [profileForm, setProfileForm] = useState({
        name: '', email: '', phone: '', designation: '',
    });

    const [basicForm, setBasicForm] = useState({
        collegeName: '', university: '', establishedYear: '',
        collegeType: 'Private', naacGrade: 'A', aisheCode: '',
    });

    const [contactForm, setContactForm] = useState({
        officialEmail: '', phone: '', website: '',
        address: '', city: '', state: '', pincode: '',
    });

    const [aboutForm, setAboutForm] = useState({
        description: '', studentStrength: '',
    });

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
        if (parsed.avatar) setProfilePhotoPreview(parsed.avatar);

        // ✅ Also read registration data as fallback source
        const regRaw = localStorage.getItem('sponza_registered');
        const reg = regRaw ? JSON.parse(regRaw) : {};

        // Profile tab — prefer sponza_auth, fall back to sponza_registered
        setProfileForm({
            name:        parsed.name        || reg.name        || '',
            email:       parsed.email       || reg.email       || '',
            phone:       parsed.phone       || reg.phone       || '',
            designation: parsed.designation || reg.designation || '',
        });

        // Organization tab — prefer sponza_college_profile, fall back to registration data
        const saved = localStorage.getItem('sponza_college_profile');
        if (saved) {
            const p = JSON.parse(saved);
            if (p.basicForm)   setBasicForm(p.basicForm);
            if (p.contactForm) setContactForm(p.contactForm);
            if (p.aboutForm)   setAboutForm(p.aboutForm);
        } else {
            // ✅ Pre-fill from registration data
            setBasicForm(prev => ({
                ...prev,
                collegeName:  parsed.collegeName  || reg.collegeName  || parsed.name || '',
                collegeType:  parsed.collegeType  || reg.collegeType  || 'Private',
                aisheCode:    parsed.aisheCode    || reg.aisheCode    || '',
            }));
            setContactForm(prev => ({
                ...prev,
                officialEmail: parsed.email       || reg.email        || '',
                phone:         parsed.phone       || reg.phone        || '',
                website:       parsed.website     || reg.website      || '',
                city:  reg.location ? reg.location.split(',')[0]?.trim() : (parsed.city  || ''),
                state: reg.location ? reg.location.split(',')[1]?.trim() : (parsed.state || ''),
            }));
        }
    }, [navigate]);

    const showMsg = (setter, type, text) => {
        setter({ type, text });
        setTimeout(() => setter(null), 3000);
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

    const handleSaveProfile = () => {
        if (!profileForm.name.trim()) {
            showMsg(setProfileMsg, 'error', 'Contact name is required.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            showMsg(setProfileMsg, 'error', 'Enter a valid email address.');
            return;
        }
        const updatedUser = { ...user, ...profileForm, avatar: profilePhotoPreview || user.avatar };
        localStorage.setItem('sponza_auth', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showMsg(setProfileMsg, 'success', '✅ Profile saved successfully!');
    };

    const handleSaveOrganization = () => {
        if (!basicForm.collegeName.trim()) {
            showMsg(setOrgMsg, 'error', 'College name is required.');
            return;
        }
        localStorage.setItem('sponza_college_profile', JSON.stringify({ basicForm, contactForm, aboutForm }));
        showMsg(setOrgMsg, 'success', '✅ Organization info saved successfully!');
    };

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

        const updatedUser = { ...user, password: securityForm.newPassword };
        localStorage.setItem('sponza_auth', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSecurityErrors({});
        showMsg(setSecurityMsg, 'success', '✅ Password updated successfully!');
    };

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
        { label: 'Dashboard',           icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event',         icon: PlusCircle,      page: 'CollegeCreateEvent' },
        { label: 'Manage Events',        icon: Calendar,        page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText,        page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records',      icon: CreditCard,      page: 'CollegePayments' },
        { label: 'Profile Settings',     icon: Settings,        page: 'CollegeSettings' },
    ];

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
                    <div className="max-w-4xl mx-auto">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
                            <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
                        </div>

                        <Tabs defaultValue="profile">
                            <TabsList className="mb-6">
                                <TabsTrigger value="profile">
                                    <User className="w-4 h-4 mr-2" /> Profile
                                </TabsTrigger>
                                <TabsTrigger value="organization">
                                    <Building2 className="w-4 h-4 mr-2" /> Organization
                                </TabsTrigger>
                                <TabsTrigger value="notifications">
                                    <Bell className="w-4 h-4 mr-2" /> Notifications
                                </TabsTrigger>
                                <TabsTrigger value="security">
                                    <Lock className="w-4 h-4 mr-2" /> Security
                                </TabsTrigger>
                            </TabsList>

                            {/* ══════════════════════════════
                                PROFILE TAB
                            ══════════════════════════════ */}
                            <TabsContent value="profile">
                                <Card className="p-6">
                                    <MsgBanner msg={profileMsg} />

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24">
                                                <AvatarImage src={profilePhotoPreview || user?.avatar} />
                                                <AvatarFallback className="bg-[#1E3A8A] text-white text-2xl">
                                                    {profileForm.name?.charAt(0) || user?.name?.charAt(0)}
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
                                                <Label>Contact Person Name</Label>
                                                <Input
                                                    value={profileForm.name}
                                                    onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="mt-1"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <Input
                                                    value={profileForm.email}
                                                    onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                                    type="email"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Phone Number</Label>
                                                <Input
                                                    value={profileForm.phone}
                                                    onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label>Designation / Role</Label>
                                                <Select
                                                    value={profileForm.designation}
                                                    onValueChange={v => setProfileForm(prev => ({ ...prev, designation: v }))}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select designation" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Principal', 'Dean', 'Event Coordinator', 'Student Council Head', 'Faculty In-Charge', 'Other'].map(d => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSaveProfile}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ══════════════════════════════
                                ORGANIZATION TAB
                            ══════════════════════════════ */}
                            <TabsContent value="organization">
                                <MsgBanner msg={orgMsg} />

                                {/* Basic Info */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Basic Information</h3>
                                    <div className="grid gap-6">
                                        <div>
                                            <Label>College Name *</Label>
                                            <Input
                                                value={basicForm.collegeName}
                                                onChange={e => setBasicForm(p => ({ ...p, collegeName: e.target.value }))}
                                                placeholder="e.g. IIT Bombay"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>University / Affiliation</Label>
                                                <Input
                                                    value={basicForm.university}
                                                    onChange={e => setBasicForm(p => ({ ...p, university: e.target.value }))}
                                                    placeholder="e.g. Mumbai University"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label>Established Year</Label>
                                                <Input
                                                    type="number"
                                                    value={basicForm.establishedYear}
                                                    onChange={e => setBasicForm(p => ({ ...p, establishedYear: e.target.value }))}
                                                    placeholder="e.g. 1958"
                                                    className="mt-1"
                                                    min="1800"
                                                    max={new Date().getFullYear()}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <Label>College Type *</Label>
                                                <Select
                                                    value={basicForm.collegeType}
                                                    onValueChange={v => setBasicForm(p => ({ ...p, collegeType: v }))}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COLLEGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>NAAC Grade</Label>
                                                <Select
                                                    value={basicForm.naacGrade}
                                                    onValueChange={v => setBasicForm(p => ({ ...p, naacGrade: v }))}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {NAAC_GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>AISHE Code</Label>
                                                <Input
                                                    value={basicForm.aisheCode}
                                                    onChange={e => setBasicForm(p => ({ ...p, aisheCode: e.target.value }))}
                                                    placeholder="e.g. C-40082"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Contact Info */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Contact Information</h3>
                                    <div className="grid gap-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Official Email *</Label>
                                                <Input
                                                    type="email"
                                                    value={contactForm.officialEmail}
                                                    onChange={e => setContactForm(p => ({ ...p, officialEmail: e.target.value }))}
                                                    placeholder="college@example.edu"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label>Phone Number</Label>
                                                <Input
                                                    value={contactForm.phone}
                                                    onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                                                    placeholder="+91 98765 43210"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Website URL</Label>
                                            <div className="relative mt-1">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input
                                                    value={contactForm.website}
                                                    onChange={e => setContactForm(p => ({ ...p, website: e.target.value }))}
                                                    placeholder="https://yourcollege.edu"
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Full Address</Label>
                                            <Input
                                                value={contactForm.address}
                                                onChange={e => setContactForm(p => ({ ...p, address: e.target.value }))}
                                                placeholder="Street / Area / Building"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <Label>City</Label>
                                                <Input
                                                    value={contactForm.city}
                                                    onChange={e => setContactForm(p => ({ ...p, city: e.target.value }))}
                                                    placeholder="Mumbai"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label>State</Label>
                                                <Select
                                                    value={contactForm.state}
                                                    onValueChange={v => setContactForm(p => ({ ...p, state: v }))}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Pincode</Label>
                                                <Input
                                                    value={contactForm.pincode}
                                                    onChange={e => setContactForm(p => ({ ...p, pincode: e.target.value }))}
                                                    placeholder="400001"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* About & Description */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">About & Description</h3>
                                    <div className="grid gap-6">
                                        <div>
                                            <Label>College Description *</Label>
                                            <Textarea
                                                value={aboutForm.description}
                                                onChange={e => setAboutForm(p => ({ ...p, description: e.target.value }))}
                                                placeholder="Tell sponsors about your college, its culture, achievements, and why they should partner with you..."
                                                className="mt-1 min-h-[120px]"
                                            />
                                        </div>
                                        <div>
                                            <Label>Total Student Strength</Label>
                                            <Input
                                                type="number"
                                                value={aboutForm.studentStrength}
                                                onChange={e => setAboutForm(p => ({ ...p, studentStrength: e.target.value }))}
                                                placeholder="e.g. 5000"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </Card>

                                <div className="flex justify-end">
                                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSaveOrganization}>
                                        Save Organization Info
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* ══════════════════════════════
                                NOTIFICATIONS TAB
                            ══════════════════════════════ */}
                            <TabsContent value="notifications">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Notification Preferences</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'New sponsorship requests', desc: 'Get notified when sponsors apply to your events' },
                                            { label: 'Payment received',         desc: 'Notifications for successful payments' },
                                            { label: 'Application updates',      desc: 'Updates on sponsor application statuses' },
                                            { label: 'Weekly reports',           desc: 'Receive weekly performance summaries' },
                                            { label: 'Marketing updates',        desc: 'News and tips from Sponza' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-[#1F2937]">{item.label}</p>
                                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                                </div>
                                                <Switch defaultChecked={i < 2} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                            Save Preferences
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ══════════════════════════════
                                SECURITY TAB
                            ══════════════════════════════ */}
                            <TabsContent value="security">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Change Password</h3>
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
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleUpdatePassword}>
                                            Update Password
                                        </Button>
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