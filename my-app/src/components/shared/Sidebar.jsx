import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "C:/Users/USER/sponza/project/my-app/src/lib/utils";
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import logoSrc from 'C:/Users/USER/sponza/project/my-app/public/img/sponza_logo_dark_blue.png';

export default function Sidebar({ items, collapsed, setCollapsed, userRole }) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {/* Mobile Overlay */}
            {!collapsed && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 transition-all duration-300",
                collapsed ? "w-0 lg:w-20 overflow-hidden lg:overflow-visible" : "w-72"
            )}>
                <div className={cn("flex flex-col h-full", collapsed && "lg:items-center")}>

                    {/* Logo */}
                    <div className={cn(
                        "h-16 flex items-center border-b border-slate-100 px-4",
                        collapsed && "lg:justify-center lg:px-0"
                    )}>
                        <Link to={createPageUrl('Home')} className="flex items-center">
                            {collapsed ? (
                                // ✅ Small square logo when collapsed
                                <img
                                    src={logoSrc}
                                    alt="Sponza"
                                    style={{ width: 36, height: 36, objectFit: "contain" }}
                                />
                            ) : (
                                // ✅ Full wide logo when expanded
                                <img
                                    src={logoSrc}
                                    alt="Sponza"
                                    style={{ width: 140, height: "auto", objectFit: "contain" }}
                                />
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 overflow-y-auto">
                        <div className="space-y-1">
                            {items.map((item) => {
                                const isActive = currentPath === createPageUrl(item.page);
                                return (
                                    <Link
                                        key={item.page}
                                        to={createPageUrl(item.page)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                            isActive 
                                                ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20" 
                                                : "text-slate-600 hover:bg-slate-100",
                                            collapsed && "lg:justify-center lg:px-0"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 flex-shrink-0",
                                            isActive ? "text-white" : "text-slate-500"
                                        )} />
                                        {!collapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Collapse Toggle */}
                    <div className="hidden lg:block p-3 border-t border-slate-100">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            {collapsed ? (
                                <ChevronRight className="w-5 h-5" />
                            ) : (
                                <>
                                    <ChevronLeft className="w-5 h-5" />
                                    <span className="font-medium">Collapse</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
}