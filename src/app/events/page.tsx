
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EventCard } from '@/components/event-card';
import { EventHero } from '@/components/event-hero';
import { useEvents } from '@/hooks/useEvents';
import { Loader2 } from 'lucide-react';

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Failed to load events. Please try again later.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredEvent = events.find(e => e.isFeatured) || events[0];
  const gridEvents = events;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* Featured Event Section */}
        {featuredEvent && (
          <section className="relative">
            <EventHero event={featuredEvent} />
          </section>
        )}

        {/* All Events Grid */}
        <section className="container mx-auto px-4 md:px-6 py-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">All Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
