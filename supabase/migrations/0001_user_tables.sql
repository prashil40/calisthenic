-- Zero to Bar — user data
--
-- Run this once in the Supabase SQL editor.
--
-- Only the USER half is here. Reference data (movements, rungs, cues, the
-- program shape) stays in the app bundle for now: it is version-controlled
-- with the code that renders it and has to be available offline anyway.
-- So the columns below name exercises by their stable SLUG rather than by
-- a foreign key into tables that do not exist yet. Those slugs are the same
-- ids already used in src/app.js, and adding real reference tables later is
-- an additive migration, not a rewrite.

-- ---------------------------------------------------------------- profile
create table public.profiles (
  user_id      uuid primary key references auth.users on delete cascade,
  program_slug text        not null default 'zero-to-bar',
  started_on   date        not null default current_date,
  theme        text        not null default 'auto',
  updated_at   timestamptz not null default now()
);

create table public.user_equipment (
  user_id        uuid        not null references auth.users on delete cascade,
  equipment_slug text        not null,
  owned          boolean     not null default false,
  updated_at     timestamptz not null default now(),
  primary key (user_id, equipment_slug)
);

create table public.user_levels (
  user_id       uuid        not null references auth.users on delete cascade,
  movement_slug text        not null,
  rung_slug     text        not null,
  updated_at    timestamptz not null default now(),
  primary key (user_id, movement_slug)
);

-- ------------------------------------------------------------------- days
-- `day` is a DATE, not a timestamptz: a training day is a calendar day. A
-- session logged at 11pm must not land on tomorrow for a device in another
-- timezone.
create table public.workout_days (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users on delete cascade,
  day          date        not null,
  day_kind     text        not null check (day_kind in ('A','B','C','M','R')),
  note         text        not null default '',
  marked_done  boolean     not null default false,
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  unique (user_id, day)
);

-- One row per set. Not an array: an array cannot be indexed, cannot be
-- edited without read-modify-write, and cannot carry its own rung.
--
-- rung_slug is what makes history honest — eight wall push-ups and eight
-- diamond push-ups are not the same result. It is nullable ONLY so that
-- logs imported from the localStorage era, which never recorded it, can be
-- stored truthfully rather than back-filled with a guess.
create table public.set_entries (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users on delete cascade,
  workout_day_id uuid        not null references public.workout_days on delete cascade,
  movement_slug  text        not null,
  rung_slug      text,
  set_index      smallint    not null check (set_index >= 0),
  value          integer     not null check (value >= 0),
  unit           text        not null check (unit in ('reps','sec')),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  unique (workout_day_id, movement_slug, set_index)
);

create table public.recovery_checks (
  user_id        uuid        not null references auth.users on delete cascade,
  workout_day_id uuid        not null references public.workout_days on delete cascade,
  item_slug      text        not null,
  done           boolean     not null default false,
  updated_at     timestamptz not null default now(),
  primary key (user_id, workout_day_id, item_slug)
);

-- ---------------------------------------------------------------- indexes
create index on public.workout_days (user_id, day desc);
create index on public.workout_days (user_id, updated_at);
create index on public.set_entries  (workout_day_id);
create index on public.set_entries  (user_id, rung_slug, value desc);
create index on public.set_entries  (user_id, updated_at);

-- ------------------------------------------------------- server-set clock
-- updated_at is stamped by the server, never accepted from the client: a
-- phone with a wrong clock would otherwise win or lose every merge forever.
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','user_equipment','user_levels',
                           'workout_days','set_entries','recovery_checks']
  loop
    execute format(
      'create trigger t_touch before update on public.%I
         for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ------------------------------------------------------------------- RLS
-- `using` governs which rows can be READ. Without `with check`, a client
-- could INSERT a row carrying someone else's user_id. Both clauses, every
-- table, every time.
do $$
declare t text;
begin
  foreach t in array array['profiles','user_equipment','user_levels',
                           'workout_days','set_entries','recovery_checks']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id)', t);
  end loop;
end $$;

-- ------------------------------------------------- profile on signup
-- Every signed-up user gets a profile row, so the client never has to
-- special-case "logged in but no profile yet".
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
