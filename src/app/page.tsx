
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
import { ArrowRight, Calendar, Users, Award, Briefcase, Lightbulb, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { eventsData } from '@/data/events';
import { EventCard } from '@/components/event-card';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  category: 'Faculty Advisor' | 'Office Bearer' | 'Vertical Head' | 'Member';
  bio: string;
  imageId: string;
};

const team: TeamMember[] = [
  { id: '1', name: 'Dr. Shrikant Salve', role: 'Faculty Advisor', category: 'Faculty Advisor', bio: 'Guiding the chapter with years of experience in academia and research.', imageId: '1' },
  { id: '2', name: 'Saurav Dhabade', role: 'Chair', category: 'Office Bearer', bio: 'Leading the team towards new heights and fostering a culture of innovation.', imageId: '2' },
  { id: '3', name: 'Roshni Sahoo', role: 'Vice Chair', category: 'Office Bearer', bio: 'Supporting the chapter\'s vision and managing internal affairs.', imageId: '3' },
  { id: '4', name: 'Gargi Avadhani', role: 'Treasurer', category: 'Office Bearer', bio: 'Organizing, documenting, and ensuring smooth communication.', imageId: '4' },
  { id: '5', name: 'Piyush Kulkarni', role: 'Membership Chair', category: 'Office Bearer', bio: 'Fostering community growth and ensuring a welcoming environment for all members.', imageId: '5' },
  { id: '6', name: 'Ayushman Ghosh', role: 'Management Head', category: 'Vertical Head', bio: 'Ensuring smooth operations and effective management of chapter activities.', imageId: '6' },
  { id: '7', name: 'Sarthak Gaikwad', role: 'AI/ML Head', category: 'Vertical Head', bio: 'Diving deep into data, models, and artificial intelligence.', imageId: '7' },
  { id: '8', name: 'Harshit Nashine', role: 'AR/VR Head', category: 'Vertical Head', bio: 'Exploring immersive technologies and building virtual experiences.', imageId: '8' },
  { id: '9', name: 'YUVRAJ JARWAL', role: 'Social Media Head', category: 'Vertical Head', bio: 'Managing the chapter\'s digital presence and engaging with the community.', imageId: '9' },
  { id: '10', name: 'ABC', role: 'Competitive Programming Head', category: 'Vertical Head', bio: 'Leading the charge in algorithmic challenges and contests.', imageId: 'team-head-cp' },
  { id: '11', name: 'ABC ', role: 'Development Head', category: 'Vertical Head', bio: 'Building cool projects and exploring new technologies.', imageId: 'team-head-dev' },
  { id: '12', name: 'Dr. Shrikant Salve', role: 'Member', category: 'Member', bio: 'Guiding the chapter with years of experience in academia and research.', imageId: '12' },
  { id: '13', name: 'Saurav Dhabade', role: 'Member', category: 'Member', bio: 'Leading the team towards new heights and fostering a culture of innovation.', imageId: '13' },
  { id: '14', name: 'Roshni Sahoo', role: 'Member', category: 'Member', bio: 'Supporting the chapter\'s vision and managing internal affairs.', imageId: '14' },
  { id: '15', name: 'Gargi Avadhani', role: 'Member', category: 'Member', bio: 'Organizing, documenting, and ensuring smooth communication.', imageId: '15' },
  { id: '16', name: 'Piyush Kulkarni', role: 'Member', category: 'Member', bio: 'Fostering community growth and ensuring a welcoming environment for all members.', imageId: '16' },
  { id: '17', name: 'Pravin Dhanrao', role: 'Member', category: 'Member', bio: 'Building cool projects and exploring new technologies.', imageId: '17' },
  { id: '18', name: 'Akshita Gupta', role: 'Member', category: 'Member', bio: 'Diving deep into data, models, and artificial intelligence.', imageId: '18' },
  { id: '19', name: 'Rajeshwari Harsh', role: 'Member', category: 'Member', bio: 'Crafting beautiful and intuitive user experiences.', imageId: '19' },
  { id: '20', name: 'Kirtiraj Jadeja', role: 'Member', category: 'Member', bio: 'Bridging the gap between students and the tech industry.', imageId: '20' },
  { id: '21', name: 'Priya Jadhav', role: 'Member', category: 'Member', bio: 'Managing the chapter\'s public image and outreach.', imageId: '21' },
  { id: '22', name: 'Mahesh Lonare', role: 'Member', category: 'Member', bio: 'Passionate about learning and contributing to the tech community.', imageId: '22' },
  { id: '23', name: 'Jyoti Manoorkar', role: 'Member', category: 'Member', bio: 'A budding developer with a keen interest in open source.', imageId: '23' },
  { id: '24', name: 'Jayata Roy', role: 'Member', category: 'Member', bio: 'Exploring the fascinating world of cybersecurity.', imageId: '24' },
  { id: '25', name: 'Santosh Shelke', role: 'Member', category: 'Member', bio: 'A competitive programmer honing his problem-solving skills.', imageId: '25' },
  { id: '26', name: 'Swapnil Shinde', role: 'Member', category: 'Member', bio: 'Passionate about UI/UX and creating delightful interfaces.', imageId: '26' },
  { id: '27', name: 'Faraj Tamboli', role: 'Member', category: 'Member', bio: 'Venturing into machine learning and its applications.', imageId: '27' },
];



