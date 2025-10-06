
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRive } from '@rive-app/react-canvas';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Calendar, Users, Award, Briefcase, Lightbulb, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  category: 'Faculty Advisor' | 'Office Bearer' | 'Vertical Head' | 'Member';
  bio: string;
  imageId: string;
};

const team: TeamMember[] = [
  { id: '1', name: 'Dr. Shrikant Salave', role: 'Faculty Advisor', category: 'Faculty Advisor', bio: 'Guiding the chapter with years of experience in academia and research.', imageId: 'team-advisor' },
  { id: '2', name: 'Saurav Dhabade', role: 'Chair', category: 'Office Bearer', bio: 'Leading the team towards new heights and fostering a culture of innovation.', imageId: 'team-chair' },
  { id: '3', name: 'Roshni Sahoo', role: 'Vice Chair', category: 'Office Bearer', bio: 'Supporting the chapter\'s vision and managing internal affairs.', imageId: 'team-vice-chair' },
  { id: '4', name: 'Gargi Avadhani', role: 'Treasurer', category: 'Office Bearer', bio: 'Organizing, documenting, and ensuring smooth communication.', imageId: 'team-secretary' },
  { id: '5', name: 'Diana Evans', role: 'Competitive Programming Head', category: 'Vertical Head', bio: 'Leading the charge in algorithmic challenges and contests.', imageId: 'team-head-cp' },
  { id: '6', name: 'Frank Green', role: 'Development Head', category: 'Vertical Head', bio: 'Building cool projects and exploring new technologies.', imageId: 'team-head-dev' },
  { id: '7', name: 'Grace Hall', role: 'Machine Learning Head', category: 'Vertical Head', bio: 'Diving deep into data, models, and artificial intelligence.', imageId: 'team-head-ml' },
  { id: '8', name: 'Henry Ian', role: 'Design Head', category: 'Vertical Head', bio: 'Crafting beautiful and intuitive user experiences.', imageId: 'team-head-design' },
  { id: '9', name: 'Ivy Jones', role: 'Corporate Head', category: 'Vertical Head', bio: 'Bridging the gap between students and the tech industry.', imageId: 'team-head-corp' },
  { id: '10', name: 'Jack King', role: 'Public Relations Head', category: 'Vertical Head', bio: 'Managing the chapter\'s public image and outreach.', imageId: 'team-head-pr' },
  { id: '11', name: 'Kara Lewis', role: 'Member', category: 'Member', bio: 'Passionate about learning and contributing to the tech community.', imageId: 'team-member-1' },
  { id: '12', name: 'Leo Martin', role: 'Member', category: 'Member', bio: 'A budding developer with a keen interest in open source.', imageId: 'team-member-2' },
  { id: '13', name: 'Mona Nelson', role: 'Member', category: 'Member', bio: 'Exploring the fascinating world of cybersecurity.', imageId: 'team-member-3' },
  { id: '14', name: 'Nate Olsen', role: 'Member', category: 'Member', bio: 'A competitive programmer honing his problem-solving skills.', imageId: 'team-member-4' },
  { id: '15', name: 'Olivia Perry', role: 'Member', category: 'Member', bio: 'Passionate about UI/UX and creating delightful interfaces.', imageId: 'team-member-5' },
  { id: '16', name: 'Paul Quinn', role: 'Member', category: 'Member', bio: 'Venturing into machine learning and its applications.', imageId: 'team-member-6' },
  { id: '17', name: 'Rita Roberts', role: 'Member', category: 'Member', bio: 'Loves to build web applications and learn new frameworks.', imageId: 'team-member-7' },
  { id: '18', name: 'Sam Taylor', role: 'Member', category: 'Member', bio: 'Interested in tech ethics and social impact.', imageId: 'team-member-8' },
];

const events = [
  { title: 'CodeSprint 5.0', date: 'October 26, 2024', description: 'Our flagship annual coding competition with exciting prizes and challenging problems.', icon: Briefcase },
  { title: 'Intro to Web Dev Workshop', date: 'November 12, 2024', description: 'A beginner-friendly workshop covering the basics of HTML, CSS, and JavaScript.', icon: Lightbulb },
  { title: 'Alumni Tech Talk: AI in Fintech', date: 'November 28, 2024', description: 'An insightful session with an industry expert from our alumni network.', icon: Bot },
];

const Section = ({ id, className, children }: { id?: string, className?: string, children: React.ReactNode }) => (
  <section id={id} className={`py-12 md:py-20 lg:py-24 ${className}`}>
    <div className="container mx-auto px-4 md:px-6">
      {children}
    </div>
  </section>
);

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
          <div className="w-full h-full aspect-square bg-card flex items-center justify-center">
            <User className="w-24 h-24 text-muted-foreground" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-transparent p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-4 left-4 right-4">
               <h3 className="font-headline text-xl font-bold text-white">{member.name}</h3>
               <p className="text-sm text-primary">{member.role}</p>
               <p className="mt-2 text-xs text-white/80">{member.bio}</p>
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
  
  const { RiveComponent } = useRive({
    // You can find a public Rive file URL in the Rive Community Showcase
    // or use your own. You'll need to replace this.
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    autoplay: true,
  });


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* Hero Section */}
        <Section className="!py-20 md:!py-32 lg:!py-40">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left animate-fade-in-down">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to <span className="text-primary">ACM IIIT Pune</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                The official student chapter of the Association for Computing Machinery at IIIT Pune. We are a community of thinkers, creators, and innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="#events">Explore Events</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#membership">Join Us</Link>
                </Button>
              </div>
            </div>
             <div className="mx-auto aspect-video overflow-hidden rounded-xl animate-fade-in-up">
              {RiveComponent && <RiveComponent className="w-full h-full" />}
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
            {events.map((event, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <event.icon className="h-6 w-6 text-primary" />
                    {event.title}
                  </CardTitle>
                  <CardDescription><Calendar className="inline-block h-4 w-4 mr-1" />{event.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Register Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
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

    
