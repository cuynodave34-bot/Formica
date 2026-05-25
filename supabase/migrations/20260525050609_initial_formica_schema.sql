create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  default_currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint profiles_default_currency_check check (default_currency ~ '^[A-Z]{3}$')
);

create table public.chambers (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  chamber_type text not null,
  currency text not null default 'USD',
  balance_minor_units bigint not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint chambers_name_length_check check (char_length(trim(name)) between 1 and 80),
  constraint chambers_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint chambers_type_check check (
    chamber_type in ('cash', 'bank', 'e_wallet', 'savings', 'debt', 'asset')
  )
);

create table public.categories (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category_type text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint categories_name_length_check check (char_length(trim(name)) between 1 and 80),
  constraint categories_type_check check (category_type in ('income', 'expense'))
);

create table public.trails (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  chamber_id uuid not null references public.chambers(id),
  transfer_chamber_id uuid references public.chambers(id),
  category_id uuid references public.categories(id),
  trail_type text not null,
  amount_minor_units bigint not null,
  currency text not null default 'USD',
  occurred_on date not null,
  occurred_at timestamptz not null default now(),
  note text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint trails_amount_positive_check check (amount_minor_units > 0),
  constraint trails_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint trails_type_check check (trail_type in ('income', 'expense', 'transfer')),
  constraint trails_transfer_destination_check check (
    (
      trail_type = 'transfer'
      and transfer_chamber_id is not null
      and transfer_chamber_id <> chamber_id
    )
    or (trail_type <> 'transfer' and transfer_chamber_id is null)
  ),
  constraint trails_note_length_check check (note is null or char_length(note) <= 500),
  constraint trails_idempotency_key_length_check check (
    idempotency_key is null or char_length(idempotency_key) <= 120
  )
);

create unique index trails_user_id_idempotency_key_unique
  on public.trails(user_id, idempotency_key)
  where idempotency_key is not null and deleted_at is null;

create table public.trail_transfers (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trail_id uuid not null unique references public.trails(id) on delete cascade,
  source_chamber_id uuid not null references public.chambers(id),
  destination_chamber_id uuid not null references public.chambers(id),
  amount_minor_units bigint not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint trail_transfers_amount_positive_check check (amount_minor_units > 0),
  constraint trail_transfers_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint trail_transfers_different_chambers_check check (
    source_chamber_id <> destination_chamber_id
  )
);

create table public.mounds (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_minor_units bigint not null,
  saved_minor_units bigint not null default 0,
  currency text not null default 'USD',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint mounds_name_length_check check (char_length(trim(name)) between 1 and 80),
  constraint mounds_target_positive_check check (target_minor_units > 0),
  constraint mounds_saved_non_negative_check check (saved_minor_units >= 0),
  constraint mounds_currency_check check (currency ~ '^[A-Z]{3}$')
);

create table public.sync_queue (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  operation text not null,
  payload jsonb not null,
  idempotency_key text not null,
  attempt_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  processed_at timestamptz,
  constraint sync_queue_entity_type_check check (
    entity_type in ('profile', 'chamber', 'category', 'trail', 'trail_transfer', 'mound', 'receipt_file')
  ),
  constraint sync_queue_operation_check check (operation in ('insert', 'update', 'soft_delete')),
  constraint sync_queue_attempt_count_check check (attempt_count >= 0),
  constraint sync_queue_idempotency_key_length_check check (char_length(idempotency_key) between 1 and 120)
);

create unique index sync_queue_user_id_idempotency_key_unique
  on public.sync_queue(user_id, idempotency_key);

create table public.sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  local_version integer not null,
  remote_version integer not null,
  conflict_payload jsonb not null,
  resolution text not null default 'unresolved',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint sync_conflicts_versions_check check (local_version >= 0 and remote_version >= 0),
  constraint sync_conflicts_resolution_check check (
    resolution in ('unresolved', 'use_local', 'use_remote', 'manual_merge')
  )
);

create table public.receipt_files (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trail_id uuid references public.trails(id),
  storage_path text not null,
  mime_type text not null,
  size_bytes integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  constraint receipt_files_size_check check (size_bytes > 0 and size_bytes <= 10485760),
  constraint receipt_files_mime_type_check check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')
  ),
  constraint receipt_files_storage_path_length_check check (char_length(storage_path) between 1 and 500)
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint activity_events_event_type_length_check check (char_length(event_type) between 1 and 120)
);

