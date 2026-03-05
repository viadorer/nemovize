-- Teams
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  settings jsonb default '{}',
  created_at timestamptz default now()
);

-- Profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('owner','admin','consultant','viewer')),
  bio text,
  specialization text[],
  created_at timestamptz default now()
);

-- Clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  source text,
  status text not null default 'lead' check (status in ('lead','active','closed')),
  assigned_to uuid references profiles(id) on delete set null,
  notes text,
  tags text[],
  created_at timestamptz default now()
);

-- Properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  description text,
  property_type text not null,
  transaction_type text not null,
  price numeric not null,
  estimated_price numeric,
  address text not null,
  city text not null,
  zip text,
  lat numeric,
  lng numeric,
  floor_area numeric,
  lot_area numeric,
  rooms integer,
  layout text,
  floor integer,
  total_floors integer,
  construction text,
  condition text,
  energy_rating text,
  ownership text,
  features jsonb default '{}',
  status text not null default 'draft' check (status in ('draft','active','reserved','sold')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property images
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Valuations
create table valuations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  address text not null,
  property_type text not null,
  floor_area numeric not null,
  estimated_min numeric,
  estimated_max numeric,
  estimated_avg numeric,
  methodology text,
  data_sources jsonb,
  status text not null default 'pending' check (status in ('pending','completed','expired')),
  created_at timestamptz default now()
);

-- Inquiries
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','showing','offer','closed')),
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  inquiry_id uuid references inquiries(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  sender_type text not null check (sender_type in ('consultant','client','system')),
  sender_id uuid,
  channel text not null check (channel in ('email','sms','chat','note')),
  subject text,
  body text not null,
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references profiles(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- Documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  name text not null,
  file_url text not null,
  file_type text,
  category text,
  created_at timestamptz default now()
);

-- Activities
create table activities (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  description text,
  user_id uuid references profiles(id) on delete set null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index idx_profiles_team on profiles(team_id);
create index idx_clients_team on clients(team_id);
create index idx_clients_assigned on clients(assigned_to);
create index idx_properties_team on properties(team_id);
create index idx_properties_status on properties(status);
create index idx_properties_client on properties(client_id);
create index idx_property_images_property on property_images(property_id);
create index idx_valuations_team on valuations(team_id);
create index idx_inquiries_property on inquiries(property_id);
create index idx_messages_team on messages(team_id);
create index idx_reviews_consultant on reviews(consultant_id);
create index idx_documents_team on documents(team_id);
create index idx_activities_team on activities(team_id);
create index idx_activities_entity on activities(entity_type, entity_id);

-- Enable RLS on all tables
alter table teams enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table valuations enable row level security;
alter table inquiries enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table documents enable row level security;
alter table activities enable row level security;

-- RLS Policies

-- Teams: users can see their own team
create policy "team_select" on teams for select using (
  id in (select team_id from profiles where profiles.id = auth.uid())
);

-- Profiles: users can see profiles in their team
create policy "profiles_select" on profiles for select using (
  team_id in (select team_id from profiles p where p.id = auth.uid())
);
create policy "profiles_update_own" on profiles for update using (id = auth.uid());

-- Team-scoped policies (same pattern for all team-scoped tables)
create policy "clients_select" on clients for select using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "clients_insert" on clients for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "clients_update" on clients for update using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "clients_delete" on clients for delete using (
  team_id in (select team_id from profiles where id = auth.uid())
);

create policy "properties_select" on properties for select using (
  team_id in (select team_id from profiles where id = auth.uid())
  or status = 'active'
);
create policy "properties_insert" on properties for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "properties_update" on properties for update using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "properties_delete" on properties for delete using (
  team_id in (select team_id from profiles where id = auth.uid())
);

create policy "property_images_select" on property_images for select using (
  property_id in (select id from properties)
);
create policy "property_images_insert" on property_images for insert with check (
  property_id in (select id from properties where team_id in (select team_id from profiles where id = auth.uid()))
);
create policy "property_images_delete" on property_images for delete using (
  property_id in (select id from properties where team_id in (select team_id from profiles where id = auth.uid()))
);

create policy "valuations_select" on valuations for select using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "valuations_insert" on valuations for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);

create policy "inquiries_select" on inquiries for select using (
  property_id in (select id from properties)
);
create policy "inquiries_insert" on inquiries for insert with check (true);
create policy "inquiries_update" on inquiries for update using (
  property_id in (select id from properties where team_id in (select team_id from profiles where id = auth.uid()))
);

create policy "messages_select" on messages for select using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "messages_insert" on messages for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);

create policy "reviews_select" on reviews for select using (is_public = true);
create policy "reviews_insert" on reviews for insert with check (true);

create policy "documents_select" on documents for select using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "documents_insert" on documents for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "documents_delete" on documents for delete using (
  team_id in (select team_id from profiles where id = auth.uid())
);

create policy "activities_select" on activities for select using (
  team_id in (select team_id from profiles where id = auth.uid())
);
create policy "activities_insert" on activities for insert with check (
  team_id in (select team_id from profiles where id = auth.uid())
);

-- Public read for consultants (profiles with role='consultant')
create policy "consultants_public_select" on profiles for select using (role = 'consultant');
