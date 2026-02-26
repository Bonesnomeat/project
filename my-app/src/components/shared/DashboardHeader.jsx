import React, { useState, useEffect, useRef } from 'react';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "C:/Users/USER/sponza/project/my-app/src/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "C:/Users/USER/sponza/project/my-app/src/components/ui/dropdown-menu";
import { Menu, Bell, Settings, LogOut, User, CheckCheck, Calendar, CreditCard, FileText, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

// ── Icon map ──
const ICON_MAP = { FileText, CreditCard, Calendar, Star, Bell, ShieldCheck };
const getIcon  = (type) => ICON_MAP[type] || Bell;

// ── Role-specific default notifications ──
const DEFAULT_NOTIFICATIONS = {
    college: [
        { id: 1, iconType: 'FileText',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   title: 'New sponsorship request', desc: 'TechCorp wants to sponsor "Cognizance 2025"', time: '2 min ago',  read: false },
        { id: 2, iconType: 'CreditCard', iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Payment received',        desc: '₹50,000 received from Infosys Ltd.',           time: '1 hr ago',   read: false },
        { id: 3, iconType: 'Calendar',   iconColor: 'text-orange-600', iconBg: 'bg-orange-50', title: 'Event approaching',       desc: '"Techfest 2025" is in 3 days',                 time: '3 hr ago',   read: false },
        { id: 4, iconType: 'Star',       iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50', title: 'New review received',     desc: 'Sponsor left a 5-star review for your event',  time: 'Yesterday',  read: true  },
        { id: 5, iconType: 'FileText',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   title: 'Application status',     desc: 'Your event "Robofest" is now live',            time: '2 days ago', read: true  },
    ],
    sponsor: [
        { id: 1, iconType: 'FileText',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   title: 'Application accepted',    desc: 'IIT Bombay accepted your sponsorship offer',  time: '5 min ago',  read: false },
        { id: 2, iconType: 'Calendar',   iconColor: 'text-orange-600', iconBg: 'bg-orange-50', title: 'Event starting soon',     desc: '"Cognizance 2025" starts in 2 days',          time: '2 hr ago',   read: false },
        { id: 3, iconType: 'CreditCard', iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Payment confirmed',       desc: 'Your payment of ₹1,00,000 was processed',     time: '4 hr ago',   read: false },
        { id: 4, iconType: 'Star',       iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50', title: 'New event match',         desc: 'A new tech event matches your preferences',   time: 'Yesterday',  read: true  },
        { id: 5, iconType: 'FileText',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   title: 'Application rejected',   desc: 'NIT Trichy declined your sponsorship offer',  time: '3 days ago', read: true  },
    ],
    admin: [
        { id: 1, iconType: 'ShieldCheck',iconColor: 'text-purple-600', iconBg: 'bg-purple-50', title: 'New college registered',  desc: 'IIT Delhi registered on Sponza',              time: '1 min ago',  read: false },
        { id: 2, iconType: 'ShieldCheck',iconColor: 'text-purple-600', iconBg: 'bg-purple-50', title: 'New sponsor registered',  desc: 'Reliance Industries joined as a sponsor',     time: '10 min ago', read: false },
        { id: 3, iconType: 'CreditCard', iconColor: 'text-green-600',  iconBg: 'bg-green-50',  title: 'Transaction flagged',     desc: 'Suspicious payment of ₹5,00,000 detected',   time: '1 hr ago',   read: false },
        { id: 4, iconType: 'FileText',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',   title: 'Dispute raised',          desc: 'College reported a payment issue',            time: 'Yesterday',  read: true  },
        { id: 5, iconType: 'Star',       iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50', title: 'Platform report ready',   desc: 'Monthly analytics report is available',       time: '2 days ago', read: true  },
    ],
};

// ── Role-specific localStorage key ──
const getStorageKey = (role) => `sponza_notifications_${role || 'guest'}`;

function loadFromStorage(role) {
    const key = getStorageKey(role);
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
    } catch {}
    // Seed role-specific defaults on first visit
    const defaults = DEFAULT_NOTIFICATIONS[role] || [];
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
}

function saveToStorage(role, notifs) {
    localStorage.setItem(getStorageKey(role), JSON.stringify(notifs));
}

export default function DashboardHeader({ user, onLogout, onMenuClick, settingsPage }) {
    const [currentUser, setCurrentUser]     = useState(user);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs]       = useState(false);
    const notifRef   = useRef(null);
    const userRole   = currentUser?.role || user?.role;

    const unreadCount = notifications.filter(n => !n.read).length;

    // Load role-specific notifications on mount / role change
    useEffect(() => {
        if (userRole) {
            setNotifications(loadFromStorage(userRole));
        }
    }, [userRole]);

    // Re-read user from localStorage when user prop changes
    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (auth) setCurrentUser(JSON.parse(auth));
    }, [user]);

    // Poll localStorage every second — syncs only THIS role's notifications
    useEffect(() => {
        const interval = setInterval(() => {
            // Sync avatar
            const auth = localStorage.getItem('sponza_auth');
            if (auth) {
                const parsed = JSON.parse(auth);
                if (parsed.avatar !== currentUser?.avatar) setCurrentUser(parsed);
            }
            // ✅ Only reads THIS role's key — completely isolated from other roles
            if (userRole) {
                const raw = localStorage.getItem(getStorageKey(userRole));
                if (raw) {
                    try {
                        const stored = JSON.parse(raw);
                        setNotifications(prev => {
                            const changed = JSON.stringify(prev) !== JSON.stringify(stored);
                            return changed ? stored : prev;
                        });
                    } catch {}
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [currentUser, userRole]);

    // Close panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── All mutations save to THIS role's key only ──
    const updateNotifs = (updated) => {
        setNotifications(updated);
        saveToStorage(userRole, updated);
    };

    const markAllRead = () => updateNotifs(notifications.map(n => ({ ...n, read: true })));
    const markOneRead = (id) => updateNotifs(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    const deleteOne   = (e, id) => { e.stopPropagation(); updateNotifs(notifications.filter(n => n.id !== id)); };
    const clearAll    = () => updateNotifs([]);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="font-semibold text-[#1F2937]">Welcome back, {currentUser?.name || 'User'}</h2>
                    <p className="text-sm text-slate-500 capitalize">{userRole} Account</p>
                </div>
            </div>

            <div className="flex items-center gap-3">

                {/* ── Bell Notification Button ── */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifs(prev => !prev)}
                        className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Bell className="w-5 h-5 text-slate-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#F97316] rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* ── Notification Panel ── */}
                    {showNotifs && (
                        <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-[#F97316] text-white text-xs rounded-full font-medium">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1 text-xs text-[#1E3A8A] hover:text-[#1E3A8A]/70 font-medium transition-colors"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* List */}
                            <div className="max-h-[380px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <Bell className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No notifications</p>
                                        <p className="text-xs mt-1">You're all caught up!</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => {
                                        const Icon = getIcon(notif.iconType);
                                        return (
                                            <div
                                                key={notif.id}
                                                onClick={() => markOneRead(notif.id)}
                                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 group relative ${
                                                    !notif.read ? 'bg-blue-50/40' : ''
                                                }`}
                                            >
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.iconBg}`}>
                                                    <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notif.read ? 'font-semibold text-[#1F2937]' : 'font-medium text-slate-700'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 rounded-full bg-[#1E3A8A] flex-shrink-0 mt-2" />
                                                )}
                                                <button
                                                    onClick={(e) => deleteOne(e, notif.id)}
                                                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-200 text-slate-500 hidden group-hover:flex items-center justify-center text-xs hover:bg-red-100 hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-3 border-t border-slate-100 text-center">
                                    <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                                        Clear all notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Profile Dropdown ── */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                                <AvatarFallback className="bg-[#1E3A8A] text-white">
                                    {currentUser?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>{currentUser?.name}</span>
                                <span className="text-sm font-normal text-slate-500">{currentUser?.email}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to={createPageUrl(settingsPage)} className="flex items-center cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={createPageUrl(settingsPage)} className="flex items-center cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}