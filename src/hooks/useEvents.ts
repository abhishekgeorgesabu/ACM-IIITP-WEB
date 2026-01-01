
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Event } from '@/components/event-card';

// Extended Event interface to match Supabase schema if needed, but for now we follow the component's interface
// We might need to map snake_case from DB to camelCase for the component

// Simple in-memory cache
let eventCache: { data: Event[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useEvents() {
    const [events, setEvents] = useState<Event[]>(eventCache ? eventCache.data : []);
    const [loading, setLoading] = useState(!eventCache); // If we have cache, we are not "loading" initially
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            // If cache is fresh, we don't need to fetch
            if (eventCache && (Date.now() - eventCache.timestamp < CACHE_DURATION)) {
                setLoading(false);
                return;
            }

            try {
                // If we don't have cache, show loading
                if (!eventCache) setLoading(true);

                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .order('created_at', { ascending: false }); // Or sort by 'date' if you parse it

                if (error) throw error;

                if (data) {
                    // Map DB keys to Component keys if necessary (snake_case to camelCase)
                    // The schema we used has lower case and some snake_case.
                    // The Event interface expects: id, title, date, month, day, time, location, image, description, isFeatured (optional), status, gallery?
                    // DB has: id, title, date, month, day, time, location, image, description, is_featured, status, gallery, register_link

                    const mappedEvents: Event[] = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        date: item.date,
                        month: item.month,
                        day: item.day,
                        time: item.time,
                        location: item.location,
                        image: item.image,
                        description: item.description,
                        isFeatured: item.is_featured,
                        status: item.status,
                        gallery: item.gallery,
                        registerLink: item.register_link,
                        galleryLink: item.gallery_link,
                    }));

                    // Sort by parsed date if possible, otherwise rely on created_at or just array order
                    // Existing logic sorted by date string. Let's try to maintain that if possible.
                    const sortedEvents = mappedEvents.sort((a, b) => {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });

                    setEvents(sortedEvents);

                    // Update Cache
                    eventCache = {
                        data: sortedEvents,
                        timestamp: Date.now()
                    };
                }
            } catch (err: any) {
                console.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return { events, loading, error };
}
