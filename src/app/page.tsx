
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRive } from '@rive-app/react-webgl2';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Calendar, Users, Award, Briefcase, Lightbulb, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useEvents'; // ADDED HOOK
import { useAbout } from '@/hooks/useAbout';
import { useTeam } from '@/hooks/useTeam';
import { useFAQs } from '@/hooks/useFAQs';
import { EventCard } from '@/components/event-card';




const Section = ({ id, className, children }: { id?: string, className?: string, children: React.ReactNode }) => (
  <section id={id} className={`py-12 md:py-20 lg:py-24 ${className}`}>
    <div className="container mx-auto px-4 md:px-6">
      {children}
    </div>
  </section>
);

const TeamMemberImage = ({ imageUrl, name }: { imageUrl: string, name: string }) => {
  const [src, setSrc] = useState(imageUrl);

  return (
    <div className="w-full h-full aspect-square bg-white relative">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => {
          // Fallback strategy if needed, but for now just let it fail gracefully or show placeholder
          // If it's a local path like /team/1.png, we might want to try other extensions?
          // But the database has the full path.
          // Let's just keep simple for now or use a placeholder.
          setSrc('/placeholder-user.jpg'); // Pending: Make sure this exists or use a generic one
        }}
      />
    </div>
  );
};

const SectionTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl text-center", className)}>
    {children}
  </h2>
);

import { TeamMember } from '@/hooks/useTeam';

const TeamCategory = ({ title, members }: { title: string, members: TeamMember[] }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-headline font-bold tracking-tighter sm:text-3xl text-center mb-8">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-center">
      {members.map((member) => (
        <div key={member.id} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 flex flex-col items-center justify-center">
          <TeamMemberImage imageUrl={member.image_url} name={member.name} />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
              <h3 className="font-headline text-xl font-bold text-white">{member.name}</h3>
              <p className="text-sm text-primary mb-2">{member.role}</p>
              <p className="text-xs text-white/80 line-clamp-4">{member.bio}</p>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 to-transparent p-4 text-center transition-opacity duration-300 group-hover:opacity-0">
            <h3 className="font-headline text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-primary">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);


import { LoadingScreen } from '@/components/loading-screen';

export default function Home() {
  const teamCategories = ['Faculty Advisor', 'Office Bearer', 'Vertical Head', 'Member'];

  const { rive, RiveComponent } = useRive({
    src: 'acm.riv',
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Fetch events using hook
  const { events, loading: eventsLoading, error } = useEvents();
  const { aboutData, loading: aboutLoading } = useAbout();
  const { team, loading: teamLoading } = useTeam();
  const { faqs, loading: faqsLoading } = useFAQs();

  // Aggregate loading state
  const isLoading = eventsLoading || aboutLoading || teamLoading || faqsLoading;

  // If loading and no data cached (handled by hooks), show loader
  // Hook logic: if cache exists, loading is false. So isLoading is true ONLY if fresh fetch is needed.

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Filter for upcoming/ongoing and take top 4
  const upcomingEvents = events
    .filter(e => e.status === 'upcoming' || e.status === 'ongoing')
    .slice(0, 4);

  // If no upcoming, show recent past
  const eventsToShow = upcomingEvents.length > 0
    ? upcomingEvents
    : events.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <Section className="!py-20 md:!py-32 lg:!py-40">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left animate-fade-in-down">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to <span className="text-primary animate-glow-blue">ACM IIIT Pune</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                The official student chapter of the Association for Computing Machinery at IIIT Pune. We are a community of thinkers, creators, and innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                <Button asChild size="lg">
                  <Link href="#events">Explore Events</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#membership">Join Us</Link>
                </Button>
              </div>
            </div>
            <div className="w-full h-[100px] md:h-[200px] lg:h-[400px]">
              <RiveComponent className="w-full h-full" />
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about" className="bg-card">
          <SectionTitle className="mb-12">{aboutData ? aboutData.title : 'About Us'}</SectionTitle>
          <div className="max-w-3xl mx-auto text-center text-muted-foreground md:text-lg whitespace-pre-wrap">
            {aboutData ? aboutData.content : `ACM, the world's largest educational and scientific computing society, delivers resources that advance computing as a science and a profession. The IIIT Pune ACM Student Chapter is a hub for students passionate about computer science. We organize a variety of events, including coding competitions, workshops, and tech talks, to foster a vibrant tech culture on campus and provide a platform for students to learn, innovate, and network.`}
          </div>
        </Section>




        {/* Events Section */}
        <Section id="events">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <SectionTitle className="mb-0 text-center md:text-left">
              {upcomingEvents.length > 0 ? 'Upcoming & Ongoing Events' : 'Recent Events'}
            </SectionTitle>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/events">Show All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {eventsToShow.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              {eventsToShow.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground p-8">
                  No events found.
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Membership Section */}
        <Section id="membership" className="bg-card">
          <SectionTitle className="mb-12">{aboutData?.membership_title || 'Become a Member'}</SectionTitle>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="font-headline text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                    {faq.answer}
                    {faq.link_url && (
                      <div className="mt-2">
                        <Link href={faq.link_url} target="_blank" className="text-primary hover:underline font-medium inline-flex items-center">
                          {faq.link_text || 'Learn More'} <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {faqs.length === 0 && !faqsLoading && (
                <p className="text-center text-muted-foreground">Membership details coming soon.</p>
              )}
            </Accordion>
          </div>
        </Section>

        {/* Team Section */}
        <Section id="team">
          <SectionTitle className="mb-12">Our Team</SectionTitle>
          {teamLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            teamCategories.map(category => {
              // Standard logic: Filter by exact category
              let members = team.filter(member => member.category === category);

              // Special logic: 'Member' category should include EVERYONE (duplicates visual, single source truth)
              // But sorting 'Member' role to the end if desired, or just show all.
              // As per request: "any faculy advisor office bearer or vertical heads are directly members no need to re enter them just display them again"
              if (category === 'Member') {
                members = team; // Show everyone in the 'Member' section
                // Optional: You might want to sort them so "Members" come last or by name
              }

              if (members.length === 0) return null;

              return (
                <TeamCategory
                  key={category}
                  title={category}
                  members={members}
                />
              );
            })
          )}
        </Section>

        {/* Contact Section */}
        <Section id="contact" className="bg-card">
          <SectionTitle className="mb-12">Get In Touch</SectionTitle>
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-muted-foreground mb-8">
              Have a question or a proposal? We'd love to hear from you.
            </p>
            <ContactForm />
          </div>
        </Section>

      </main>
      <Footer />
    </div>
  );
}
