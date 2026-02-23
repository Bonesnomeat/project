import React from 'react';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

export default function EventCard({ event, showApplyButton, onApply }) {
    const categoryColors = {
        'Tech': 'bg-blue-100 text-blue-700',
        'Cultural': 'bg-purple-100 text-purple-700',
        'Sports': 'bg-green-100 text-green-700',
        'Workshop': 'bg-orange-100 text-orange-700',
        'Conference': 'bg-indigo-100 text-indigo-700',
    };

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <Badge className={categoryColors[event.category] || 'bg-slate-100 text-slate-700'}>
                        {event.category}
                    </Badge>
                </div>
                {event.featured && (
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-[#F97316] text-white">Featured</Badge>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2 line-clamp-1">
                    {event.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{event.expectedAttendees} expected attendees</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-400">Sponsorship from</p>
                        <p className="text-lg font-bold text-[#22C55E]">
                            ${event.minSponsorship?.toLocaleString()}
                        </p>
                    </div>
                    {showApplyButton ? (
                        <Button 
                            onClick={() => onApply?.(event)}
                            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                        >
                            Apply Now
                        </Button>
                    ) : (
                        <Link to={createPageUrl('EventDetails') + `?id=${event.id}`}>
                            <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white">
                                View Details
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </Card>
    );
}