create index chambers_user_id_updated_at_idx on public.chambers(user_id, updated_at desc);
create index categories_user_id_updated_at_idx on public.categories(user_id, updated_at desc);
create index trails_user_id_occurred_on_idx on public.trails(user_id, occurred_on desc);
create index trails_user_id_updated_at_idx on public.trails(user_id, updated_at desc);
create index mounds_user_id_updated_at_idx on public.mounds(user_id, updated_at desc);
create index sync_queue_user_id_processed_at_idx on public.sync_queue(user_id, processed_at, created_at);
create index sync_conflicts_user_id_resolution_idx on public.sync_conflicts(user_id, resolution, created_at desc);
create index receipt_files_user_id_trail_id_idx on public.receipt_files(user_id, trail_id);

create or replace function public.validate_trail_ownership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.chambers
    where id = new.chamber_id and user_id = new.user_id and deleted_at is null
  ) then
    raise exception 'Trail chamber does not belong to authenticated user';
  end if;

  if new.transfer_chamber_id is not null and not exists (
    select 1 from public.chambers
    where id = new.transfer_chamber_id and user_id = new.user_id and deleted_at is null
  ) then
    raise exception 'Transfer chamber does not belong to authenticated user';
  end if;

  if new.category_id is not null and not exists (
    select 1 from public.categories
    where id = new.category_id and user_id = new.user_id and deleted_at is null
  ) then
    raise exception 'Trail category does not belong to authenticated user';
  end if;

  return new;
end;
$$;

create trigger validate_trail_ownership_before_write
before insert or update on public.trails
for each row execute function public.validate_trail_ownership();

create or replace function public.validate_transfer_ownership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.trails
    where id = new.trail_id and user_id = new.user_id and trail_type = 'transfer' and deleted_at is null
  ) then
    raise exception 'Transfer trail does not belong to authenticated user';
  end if;

  if not exists (
    select 1 from public.chambers
    where id = new.source_chamber_id and user_id = new.user_id and deleted_at is null
  ) then
    raise exception 'Source chamber does not belong to authenticated user';
  end if;

  if not exists (
    select 1 from public.chambers
    where id = new.destination_chamber_id and user_id = new.user_id and deleted_at is null
  ) then
    raise exception 'Destination chamber does not belong to authenticated user';
  end if;

  return new;
end;
$$;

create trigger validate_transfer_ownership_before_write
before insert or update on public.trail_transfers
for each row execute function public.validate_transfer_ownership();

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger chambers_set_updated_at before update on public.chambers
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger trails_set_updated_at before update on public.trails
for each row execute function public.set_updated_at();
create trigger trail_transfers_set_updated_at before update on public.trail_transfers
for each row execute function public.set_updated_at();
create trigger mounds_set_updated_at before update on public.mounds
for each row execute function public.set_updated_at();
create trigger sync_queue_set_updated_at before update on public.sync_queue
for each row execute function public.set_updated_at();
create trigger receipt_files_set_updated_at before update on public.receipt_files
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.chambers enable row level security;
alter table public.categories enable row level security;
alter table public.trails enable row level security;
alter table public.trail_transfers enable row level security;
alter table public.mounds enable row level security;
alter table public.sync_queue enable row level security;
alter table public.sync_conflicts enable row level security;
alter table public.receipt_files enable row level security;
alter table public.activity_events enable row level security;

create policy "profiles are owned by authenticated user" on public.profiles
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "chambers are owned by authenticated user" on public.chambers
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories are owned by authenticated user" on public.categories
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "trails are owned by authenticated user" on public.trails
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "trail transfers are owned by authenticated user" on public.trail_transfers
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mounds are owned by authenticated user" on public.mounds
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sync queue rows are owned by authenticated user" on public.sync_queue
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sync conflicts are owned by authenticated user" on public.sync_conflicts
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "receipt files are owned by authenticated user" on public.receipt_files
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activity events are readable by owner" on public.activity_events
for select to authenticated using (auth.uid() = user_id);

create view public.nest_value_summary
with (security_invoker = true)
as
select
  user_id,
  currency,
  coalesce(sum(balance_minor_units) filter (where deleted_at is null), 0) as nest_value_minor_units,
  count(*) filter (where deleted_at is null) as active_chamber_count
from public.chambers
group by user_id, currency;
