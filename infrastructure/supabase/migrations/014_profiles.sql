-- Run: supabase db push  OR paste into Supabase SQL editor

create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text        not null,
  display_name  text        not null default '',
  photo_url     text,
  phone_number  text,
  role          text        not null default 'customer'
                            check (role = 'customer'),
  auth_provider text        not null default 'email'
                            check (auth_provider in ('email', 'google')),
  pending_email text,
  notifications jsonb       not null default
                '{"email":true,"push":true,"sms":false}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.profiles enable row level security;

create policy "customer: read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "customer: update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Session duration: 30 days for customers
-- Set in Supabase Dashboard → Auth → Settings → JWT expiry = 2592000

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (
    id, email, display_name, photo_url, auth_provider
  ) values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    new.raw_user_meta_data->>'avatar_url',
    case
      when new.app_metadata->>'provider' = 'google' then 'google'
      else 'email'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();