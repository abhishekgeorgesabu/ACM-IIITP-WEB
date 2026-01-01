
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    link_text?: string;
    link_url?: string;
    order_index: number;
}

// Simple in-memory cache
let faqCache: { data: FAQ[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFAQs() {
    const [faqs, setFaqs] = useState<FAQ[]>(faqCache ? faqCache.data : []);
    const [loading, setLoading] = useState(!faqCache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFAQs() {
            // Check cache freshness
            if (faqCache && (Date.now() - faqCache.timestamp < CACHE_DURATION)) {
                setLoading(false);
                return;
            }

            try {
                if (!faqCache) setLoading(true);

                const { data, error } = await supabase
                    .from('membership_faqs')
                    .select('*')
                    .order('order_index', { ascending: true })
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) {
                    setFaqs(data);
                    // Update Cache
                    faqCache = {
                        data,
                        timestamp: Date.now()
                    };
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFAQs();
    }, []);

    return { faqs, loading, error };
}
