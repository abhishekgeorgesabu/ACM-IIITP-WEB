
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Trash2, Edit, Plus, X, Image as ImageIcon, User } from 'lucide-react';
import Image from 'next/image';
import { format, parse, isAfter, isBefore, startOfDay } from 'date-fns';

// Types
interface Event {
    id: string;
    title: string;
    date: string; // "Thursday, November 20, 2024"
    month: string;
    day: string;
    time: string;
    location: string;
    image: string;
    description: string;
    is_featured: boolean;
    status: string;
    register_link?: string;
    gallery?: string[];
    gallery_link?: string;
}

interface FAQ {
    id: string;
    question: string;
    answer: string;
    link_text?: string;
    link_url?: string;
    order_index: number;
}

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dashboard State
    const [events, setEvents] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
    const [datePickerValue, setDatePickerValue] = useState('');
    const [uploading, setUploading] = useState(false);

    // About State
    const [aboutTitle, setAboutTitle] = useState('');
    const [aboutContent, setAboutContent] = useState('');
    const [membershipTitle, setMembershipTitle] = useState('');

    // Team State
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const [currentMember, setCurrentMember] = useState<any>({});
    const [teamUploading, setTeamUploading] = useState(false);

    // FAQ State
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isEditingFAQ, setIsEditingFAQ] = useState(false);
    const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ>>({});

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchEvents();
                fetchTeam();
                fetchFAQs();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchEvents();
                fetchTeam();
                fetchFAQs();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- Auth Handlers ---
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    // --- Data Handlers ---
    async function fetchEvents() {
        // Fetch Events
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setEvents(data);

        // Fetch About
        const { data: aboutData } = await supabase
            .from('about_info')
            .select('*')
            .single();

        if (aboutData) {
            setAboutTitle(aboutData.title);
            setAboutContent(aboutData.content);
            setMembershipTitle(aboutData.membership_title || 'Become a Member');
        } else {
            // Set defaults if nothing found
            setAboutTitle('About Us');
            setAboutContent("ACM, the world's largest educational and scientific computing society...");
            setMembershipTitle('Become a Member');
        }
    }

    async function fetchTeam() {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('order_index', { ascending: true })
            .order('created_at', { ascending: true });
        if (data) setTeamMembers(data);
    }

    async function fetchFAQs() {
        const { data, error } = await supabase
            .from('membership_faqs')
            .select('*')
            .order('order_index', { ascending: true })
            .order('created_at', { ascending: true });
        if (data) setFaqs(data);
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this event? This will also remove associated images.')) return;

        // 1. Fetch the event to get image URLs
        const { data: eventData, error: fetchError } = await supabase
            .from('events')
            .select('image, gallery')
            .eq('id', id)
            .single();

        if (fetchError) {
            alert('Error fetching event data: ' + fetchError.message);
            return;
        }

        // 2. Extract file paths from URLs
        const imagesToDelete: string[] = [];

        function getPathFromUrl(url: string) {
            try {
                // Assuming URL format: .../storage/v1/object/public/event-images/FILENAME
                const parts = url.split('/event-images/');
                if (parts.length === 2) return parts[1];
            } catch (e) {
                console.error('Error parsing URL', url);
            }
            return null;
        }

        if (eventData.image) {
            const path = getPathFromUrl(eventData.image);
            if (path) imagesToDelete.push(path);
        }

        if (eventData.gallery && Array.isArray(eventData.gallery)) {
            eventData.gallery.forEach((url: string) => {
                const path = getPathFromUrl(url);
                if (path) imagesToDelete.push(path);
            });
        }

        // 3. Delete files from Storage
        if (imagesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('event-images')
                .remove(imagesToDelete);

            if (storageError) {
                console.error('Error deleting images from storage:', storageError);
                // We typically continue to delete the record even if image deletion fails, 
                // but alerting the user is good practice.
            }
        }

        // 4. Delete the event record
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) alert('Error: ' + error.message);
        else fetchEvents();
    }

    // --- Team Handlers ---
    async function handleTeamSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('team_members')
            .upsert(currentMember)
            .select();

        if (error) {
            alert('Error saving member: ' + error.message);
        } else {
            setIsEditingTeam(false);
            setCurrentMember({});
            fetchTeam();
        }
        setLoading(false);
    }

    async function handleTeamDelete(id: string) {
        if (!confirm('Are you sure?')) return;

        // Optionally delete image from bucket if needed, skipping for now as strict cleanup isn't minimal
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) alert('Error: ' + error.message);
        else fetchTeam();
    }

    async function handleTeamUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        setTeamUploading(true);
        const file = e.target.files[0];

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('team-images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Upload error: ' + uploadError.message);
            setTeamUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('team-images')
            .getPublicUrl(filePath);

        setCurrentMember((prev: any) => ({ ...prev, image_url: publicUrl }));
        setTeamUploading(false);
    }

    // --- FAQ Handlers ---
    async function handleFAQSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase
            .from('membership_faqs')
            .upsert(currentFAQ)
            .select();

        if (error) alert('Error: ' + error.message);
        else {
            setIsEditingFAQ(false);
            setCurrentFAQ({});
            fetchFAQs();
        }
        setLoading(false);
    }

    async function handleFAQDelete(id: string) {
        if (!confirm('Delete this FAQ?')) return;
        const { error } = await supabase.from('membership_faqs').delete().eq('id', id);
        if (error) alert('Error: ' + error.message);
        else fetchFAQs();
    }

    // --- Form Handlers ---

    // Initialize form when editing
    function openEdit(event: Event) {
        setCurrentEvent(event);
        // Try to parse the existing date string back to YYYY-MM-DD for the input
        try {
            const parsedDate = parse(event.date, 'EEEE, MMMM d, yyyy', new Date());
            if (!isNaN(parsedDate.getTime())) {
                setDatePickerValue(format(parsedDate, 'yyyy-MM-dd'));
            } else {
                setDatePickerValue('');
            }
        } catch (e) {
            setDatePickerValue('');
        }
        setIsEditing(true);
    }

    function openNew() {
        setCurrentEvent({ status: 'upcoming', is_featured: false, gallery: [] });
        setDatePickerValue('');
        setIsEditing(true);
    }

    // Date Picker Logic
    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setDatePickerValue(val);

        if (val) {
            const dateObj = new Date(val);
            if (!isNaN(dateObj.getTime())) {
                // 1. Format for DB: "Thursday, November 20, 2024"
                const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');

                // 2. Derive Month/Day
                const month = format(dateObj, 'MMM').toUpperCase(); // "NOV"
                const day = format(dateObj, 'dd'); // "20"

                // 3. Smart Status
                const today = startOfDay(new Date());
                let status = 'upcoming';
                if (isBefore(dateObj, today)) status = 'past';
                else if (isAfter(dateObj, today)) status = 'upcoming';
                else status = 'ongoing'; // same day

                setCurrentEvent(prev => ({
                    ...prev,
                    date: formattedDate,
                    month,
                    day,
                    status
                }));
            }
        }
    }

    // Image Upload (Cover & Gallery)
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        // Validation: Max 10 images total
        const currentGalleryCount = currentEvent.gallery?.length || 0;
        const hasCover = !!currentEvent.image;
        const currentTotal = currentGalleryCount + (hasCover ? 1 : 0);

        // If uploading to gallery, check if adding these files exceeds limit (assuming 1 cover always exists or will exist)
        // If replacing cover, count stays same.
        if (isGallery) {
            if (currentTotal + files.length > 10) {
                alert('You can only have a maximum of 10 images total (Cover + Gallery).');
                setUploading(false);
                return;
            }
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(filePath, file);

            if (uploadError) {
                alert(`Error uploading ${file.name}: ${uploadError.message}`);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('event-images')
                .getPublicUrl(filePath);

            uploadedUrls.push(publicUrl);
        }

        if (isGallery) {
            setCurrentEvent(prev => ({
                ...prev,
                gallery: [...(prev.gallery || []), ...uploadedUrls]
            }));
        } else {
            // Cover image - take the first one if multiple selected (though input should be single)
            if (uploadedUrls.length > 0) {
                setCurrentEvent(prev => ({ ...prev, image: uploadedUrls[0] }));
            }
        }

        setUploading(false);
    }

    function removeGalleryImage(index: number) {
        const newGallery = [...(currentEvent.gallery || [])];
        newGallery.splice(index, 1);
        setCurrentEvent({ ...currentEvent, gallery: newGallery });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        // Required Validations
        if (!currentEvent.title) { alert('Title is required'); setLoading(false); return; }
        if (!currentEvent.date) { alert('Date is required'); setLoading(false); return; }
        if (!currentEvent.image) { alert('Cover Image is required'); setLoading(false); return; }

        const eventData = { ...currentEvent };

        const { error } = await supabase
            .from('events')
            .upsert(eventData as any)
            .select();

        if (error) {
            alert('Error saving event: ' + error.message);
        } else {
            setIsEditing(false);
            setCurrentEvent({});
            fetchEvents();
        }
        setLoading(false);
    }

    if (!session) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-background">
                <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border border-border">
                    <h1 className="text-2xl font-bold text-center">Admin Login</h1>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null} Sign In
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>

                <Tabs defaultValue="events" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={openNew}>
                                <Plus className="mr-2 h-4 w-4" /> Add Event
                            </Button>
                        </div>

                        {isEditing ? (
                            <div className="bg-card p-6 rounded-xl border border-border max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold mb-4">{currentEvent.id ? 'Edit Event' : 'New Event'}</h2>
                                <form onSubmit={handleSave} className="space-y-4">

                                    {/* Title & Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title *</Label>
                                            <Input
                                                value={currentEvent.title || ''}
                                                onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select
                                                value={currentEvent.status}
                                                onValueChange={(val) => setCurrentEvent({ ...currentEvent, status: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                                    <SelectItem value="past">Past</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Date Picker & Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date *</Label>
                                            <Input
                                                type="date"
                                                value={datePickerValue}
                                                onChange={handleDateChange}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Formatted: {currentEvent.date || 'No date selected'}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Time (12-hour format)</Label>
                                            <Input
                                                type="time"
                                                value={(() => {
                                                    // Convert formatted "2:00 PM" -> "14:00" for input
                                                    if (!currentEvent.time) return '';
                                                    try {
                                                        const parsed = parse(currentEvent.time, 'h:mm a', new Date());
                                                        if (isNaN(parsed.getTime())) return ''; // Fallback if parsing fails (maybe already linear?)
                                                        return format(parsed, 'HH:mm');
                                                    } catch (e) {
                                                        return '';
                                                    }
                                                })()}
                                                onChange={(e) => {
                                                    const val = e.target.value; // "14:00"
                                                    if (val) {
                                                        // Convert "14:00" -> "2:00 PM" for storage
                                                        const dateObj = parse(val, 'HH:mm', new Date());
                                                        const formattedTime = format(dateObj, 'h:mm a');
                                                        setCurrentEvent({ ...currentEvent, time: formattedTime });
                                                    } else {
                                                        setCurrentEvent({ ...currentEvent, time: '' });
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Display: {currentEvent.time || 'No time selected'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location & Links */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={currentEvent.location || ''}
                                                onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Register Link</Label>
                                            <Input
                                                value={currentEvent.register_link || ''}
                                                onChange={(e) => setCurrentEvent({ ...currentEvent, register_link: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>External Gallery Link (Google Photos, Drive, etc.)</Label>
                                            <Input
                                                value={currentEvent.gallery_link || ''}
                                                onChange={(e) => setCurrentEvent({ ...currentEvent, gallery_link: e.target.value })}
                                                placeholder="https://photos.app.goo.gl/..."
                                            />
                                        </div>
                                    </div>

                                    {/* Description Sections */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-lg">Description Sections</Label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    const currentSections = currentEvent.description && currentEvent.description.startsWith('[')
                                                        ? JSON.parse(currentEvent.description)
                                                        : [{ heading: 'Overview', content: currentEvent.description || '' }];

                                                    // Ensure it's an array before pushing
                                                    const sections = Array.isArray(currentSections) ? currentSections : [];
                                                    sections.push({ heading: '', content: '' });

                                                    setCurrentEvent({
                                                        ...currentEvent,
                                                        description: JSON.stringify(sections)
                                                    });
                                                }}
                                            >
                                                <Plus className="w-3 h-3 mr-1" /> Add Section
                                            </Button>
                                        </div>

                                        {(() => {
                                            let sections: { heading: string, content: string }[] = [];
                                            try {
                                                sections = currentEvent.description && currentEvent.description.startsWith('[')
                                                    ? JSON.parse(currentEvent.description)
                                                    : [{ heading: 'Overview', content: currentEvent.description || '' }];
                                            } catch (e) {
                                                sections = [{ heading: 'Overview', content: currentEvent.description || '' }];
                                            }

                                            return sections.map((section, idx) => (
                                                <div key={idx} className="bg-muted/30 p-4 rounded-lg border border-border space-y-3 relative group">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => {
                                                                const newSections = [...sections];
                                                                newSections.splice(idx, 1);
                                                                setCurrentEvent({
                                                                    ...currentEvent,
                                                                    description: JSON.stringify(newSections)
                                                                });
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label className="text-xs uppercase text-muted-foreground">Section Heading</Label>
                                                        <Input
                                                            value={section.heading}
                                                            onChange={(e) => {
                                                                const newSections = [...sections];
                                                                newSections[idx].heading = e.target.value;
                                                                setCurrentEvent({
                                                                    ...currentEvent,
                                                                    description: JSON.stringify(newSections)
                                                                });
                                                            }}
                                                            placeholder="e.g. Executive Summary"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs uppercase text-muted-foreground">Information</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={section.content}
                                                            onChange={(e) => {
                                                                const newSections = [...sections];
                                                                newSections[idx].content = e.target.value;
                                                                setCurrentEvent({
                                                                    ...currentEvent,
                                                                    description: JSON.stringify(newSections)
                                                                });
                                                            }}
                                                            placeholder="Section details..."
                                                        />
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>

                                    {/* Featured Checkbox */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="featured"
                                            checked={currentEvent.is_featured}
                                            onCheckedChange={(checked) => setCurrentEvent({ ...currentEvent, is_featured: !!checked })}
                                        />
                                        <Label htmlFor="featured">Feature this event (Show on Hero)</Label>
                                    </div>

                                    {/* Cover Image */}
                                    <div className="space-y-2">
                                        <Label>Cover Image *</Label>
                                        <div className="flex gap-4 items-center">
                                            <div className="relative w-24 h-24 rounded border flex items-center justify-center bg-muted overflow-hidden">
                                                {currentEvent.image ? (
                                                    <Image src={currentEvent.image} alt="Cover" fill className="object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, false)} disabled={uploading} />
                                        </div>
                                    </div>

                                    {/* Gallery Images */}
                                    <div className="space-y-2">
                                        <Label>Gallery Images (Max 10 total)</Label>
                                        <Input type="file" accept="image/*" multiple onChange={(e) => handleUpload(e, true)} disabled={uploading} />

                                        {currentEvent.gallery && currentEvent.gallery.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mt-2">
                                                {currentEvent.gallery.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded border overflow-hidden group">
                                                        <Image src={img} alt="Gallery" fill className="object-cover" />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeGalleryImage(idx)}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {uploading && <p className="text-sm text-yellow-500 font-bold">Uploading images... please wait.</p>}

                                    <div className="flex gap-4 pt-4">
                                        <Button type="submit" disabled={loading || uploading}>Save Event</Button>
                                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {events.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                                                {event.image && <Image src={event.image} alt={event.title} fill className="object-cover" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold flex items-center gap-2">
                                                    {event.title}
                                                    {event.is_featured && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">FEATURED</span>}
                                                </h3>
                                                <div className="text-sm text-muted-foreground flex gap-3">
                                                    <span>{event.date}</span>
                                                    <span className={`uppercase font-bold ${event.status === 'upcoming' ? 'text-green-500' :
                                                        event.status === 'ongoing' ? 'text-blue-500' : 'text-gray-500'
                                                        }`}>{event.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => openEdit(event)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="destructive" onClick={() => handleDelete(event.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {events.length === 0 && <p className="text-center text-muted-foreground">No events found.</p>}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="about">
                        <div className="bg-card p-6 rounded-xl border border-border max-w-2xl mx-auto space-y-4">
                            <h2 className="text-xl font-bold mb-4">Edit About Section</h2>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    const { error } = await supabase
                                        .from('about_info')
                                        .upsert({
                                            id: 1,
                                            title: aboutTitle,
                                            content: aboutContent,
                                            membership_title: membershipTitle
                                        });

                                    if (error) alert('Error saving: ' + error.message);
                                    else alert('Saved successfully!');
                                    setLoading(false);
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label>Heading</Label>
                                    <Input
                                        value={aboutTitle}
                                        onChange={(e) => setAboutTitle(e.target.value)}
                                        placeholder="About Us"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <Textarea
                                        rows={6}
                                        value={aboutContent}
                                        onChange={(e) => setAboutContent(e.target.value)}
                                        placeholder="Description..."
                                    />
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <Label>Membership Section Heading</Label>
                                    <Input
                                        value={membershipTitle}
                                        onChange={(e) => setMembershipTitle(e.target.value)}
                                        placeholder="Become a Member"
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null} Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </TabsContent>

                    <TabsContent value="team">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button onClick={() => {
                                    setCurrentMember({ category: 'Member' });
                                    setIsEditingTeam(true);
                                }}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Member
                                </Button>
                            </div>

                            {isEditingTeam ? (
                                <div className="bg-card p-6 rounded-xl border border-border max-w-2xl mx-auto">
                                    <h2 className="text-xl font-bold mb-4">{currentMember.id ? 'Edit Member' : 'New Member'}</h2>
                                    <form onSubmit={handleTeamSave} className="space-y-4">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Name *</Label>
                                                <Input
                                                    value={currentMember.name || ''}
                                                    onChange={e => setCurrentMember({ ...currentMember, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role *</Label>
                                                <Input
                                                    value={currentMember.role || ''}
                                                    onChange={e => setCurrentMember({ ...currentMember, role: e.target.value })}
                                                    placeholder="e.g. Chair, Member, Lead"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Category *</Label>
                                            <Select
                                                value={currentMember.category}
                                                onValueChange={val => setCurrentMember({ ...currentMember, category: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Faculty Advisor">Faculty Advisor</SelectItem>
                                                    <SelectItem value="Office Bearer">Office Bearer</SelectItem>
                                                    <SelectItem value="Vertical Head">Vertical Head</SelectItem>
                                                    <SelectItem value="Member">Member</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Textarea
                                                value={currentMember.bio || ''}
                                                onChange={e => setCurrentMember({ ...currentMember, bio: e.target.value })}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Photo</Label>
                                            <div className="flex gap-4 items-center">
                                                <div className="relative w-20 h-20 rounded border bg-muted overflow-hidden">
                                                    {currentMember.image_url ? (
                                                        <Image src={currentMember.image_url} alt="Profile" fill className="object-cover" />
                                                    ) : <User className="w-8 h-8 m-auto text-muted-foreground" />}
                                                </div>
                                                <Input type="file" accept="image/*" onChange={handleTeamUpload} disabled={teamUploading} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Display Order (Lower numbers show first)</Label>
                                            <Input
                                                type="number"
                                                value={currentMember.order_index || 0}
                                                onChange={e => setCurrentMember({ ...currentMember, order_index: parseInt(e.target.value) })}
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button type="submit" disabled={loading || teamUploading}>Save Member</Button>
                                            <Button type="button" variant="ghost" onClick={() => setIsEditingTeam(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {teamMembers.map(member => (
                                        <div key={member.id} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                                {member.image_url ? (
                                                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                                                ) : <User className="w-6 h-6 m-auto text-muted-foreground" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{member.name}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                                <p className="text-[10px] uppercase text-primary font-bold">{member.category}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                                                    setCurrentMember(member);
                                                    setIsEditingTeam(true);
                                                }}>
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => handleTeamDelete(member.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {teamMembers.length === 0 && <p className="col-span-full text-center text-muted-foreground">No members found.</p>}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="faqs">
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button onClick={() => {
                                    setCurrentFAQ({ order_index: 0 });
                                    setIsEditingFAQ(true);
                                }}>
                                    <Plus className="mr-2 h-4 w-4" /> Add FAQ
                                </Button>
                            </div>

                            {isEditingFAQ ? (
                                <div className="bg-card p-6 rounded-xl border border-border max-w-2xl mx-auto">
                                    <h2 className="text-xl font-bold mb-4">{currentFAQ.id ? 'Edit FAQ' : 'New FAQ'}</h2>
                                    <form onSubmit={handleFAQSave} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Question *</Label>
                                            <Input
                                                value={currentFAQ.question || ''}
                                                onChange={e => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Answer *</Label>
                                            <Textarea
                                                value={currentFAQ.answer || ''}
                                                onChange={e => setCurrentFAQ({ ...currentFAQ, answer: e.target.value })}
                                                rows={4}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Link Text (Optional)</Label>
                                                <Input
                                                    value={currentFAQ.link_text || ''}
                                                    onChange={e => setCurrentFAQ({ ...currentFAQ, link_text: e.target.value })}
                                                    placeholder="e.g. Join Now"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Link URL (Optional)</Label>
                                                <Input
                                                    value={currentFAQ.link_url || ''}
                                                    onChange={e => setCurrentFAQ({ ...currentFAQ, link_url: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Display Order</Label>
                                            <Input
                                                type="number"
                                                value={currentFAQ.order_index || 0}
                                                onChange={e => setCurrentFAQ({ ...currentFAQ, order_index: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <Button type="submit" disabled={loading}>Save FAQ</Button>
                                            <Button type="button" variant="ghost" onClick={() => setIsEditingFAQ(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {faqs.map(faq => (
                                        <div key={faq.id} className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
                                            <div>
                                                <h4 className="font-bold">{faq.question}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{faq.answer}</p>
                                                {faq.link_url && <p className="text-xs text-primary mt-1">Link: {faq.link_text} ({faq.link_url})</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => {
                                                    setCurrentFAQ(faq);
                                                    setIsEditingFAQ(true);
                                                }}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="destructive" onClick={() => handleFAQDelete(faq.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {faqs.length === 0 && <p className="text-center text-muted-foreground">No FAQs found.</p>}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                </Tabs>
            </main>
            <Footer />
        </div >
    );
}
