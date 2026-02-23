import React from 'react';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { cn } from "C:/Users/USER/sponza/project/my-app/src/lib/utils";

export default function StatsCard({ title, value, change, icon: Icon, iconBg, trend }) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-[#1F2937] mt-2">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className={cn(
                                "text-sm font-medium",
                                trend === 'up' ? "text-[#22C55E]" : "text-red-500"
                            )}>
                                {trend === 'up' ? '↑' : '↓'} {change}
                            </span>
                            <span className="text-sm text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    iconBg || "bg-[#1E3A8A]/10"
                )}>
                    <Icon className={cn(
                        "w-6 h-6",
                        iconBg?.includes('green') ? "text-[#22C55E]" : 
                        iconBg?.includes('orange') ? "text-[#F97316]" : "text-[#1E3A8A]"
                    )} />
                </div>
            </div>
        </Card>
    );
}