const Section = ({ id, className, children }: { id?: string, className?: string, children: React.ReactNode }) => (
  <section id={id} className={`py-12 md:py-20 lg:py-24 ${className}`}>
    <div className="container mx-auto px-4 md:px-6">
      {children}
    </div>
  </section>
);

const TeamMemberImage = ({ id, name }: { id: string, name: string }) => {
  const [src, setSrc] = useState(`/team/${id}.png`);

  return (
    <div className="w-full h-full aspect-square bg-white relative">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => {
          if (src.endsWith('.png')) setSrc(`/team/${id}.jpg`);
          else if (src.endsWith('.jpg')) setSrc(`/team/${id}.JPG`);
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

const TeamCategory = ({ title, members }: { title: string, members: TeamMember[] }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-headline font-bold tracking-tighter sm:text-3xl text-center mb-8">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-center">
      {members.map((member) => (
        <div key={member.id} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 flex flex-col items-center justify-center">
          <TeamMemberImage id={member.imageId} name={member.name} />
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

export default function Home() {
  const teamCategories = ['Faculty Advisor', 'Office Bearer', 'Vertical Head', 'Member'];

  const { rive, RiveComponent } = useRive({
    src: 'acm.riv',
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Sort events by date descending and take top 3
  const recentEvents = [...eventsData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 3);


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
          <SectionTitle className="mb-12">About Us</SectionTitle>
          <p className="max-w-3xl mx-auto text-center text-muted-foreground md:text-lg">
            ACM, the world's largest educational and scientific computing society, delivers resources that advance computing as a science and a profession. The IIIT Pune ACM Student Chapter is a hub for students passionate about computer science. We organize a variety of events, including coding competitions, workshops, and tech talks, to foster a vibrant tech culture on campus and provide a platform for students to learn, innovate, and network.
          </p>
        </Section>




        {/* Events Section */}
        <Section id="events">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <SectionTitle className="mb-0 text-center md:text-left">Upcoming Events</SectionTitle>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/events">Show All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>

        {/* Membership Section */}
        <Section id="membership" className="bg-card">
          <SectionTitle className="mb-12">Become a Member</SectionTitle>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-lg">Why Join ACM?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Being a member of ACM IIIT Pune connects you to a large community of tech enthusiasts. You get access to exclusive workshops, mentorship from seniors, and a chance to represent the college in prestigious competitions. It's a great opportunity to improve your skills, build your network, and collaborate on exciting projects.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-headline text-lg">Membership Benefits</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                    <li><Award className="inline-block h-4 w-4 mr-2 text-primary" />Priority access to all our events and workshops.</li>
                    <li><Users className="inline-block h-4 w-4 mr-2 text-primary" />Opportunities to network with industry professionals and alumni.</li>
                    <li><Briefcase className="inline-block h-4 w-4 mr-2 text-primary" />Chance to be part of the organizing team for chapter events.</li>
                    <li><Lightbulb className="inline-block h-4 w-4 mr-2 text-primary" />Access to exclusive resources and learning materials.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-headline text-lg">How to Join?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Membership drives are held at the beginning of each academic year. Keep an eye on our social media channels and campus notice boards for announcements. You can also reach out to any of our team members for more information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>

        {/* Team Section */}
        <Section id="team">
          <SectionTitle className="mb-12">Our Team</SectionTitle>
          {teamCategories.map(category => (
            <TeamCategory
              key={category}
              title={category}
              members={team.filter(member => member.category === category)}
            />
          ))}
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
