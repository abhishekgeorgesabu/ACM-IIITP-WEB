import fs from 'fs';
import path from 'path';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EventCard, Event } from '@/components/event-card';
import { EventHero } from '@/components/event-hero';
import { eventsData } from '@/data/events';


// Helper to get gallery images
function getEventGallery(eventId: string): string[] {
  const galleryDir = path.join(process.cwd(), 'public', 'events', `event_${eventId}`);

  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  const files = fs.readdirSync(galleryDir);

  const images = files
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);
      return numA - numB;
    })
    .map(file => `/events/event_${eventId}/${file}`);

  return images;
}

export default function EventsPage() {
  // Enrich events with gallery data
  const enrichedEvents = eventsData.map(event => ({
    ...event,
    gallery: getEventGallery(event.id),
    // Fallback if image path assumes old structure but folder exists
    image: fs.existsSync(path.join(process.cwd(), 'public', `events/event_${event.id}/1.jpg`))
      ? `/events/event_${event.id}/1.jpg`
      : (fs.existsSync(path.join(process.cwd(), 'public', `events/event_${event.id}/1.png`))
        ? `/events/event_${event.id}/1.png`
        : event.image)
  }));

  // Sort events by date descending (latest first)
  const sortedEvents = [...enrichedEvents].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const featuredEvent = sortedEvents[0];
  // User wants ALL events in the grid, including the hero event
  const gridEvents = sortedEvents;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* Featured Event Section */}
        <section className="relative">
          {/* You might want a background for the whole section or just let the hero handle it */}
          <EventHero event={featuredEvent} />
        </section>

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
