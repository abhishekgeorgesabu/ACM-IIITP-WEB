```
-- Create the events table
create table public.events (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  date text not null, -- Storing as text to match existing format, can use date/timestamp if preferred
  month text not null,
  day text not null,
  time text null,
  location text null,
  image text null,
  description text null,
  is_featured boolean null default false,
  status text null default 'upcoming',
  gallery text[] null,
  register_link text null,
  gallery_link text null,
  constraint events_pkey primary key (id)
) tablespace pg_default;

-- Create the Storage Bucket for event images
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

-- Enable Row Level Security
alter table public.events enable row level security;

-- Policy: Allow Public Read Access
create policy "Enable read access for all users"
on public.events
for select
to public
using (true);

-- Policy: Allow Authenticated Users (Admins) to Insert
create policy "Enable insert for authenticated users only"
on public.events
for insert
to authenticated
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Update
create policy "Enable update for authenticated users only"
on public.events
for update
to authenticated
using (true)
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Delete
create policy "Enable delete for authenticated users only"
on public.events
for delete
to authenticated
using (true);

-- Storage Policies for 'event-images' bucket
create policy "Give public access to event-images"
on storage.objects for select
to public
using (bucket_id = 'event-images');

create policy "Enable insert for authenticated users only"
on storage.objects for insert
to authenticated
with check (bucket_id = 'event-images');

create policy "Enable update for authenticated users only"
on storage.objects for update
to authenticated
using (bucket_id = 'event-images');

create policy "Enable delete for authenticated users only"
on storage.objects for delete
to authenticated
using (bucket_id = 'event-images');

-- Create About Info Table (Singleton)
create table public.about_info (
  id int primary key default 1 check (id = 1),
  title text not null default 'About Us',
  content text not null default 'ACM, the world''s largest educational and scientific computing society, delivers resources that advance computing as a science and a profession. The IIIT Pune ACM Student Chapter is a hub for students passionate about computer science. We organize a variety of events, including coding competitions, workshops, and tech talks, to foster a vibrant tech culture on campus and provide a platform for students to learn, innovate, and network.'
) tablespace pg_default;

-- Enable RLS for about_info
alter table public.about_info enable row level security;

-- Policy: Allow Public Read Access
create policy "Enable read access for all users"
on public.about_info
for select
to public
using (true);

-- Policy: Allow Authenticated Users (Admins) to Update
create policy "Enable update for authenticated users only"
on public.about_info
for update
to authenticated
using (true)
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Insert (only if row doesn't exist, though id=1 constraint handles uniqueness)
create policy "Enable insert for authenticated users only"
on public.about_info
for insert
to authenticated
with check (true);

-- Create Team Members Table
create table public.team_members (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  role text not null,
  category text not null,
  bio text null,
  image_url text null,
  order_index integer default 0,
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
) tablespace pg_default;

-- Enable RLS for team_members
alter table public.team_members enable row level security;

-- Policy: Allow Public Read Access
create policy "Enable read access for all users"
on public.team_members
for select
to public
using (true);

-- Policy: Allow Authenticated Users (Admins) to Insert
create policy "Enable insert for authenticated users only"
on public.team_members
for insert
to authenticated
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Update
create policy "Enable update for authenticated users only"
on public.team_members
for update
to authenticated
using (true)
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Delete
create policy "Enable delete for authenticated users only"
on public.team_members
for delete
to authenticated
using (true);

-- Create the Storage Bucket for team images
insert into storage.buckets (id, name, public)
values ('team-images', 'team-images', true)
on conflict (id) do nothing;

-- Storage Policies for 'team-images' bucket
create policy "Give public access to team-images"
on storage.objects for select
to public
using (bucket_id = 'team-images');

create policy "Enable insert for team-images for authenticated users only"
on storage.objects for insert
to authenticated
with check (bucket_id = 'team-images');

create policy "Enable update for team-images for authenticated users only"
on storage.objects for update
to authenticated
using (bucket_id = 'team-images');

create policy "Enable delete for team-images for authenticated users only"
on storage.objects for delete
to authenticated
using (bucket_id = 'team-images');

-- Create Membership FAQs Table
create table public.membership_faqs (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  question text not null,
  answer text not null,
  link_text text null,
  link_url text null,
  order_index integer default 0,
  CONSTRAINT membership_faqs_pkey PRIMARY KEY (id)
) tablespace pg_default;

-- Enable RLS for membership_faqs
alter table public.membership_faqs enable row level security;

-- Policy: Allow Public Read Access
create policy "Enable read access for all users"
on public.membership_faqs
for select
to public
using (true);

-- Policy: Allow Authenticated Users (Admins) to Insert
create policy "Enable insert for authenticated users only"
on public.membership_faqs
for insert
to authenticated
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Update
create policy "Enable update for authenticated users only"
on public.membership_faqs
for update
to authenticated
using (true)
with check (true);

-- Policy: Allow Authenticated Users (Admins) to Delete
create policy "Enable delete for authenticated users only"
on public.membership_faqs
for delete
to authenticated
using (true);
