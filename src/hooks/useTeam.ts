import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    category: string;
    bio: string;
    image_url: string;
}

// Simple in-memory cache
let teamCache: { data: TeamMember[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useTeam() {
    const [team, setTeam] = useState<TeamMember[]>(teamCache ? teamCache.data : []);
    const [loading, setLoading] = useState(!teamCache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTeam() {
            // Check cache freshness
            if (teamCache && (Date.now() - teamCache.timestamp < CACHE_DURATION)) {
                setLoading(false);
                return;
            }

            try {
                if (!teamCache) setLoading(true);

                const { data, error } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('order_index', { ascending: true })
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) {
                    setTeam(data);
                    // Update Cache
                    teamCache = {
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

        fetchTeam();
    }, []);

    return { team, loading, error };
}
