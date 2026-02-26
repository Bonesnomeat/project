import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, DollarSign, 
    Building2, GraduationCap, AlertCircle, Lock
} from 'lucide-react';

import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import StatsCard from '../components/shared/StatsCard';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";

import { dummyAdminStats, allUsers, dummyEvents, dummySponsorshipRequests, dummyPaymentRecords }
from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

const SECRET = 'sponza123';

// ✅ Helper: parse event end date
const parseEventEndDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        const cleaned = dateStr.replace(/(\d+)-(\d+)/, '$2');
        return new Date(cleaned);
    } catch { return null; }
};
const isEventEnded = (dateStr) => {
    const d = parseEventEndDate(dateStr);
    return d ? d < new Date() : false;
};

function PassphraseGate({ onUnlock }) {
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const attempt = () => {
        if (pass === SECRET) {
            onUnlock();
        } else {
            setError('Wrong passphrase. Access denied.');
            setShake(true);
            setPass('');
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
                @keyframes shake {
                    0%,100%{transform:translateX(0)}
                    20%{transform:translateX(-8px)}
                    40%{transform:translateX(8px)}
                    60%{transform:translateX(-6px)}
                    80%{transform:translateX(6px)}
                }
                .shake { animation: shake 0.4s ease; }
                .gate-input::placeholder { color: rgba(255,255,255,0.35); }
                .gate-btn:hover { opacity: 0.85; transform: translateY(-1px); }
                .gate-btn { transition: all 200ms; }
            `}</style>
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center",
                justifyContent: "center", background: "#00052d",
                fontFamily: "Poppins, sans-serif",
            }}>
                <div
                    className={shake ? 'shake' : ''}
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16, padding: "48px 40px",
                        width: "min(420px, 90vw)", textAlign: "center",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
                    }}
                >
                    <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: "linear-gradient(225deg, #004e92, #000d7a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 8px 24px rgba(0,78,146,0.4)",
                    }}>
                        <Lock size={26} color="#fff" />
                    </div>

                    <h2 style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                        Admin Access
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
                        Enter the passphrase to continue
                    </p>

                    <input
                        type="password"
                        className="gate-input"
                        value={pass}
                        onChange={e => { setPass(e.target.value); setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && attempt()}
                        placeholder="Enter passphrase"
                        style={{
                            width: "100%", padding: "13px 16px",
                            borderRadius: 8, fontSize: 15,
                            background: "rgba(0,0,0,0.4)",
                            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            color: "rgba(255,255,255,0.85)",
                            outline: "none", marginBottom: 12,
                            fontFamily: "Poppins, sans-serif",
                            boxSizing: "border-box",
                            transition: "border 200ms",
                        }}
                    />

                    {error && (
                        <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12, textAlign: "left" }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={attempt}
                        className="gate-btn"
                        style={{
                            width: "100%", padding: "13px",
                            background: "linear-gradient(225deg, #004e92, #000d7a)",
                            border: "none", borderRadius: 8,
                            color: "#fff", fontSize: 15, fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                        }}
                    >
                        Enter Admin Panel
                    </button>
                </div>
            </div>
        </>
    );
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    const [unlocked, setUnlocked] = useState(
        sessionStorage.getItem('admin_unlocked') === 'true'
    );

    // ✅ Live state — reads from localStorage (written by AdminUsers/AdminEvents)
    const [liveUsers, setLiveUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('admin_users');
            return saved
                ? JSON.parse(saved)
                : allUsers.map(u => ({ ...u, status: u.status === 'suspended' ? 'suspended' : 'active' }));
        } catch { return allUsers; }
    });

    const [liveEvents, setLiveEvents] = useState(() => {
        try {
            const saved = localStorage.getItem('admin_events');
            return saved
                ? JSON.parse(saved)
                : dummyEvents.map(e => ({ ...e, status: isEventEnded(e.date) ? 'Ended' : 'Open' }));
        } catch {
            return dummyEvents.map(e => ({ ...e, status: isEventEnded(e.date) ? 'Ended' : 'Open' }));
        }
    });

    const handleUnlock = () => {
        sessionStorage.setItem('admin_unlocked', 'true');
        const adminUser = { id: 'admin-1', name: 'Admin', email: 'admin@sponza.com', role: 'admin' };
        localStorage.setItem('sponza_auth', JSON.stringify(adminUser));
        setUser(adminUser);
        setUnlocked(true);
    };

    useEffect(() => {
        if (!unlocked) return;
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            const parsed = JSON.parse(auth);
            if (parsed.role === 'admin') setUser(parsed);
        }

        // ✅ Re-read live data every time dashboard mounts or gets focus
        const syncData = () => {
            const savedUsers = localStorage.getItem('admin_users');
            if (savedUsers) setLiveUsers(JSON.parse(savedUsers));

            const savedEvents = localStorage.getItem('admin_events');
            if (savedEvents) setLiveEvents(JSON.parse(savedEvents));
        };

        syncData();
        window.addEventListener('focus', syncData);
        return () => window.removeEventListener('focus', syncData);
    }, [unlocked]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard',     icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users',  icon: Users,           page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar,        page: 'AdminEvents' },
        { label: 'Sponsorships',  icon: FileText,        page: 'AdminSponsorships' },
        { label: 'Reports',       icon: BarChart3,       page: 'AdminReports' },
    ];

    // ✅ Live computed stats from liveUsers + liveEvents
    const totalUsers      = liveUsers.length;
    const activeUsers     = liveUsers.filter(u => u.status === 'active').length;
    const suspendedUsers  = liveUsers.filter(u => u.status === 'suspended').length;
    const collegeCount    = liveUsers.filter(u => u.role === 'college').length;
    const sponsorCount    = liveUsers.filter(u => u.role === 'sponsor').length;

    const totalEvents     = liveEvents.length;
    const activeEvents    = liveEvents.filter(e => e.status === 'Open').length;
    const endedEvents     = liveEvents.filter(e => e.status === 'Ended').length;

    const totalSponsorship = dummyPaymentRecords.reduce((sum, p) => sum + p.amount, 0);
    const pendingApprovals = dummySponsorshipRequests.filter(r => r.status === 'pending').length;

    const stats = [
        {
            title: 'Total Users',
            value: totalUsers.toLocaleString(),
            icon: Users,
            iconBg: 'bg-blue-100',
            change: `${suspendedUsers} suspended`,
            trend: 'up'
        },
        {
            title: 'Total Events',
            value: totalEvents.toString(),
            icon: Calendar,
            iconBg: 'bg-green-100',
            change: `${activeEvents} open`,
            trend: 'up'
        },
        {
            title: 'Total Sponsorship',
            value: `₹${(totalSponsorship / 1000).toFixed(0)}K`,
            icon: DollarSign,
            iconBg: 'bg-orange-100',
            change: '+25%',
            trend: 'up'
        },
        {
            title: 'Pending Approvals',
            value: pendingApprovals.toString(),
            icon: AlertCircle,
            iconBg: 'bg-red-100'
        },
    ];

    const recentUsers  = liveUsers.slice(0, 5);
    const recentEvents = liveEvents.slice(0, 4);

    if (!unlocked) return <PassphraseGate onUnlock={handleUnlock} />;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar
                items={sidebarItems}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                userRole="admin"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="AdminPanel"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Admin Dashboard</h1>
                            <p className="text-slate-600 mt-1">Platform overview and management</p>
                        </div>

                        {/* ✅ Live Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <StatsCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-8">

                            {/* ✅ Live User Distribution */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">User Distribution</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1F2937]">Colleges</p>
                                                <p className="text-sm text-slate-500">{collegeCount} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#1E3A8A]">
                                            {totalUsers > 0 ? Math.round(collegeCount / totalUsers * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${totalUsers > 0 ? collegeCount / totalUsers * 100 : 0}%` }} />
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1F2937]">Sponsors</p>
                                                <p className="text-sm text-slate-500">{sponsorCount} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#22C55E]">
                                            {totalUsers > 0 ? Math.round(sponsorCount / totalUsers * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${totalUsers > 0 ? sponsorCount / totalUsers * 100 : 0}%` }} />
                                    </div>

                                    {/* ✅ Suspended users indicator */}
                                    {suspendedUsers > 0 && (
                                        <>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[#1F2937]">Suspended</p>
                                                        <p className="text-sm text-slate-500">{suspendedUsers} accounts</p>
                                                    </div>
                                                </div>
                                                <span className="text-2xl font-bold text-red-500">
                                                    {Math.round(suspendedUsers / totalUsers * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${suspendedUsers / totalUsers * 100}%` }} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>

                            {/* ✅ Live Event Status */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Event Status</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-xl">
                                        <p className="text-sm text-green-700 mb-1">Open Events</p>
                                        <p className="text-3xl font-bold text-green-600">{activeEvents}</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl">
                                        <p className="text-sm text-red-700 mb-1">Ended Events</p>
                                        <p className="text-3xl font-bold text-red-500">{endedEvents}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-xl">
                                        <p className="text-sm text-yellow-700 mb-1">Pending Review</p>
                                        <p className="text-3xl font-bold text-yellow-600">{pendingApprovals}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <p className="text-sm text-blue-700 mb-1">Total Events</p>
                                        <p className="text-3xl font-bold text-blue-600">{totalEvents}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">

                            {/* ✅ Live Recent Users */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Users</h2>
                                    <Link to={createPageUrl('AdminUsers')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentUsers.map(u => (
                                        <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    u.role === 'college' ? 'bg-blue-100' : 'bg-green-100'
                                                }`}>
                                                    {u.role === 'college'
                                                        ? <GraduationCap className="w-5 h-5 text-blue-600" />
                                                        : <Building2 className="w-5 h-5 text-green-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1F2937]">{u.name}</p>
                                                    <p className="text-sm text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                            {/* ✅ Live status badge */}
                                            <Badge className={
                                                u.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }>
                                                {u.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* ✅ Live Recent Events */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Events</h2>
                                    <Link to={createPageUrl('AdminEvents')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentEvents.map(event => (
                                        <div key={event.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-[#1F2937]">{event.title}</p>
                                                <p className="text-sm text-slate-500">{event.college}</p>
                                            </div>
                                            {/* ✅ Live status badge */}
                                            <Badge className={
                                                event.status === 'Ended'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }>
                                                {event.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}