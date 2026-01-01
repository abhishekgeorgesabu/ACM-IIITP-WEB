
'use client';


import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog"

// Note: If react-markdown is not installed, we might need to render description as text or use a simple parser.
// The original code rendered description inside a modal, likely as text or simple HTML.
// Let's assume text for now or simple whitespace handling.

interface EventDetails {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    description: string;
    gallery: string[];
    register_link?: string;
    galleryLink?: string; // Mapped from gallery_link in useEvents, but here we fetch raw from DB so likely snake_case if we don't map.
    // Actually, in EventContent we fetch `*`. 
    // Supabase returns `gallery_link`.
    // We should add `gallery_link` to this interface and use that.
    gallery_link?: string;
    status: string;
}

function EventContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvent() {
            if (!id) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setEvent(data as EventDetails);
            }
            setLoading(false);
        }

        fetchEvent();
    }, [id]);

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!event) {
        return <div className="flex h-[50vh] items-center justify-center">Event not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-black/90 border-none">
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    <div className="relative w-full h-full">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Event Image"
                                fill
                                className="object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div
                className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8 shadow-2xl cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setSelectedImage(event.image)}
            >
                <Image
                    src={event.image || '/placeholder.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">{event.title}</h1>

            <div className="flex flex-wrap gap-6 mb-8 text-muted-foreground bg-secondary/30 p-6 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-medium">{event.date}</span>
                </div>
                {event.time && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">{event.time}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">{event.location}</span>
                </div>
                {(event.status === 'upcoming' || event.status === 'ongoing') && event.register_link && (
                    <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto">
                        <Button size="lg" className="w-full md:w-auto" onClick={() => window.open(event.register_link, '_blank')}>
                            Register Now
                        </Button>
                    </div>
                )}
            </div>

            <div className="mb-12">
                {(() => {
                    try {
                        // Check if description is JSON structure
                        const desc = event.description || '';
                        if (desc.startsWith('[')) {
                            const sections = JSON.parse(desc);
                            if (Array.isArray(sections)) {
                                return sections.map((section: any, idx: number) => (
                                    <div key={idx} className="mb-8 last:mb-0">
                                        <h3 className="text-2xl font-bold font-headline mb-4 text-primary">{section.heading}</h3>
                                        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                                            {section.content?.split('\n').map((line: string, i: number) => (
                                                <p key={i} className="mb-2 last:mb-0">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ));
                            }
                        }
                        // Fallback for legacy plain text
                        return (
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                {desc.split('\n').map((line, i) => (
                                    <p key={i} className="mb-4">{line}</p>
                                ))}
                            </div>
                        );
                    } catch (e) {
                        // Fallback for error/plain text
                        return (
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                {event.description?.split('\n').map((line, i) => (
                                    <p key={i} className="mb-4">{line}</p>
                                ))}
                            </div>
                        );
                    }
                })()}
            </div>

            {event.gallery && event.gallery.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Event Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {event.gallery.map((img, index) => (
                            <div
                                key={index}
                                className="relative h-64 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {event.gallery_link && (
                <div className="flex justify-center mt-8 mb-12">
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => window.open(event.gallery_link, '_blank')}
                    >
                        View Full Gallery (External) <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            )}

            <div className="flex justify-center mt-12">
                {/* Removed Register Button from here */}
            </div>
        </div>
    );
}

export default function EventViewPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                    <EventContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
