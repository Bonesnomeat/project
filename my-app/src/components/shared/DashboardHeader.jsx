import React, { useState, useEffect } from 'react';
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
import { Menu, Bell, Settings, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

export default function DashboardHeader({ user, onLogout, onMenuClick, settingsPage }) {

    // ✅ Local state that holds the latest user data
    const [currentUser, setCurrentUser] = useState(user);

    // ✅ Re-read from localStorage whenever user prop changes
    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            setCurrentUser(JSON.parse(auth));
        }
    }, [user]);

    // ✅ Poll localStorage every second to detect avatar changes from settings page
    useEffect(() => {
        const interval = setInterval(() => {
            const auth = localStorage.getItem('sponza_auth');
            if (auth) {
                const parsed = JSON.parse(auth);
                if (parsed.avatar !== currentUser?.avatar) {
                    setCurrentUser(parsed);
                }
            }
        }, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [currentUser]);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    {/* ✅ Use currentUser instead of user */}
                    <h2 className="font-semibold text-[#1F2937]">Welcome back, {currentUser?.name || 'User'}</h2>
                    <p className="text-sm text-slate-500 capitalize">{currentUser?.role} Account</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                {/* ✅ Uses currentUser.avatar so it updates after Save Changes */}
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
                                {/* ✅ Uses currentUser for name and email */}
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