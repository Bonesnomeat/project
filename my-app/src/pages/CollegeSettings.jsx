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

        setProfileForm({
            name:        parsed.name        || '',
            email:       parsed.email       || '',
            phone:       parsed.phone       || '',
            designation: parsed.designation || '',
        });

        const saved = localStorage.getItem('sponza_college_profile');
        if (saved) {
            const p = JSON.parse(saved);
            if (p.basicForm)   setBasicForm(p.basicForm);
            if (p.contactForm) setContactForm(p.contactForm);
            if (p.aboutForm)   setAboutForm(p.aboutForm);
        } else {
            setBasicForm(prev   => ({ ...prev, collegeName:   parsed.collegeName || parsed.name || '' }));
            setContactForm(prev => ({ ...prev, officialEmail: parsed.email || '', phone: parsed.phone || '' }));
        }
    }, [navigate]);

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

    const showSuccess = () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleSaveProfile = () => {
        const updatedUser = { ...user, ...profileForm, avatar: profilePhotoPreview || user.avatar };
        localStorage.setItem('sponza_auth', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showSuccess();
    };

    const handleSaveOrganization = () => {
        localStorage.setItem('sponza_college_profile', JSON.stringify({ basicForm, contactForm, aboutForm }));
        showSuccess();
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
                                    {saveSuccess && (
                                        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                                            ✅ Profile saved successfully! Header avatar updated.
                                        </div>
                                    )}

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
                                {saveSuccess && (
                                    <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                                        ✅ Organization info saved successfully!
                                    </div>
                                )}

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
                                    <div className="grid gap-6 max-w-md">
                                        <div>
                                            <Label>Current Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>New Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Confirm New Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
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