'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from './event-card';
import { EventModal } from './event-modal';

export function EventHero({ event }: { event: Event }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isFuture = event.status === 'upcoming';

    return (
        <>
            <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl mb-16 group">
                {/* Background Image */}
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16">
                    <div className="container mx-auto">
                        <div className="max-w-4xl space-y-6 animate-fade-in-up">

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-white tracking-tight">
                                {event.title}
                            </h1>

                            {/* Details Row */}
                            <div className="flex flex-wrap items-center gap-6 md:gap-10 text-white/90">

                                {/* Date Badge + Info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 min-w-[70px]">
                                        <span className="text-xs font-medium uppercase tracking-wider">{event.month}</span>
                                        <span className="text-2xl font-bold">{event.day}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{event.date}</p>
                                        {event.time && <p className="text-sm text-white/70">{event.time}</p>}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-full text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{event.location}</p>
                                    </div>
                                </div>

                            </div>

                            {/* CTA */}
                            <div className="pt-4">
                                {isFuture ? (
                                    <Button
                                        size="lg"
                                        className="rounded-full px-8 text-lg gap-2"
                                        onClick={() => window.open(event.registerLink || '#', '_blank')}
                                    >
                                        Register Now <ArrowRight className="w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full px-8 text-lg gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Know More <ArrowRight className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>

                        </div>
                    </div>
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

