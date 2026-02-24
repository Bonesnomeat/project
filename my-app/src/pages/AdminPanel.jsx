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

import { dummyAdminStats, allUsers, dummyEvents } 
from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

const SECRET = 'sponza123';

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

                    <h2 style={{
                        color: "rgba(255,255,255,0.9)", fontSize: 22,
                        fontWeight: 700, marginBottom: 6,
                    }}>
                        Admin Access
                    </h2>
                    <p style={{
                        color: "rgba(255,255,255,0.4)", fontSize: 13,
                        marginBottom: 28,
                    }}>
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
                        <p style={{
                            color: "#f87171", fontSize: 13,
                            marginBottom: 12, textAlign: "left",
                        }}>
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

    // ✅ Check sessionStorage on load so refresh doesn't re-lock
    const [unlocked, setUnlocked] = useState(
        sessionStorage.getItem('admin_unlocked') === 'true'
    );

    // ✅ Save to sessionStorage + localStorage when unlocked
    const handleUnlock = () => {
        sessionStorage.setItem('admin_unlocked', 'true');
        const adminUser = {
            id: 'admin-1',
            name: 'Admin',
            email: 'admin@sponza.com',
            role: 'admin',
        };
        localStorage.setItem('sponza_auth', JSON.stringify(adminUser));
        setUser(adminUser);
        setUnlocked(true);
    };

    useEffect(() => {
        if (unlocked) {
            const auth = localStorage.getItem('sponza_auth');
            if (auth) {
                const parsed = JSON.parse(auth);
                if (parsed.role === 'admin') {
                    setUser(parsed);
                }
            }
        }
    }, [unlocked]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked'); // ✅ Clear session on logout
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users', icon: Users, page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar, page: 'AdminEvents' },
        { label: 'Sponsorships', icon: FileText, page: 'AdminSponsorships' },
        { label: 'Reports', icon: BarChart3, page: 'AdminReports' },
    ];

    const stats = [
        { title: 'Total Users', value: dummyAdminStats.totalUsers.toLocaleString(), icon: Users, iconBg: 'bg-blue-100', change: '+12%', trend: 'up' },
        { title: 'Total Events', value: dummyAdminStats.totalEvents.toString(), icon: Calendar, iconBg: 'bg-green-100', change: '+8%', trend: 'up' },
        { title: 'Total Sponsorship', value: `$${(dummyAdminStats.totalSponsorship / 1000000).toFixed(1)}M`, icon: DollarSign, iconBg: 'bg-orange-100', change: '+25%', trend: 'up' },
        { title: 'Pending Approvals', value: dummyAdminStats.pendingApprovals.toString(), icon: AlertCircle, iconBg: 'bg-red-100' },
    ];

    const recentUsers = allUsers.slice(0, 5);
    const recentEvents = dummyEvents.slice(0, 4);

    // ✅ Show gate if not unlocked
    if (!unlocked) {
        return <PassphraseGate onUnlock={handleUnlock} />;
    }

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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, i) => (
                                <StatsCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
                                                <p className="text-sm text-slate-500">{dummyAdminStats.totalColleges} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#1E3A8A]">
                                            {Math.round(dummyAdminStats.totalColleges / dummyAdminStats.totalUsers * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${dummyAdminStats.totalColleges / dummyAdminStats.totalUsers * 100}%` }} />
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1F2937]">Sponsors</p>
                                                <p className="text-sm text-slate-500">{dummyAdminStats.totalSponsors} registered</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-[#22C55E]">
                                            {Math.round(dummyAdminStats.totalSponsors / dummyAdminStats.totalUsers * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${dummyAdminStats.totalSponsors / dummyAdminStats.totalUsers * 100}%` }} />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Event Status</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-xl">
                                        <p className="text-sm text-green-700 mb-1">Active Events</p>
                                        <p className="text-3xl font-bold text-green-600">{dummyAdminStats.activeEvents}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-slate-600 mb-1">Completed</p>
                                        <p className="text-3xl font-bold text-slate-700">{dummyAdminStats.completedEvents}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-xl">
                                        <p className="text-sm text-yellow-700 mb-1">Pending Review</p>
                                        <p className="text-3xl font-bold text-yellow-600">{dummyAdminStats.pendingApprovals}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <p className="text-sm text-blue-700 mb-1">Total Events</p>
                                        <p className="text-3xl font-bold text-blue-600">{dummyAdminStats.totalEvents}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Users</h2>
                                    <Link to={createPageUrl('AdminUsers')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentUsers.map((u) => (
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
                                            <Badge>{u.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-[#1F2937]">Recent Events</h2>
                                    <Link to={createPageUrl('AdminEvents')}>
                                        <Button variant="ghost" className="text-[#1E3A8A]">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentEvents.map((event) => (
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
                                            <Badge variant="outline">{event.category}</Badge>
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