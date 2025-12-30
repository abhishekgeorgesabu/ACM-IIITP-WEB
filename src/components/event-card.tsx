'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventModal } from './event-modal';

export interface Event {
    id: string;
    title: string;
    date: string; // Full date string e.g., "Thursday, March 14"
    time?: string;
    month: string; // Short month e.g., "MAR"
    day: string; // Day number e.g., "14"
    location: string;
    image: string;
    description: string;
    isFeatured?: boolean;
    gallery?: string[];
    registerLink?: string; // Optional link for future events
    status: 'upcoming' | 'past';
}

export function EventCard({ event }: { event: Event }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Date Logic
    // Assuming event.date is parseable or we rely on user providing a clean ISO date or similar.
    // Ideally, we'd have a separate 'isoDate' field, but let's try to parse the 'date' string if possible,
    // or default to "Know More" (past) if parsing fails or if it's strictly for display.
    // Strategy: Let's assume events are past unless strictly flagged or dated in future.
    // For now, let's look for a year in the date string to guess.
    const isFuture = event.status === 'upcoming';

    // NOTE: Simple check. If date string is "Thursday, November 20, 2025", JS Date parsing usually works.

    return (
        <>
            <div className="group relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all hover:border-primary/50 hover:shadow-lg flex flex-col h-full">
                {/* Image Section - Top 70% */}
                <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold border border-border">
                        {event.date.split(',')[0]}
                    </div>
                </div>

                {/* Content Section - Bottom 30% */}
                <div className="flex flex-col flex-1 p-5 bg-card relative z-20">
                    <h3 className="text-xl font-headline font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{event.date}</span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {event.description}
                    </p>

                    {isFuture ? (
                        <Button
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => window.open(event.registerLink || '#', '_blank')}
                        >
                            Register Now
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Know More
                        </Button>
                    )}
                </div>
            </div>

            <EventModal
                event={event}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

