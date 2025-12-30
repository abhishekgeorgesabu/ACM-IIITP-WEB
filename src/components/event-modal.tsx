'use client';

import * as React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Event } from './event-card';

interface EventModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    // Filter out the main image if it's also in the gallery (optional logic, 
    // but assuming gallery contains *additional* images mostly, or all including main).
    // If gallery is empty, we might show just main image or nothing.
    const images = event.gallery && event.gallery.length > 0 ? event.gallery : [event.image];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden flex flex-col bg-card">
                <div className="max-h-[85vh] w-full overflow-y-auto">
                    <div className="flex flex-col gap-6 p-6">

                        <DialogHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Badge variant="outline" className="mb-2">{event.month} {event.day}</Badge>
                                    <DialogTitle className="text-2xl md:text-3xl font-headline font-bold">
                                        {event.title}
                                    </DialogTitle>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date}</span>
                                </div>
                                {event.time && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{event.time}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Carousel Section */}
                        <div className="w-full relative rounded-xl overflow-hidden bg-muted/20 border border-border">
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent>
                                    {images.map((img, index) => (
                                        <CarouselItem key={index} className="basis-full">
                                            <div className="relative aspect-video w-full">
                                                <Image
                                                    src={img}
                                                    alt={`${event.title} image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4" />
                                        <CarouselNext className="right-4" />
                                    </>
                                )}
                            </Carousel>
                        </div>

                        {/* Description Section */}
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                            {event.description.split('\n').map((line, index) => {
                                if (line.startsWith('### ')) {
                                    return (
                                        <h3 key={index} className="text-xl font-headline font-bold mt-6 mb-3 text-primary">
                                            {line.replace('### ', '')}
                                        </h3>
                                    );
                                }
                                if (line.startsWith('#### ')) {
                                    return (
                                        <h4 key={index} className="text-lg font-headline font-semibold mt-4 mb-2">
                                            {line.replace('#### ', '')}
                                        </h4>
                                    );
                                }
                                if (line.trim() === '') {
                                    return <br key={index} />;
                                }
                                return (
                                    <p key={index} className="mb-2 leading-relaxed text-base">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
