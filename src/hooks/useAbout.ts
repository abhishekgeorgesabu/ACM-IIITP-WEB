import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface AboutData {
    id: number;
    title: string;
    content: string;
    membership_title?: string;
}

// Simple in-memory cache
let aboutCache: { data: AboutData, timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAbout() {
    const [aboutData, setAboutData] = useState<AboutData | null>(aboutCache ? aboutCache.data : null);
    const [loading, setLoading] = useState(!aboutCache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAbout() {
            if (aboutCache && (Date.now() - aboutCache.timestamp < CACHE_DURATION)) {
                setLoading(false);
                return;
            }

            try {
                // Try to get the existing row
                let { data, error } = await supabase
                    .from('about_info')
                    .select('*')
                    .single();

                if (error && error.code === 'PGRST116') {
                    // Row not found
                    setAboutData(null);
                } else if (data) {
                    setAboutData(data);
                    aboutCache = {
                        data,
                        timestamp: Date.now()
                    };
                } else {
                    setError(error?.message || 'Failed to fetch about info');
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAbout();
    }, []);

    return { aboutData, loading, error };
}
