import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mic, Award, Code } from 'lucide-react';

const pastEvents = [
  { title: '--- ', date: '-----, 2025', description: '', icon: Award },
  { title: '', date: '----- 2025', description: '', icon: Code },
  { title: '', date: '----- 2025', description: '', icon: Mic },
];

const futureEvents = [
  { title: 'ABC 1.0', date: 'October 26, 2025', description: 'Our flagship annual coding competition with exciting prizes and challenging problems.', icon: Award },
  { title: 'Intro to Web Dev Workshop', date: 'November 12, 2025', description: 'A beginner-friendly workshop covering the basics of HTML, CSS, and JavaScript.', icon: Code },
  { title: 'Alumni Tech Talk: AI in Fintech', date: 'November 28, 2025', description: 'An insightful session with an industry expert from our alumni network.', icon: Mic },
];

const EventCard = ({ event }: { event: { title: string, date: string, description: string, icon: React.ElementType } }) => (
    <div className="pl-8 relative before:absolute before:left-[10px] before:top-4 before:h-full before:w-[2px] before:bg-border last:before:hidden">
        <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <event.icon className="h-4 w-4" />
        </div>
        <div className="mb-8">
            <h3 className="text-xl font-headline font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><Calendar className="h-4 w-4" /> {event.date}</p>
            <p className="text-muted-foreground">{event.description}</p>
        </div>
    </div>
);

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
                <Button asChild variant="outline">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
                </Button>
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-16">
              Events Timeline
            </h1>

            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-3xl font-headline font-bold mb-8 text-center md:text-left">Upcoming Events</h2>
                    <div className="relative">
                        {futureEvents.map((event, index) => <EventCard key={index} event={event} />)}
                    </div>
                </div>
                 <div>
                    <h2 className="text-3xl font-headline font-bold mb-8 text-center md:text-left">Past Events</h2>
                    <div className="relative">
                        {pastEvents.map((event, index) => <EventCard key={index} event={event} />)}
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
