# UniGo Database Schema

## Overview

UniGo uses Supabase as its backend service, which provides a PostgreSQL database. The database schema is designed to support the core features of the carpooling platform, including user profiles, rides, ride participants, and messaging.

## Tables

### Profiles

Stores user profile information, extending the Supabase Auth users.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  university_id text,
  verification_status text default 'unverified',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### Columns

- `id`: UUID, primary key, references auth.users
- `first_name`: Text, user's first name
- `last_name`: Text, user's last name
- `avatar_url`: Text, URL to user's avatar image
- `university_id`: Text, user's university ID number
- `verification_status`: Text, status of ID verification (unverified, pending, verified, rejected)
- `created_at`: Timestamp, when the profile was created
- `updated_at`: Timestamp, when the profile was last updated

### Rides

Stores information about rides offered by drivers.

```sql
create table public.rides (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles not null,
  origin text not null,
  destination text not null,
  date date not null,
  time time not null,
  available_seats integer not null,
  gender_preference text,
  price numeric not null,
  car_model text not null,
  additional_info text,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### Columns

- `id`: UUID, primary key
- `driver_id`: UUID, references profiles.id, the user offering the ride
- `origin`: Text, pickup location
- `destination`: Text, dropoff location
- `date`: Date, when the ride is scheduled
- `time`: Time, when the ride is scheduled
- `available_seats`: Integer, number of available seats
- `gender_preference`: Text, gender preference for passengers (any, male, female)
- `price`: Numeric, price per passenger
- `car_model`: Text, model of the car
- `additional_info`: Text, any additional information about the ride
- `status`: Text, status of the ride (active, completed, cancelled)
- `created_at`: Timestamp, when the ride was created
- `updated_at`: Timestamp, when the ride was last updated

### Ride Participants

Stores information about passengers for each ride.

```sql
create table public.ride_participants (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references public.rides not null,
  user_id uuid references public.profiles not null,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(ride_id, user_id)
);
```

#### Columns

- `id`: UUID, primary key
- `ride_id`: UUID, references rides.id, the ride being joined
- `user_id`: UUID, references profiles.id, the user joining the ride
- `status`: Text, status of the participation (pending, approved, rejected, cancelled)
- `created_at`: Timestamp, when the participation was created
- `updated_at`: Timestamp, when the participation was last updated

### Messages

Stores chat messages between ride participants.

```sql
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references public.rides not null,
  sender_id uuid references public.profiles not null,
  content text not null,
  created_at timestamp with time zone default now()
);
```

#### Columns

- `id`: UUID, primary key
- `ride_id`: UUID, references rides.id, the ride the message is for
- `sender_id`: UUID, references profiles.id, the user sending the message
- `content`: Text, the message content
- `created_at`: Timestamp, when the message was created

### Universities

Stores information about supported universities.

```sql
create table public.universities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  domain text not null unique,
  logo_url text,
  created_at timestamp with time zone default now()
);
```

#### Columns

- `id`: UUID, primary key
- `name`: Text, name of the university
- `domain`: Text, email domain of the university (e.g., lums.edu.pk)
- `logo_url`: Text, URL to university logo
- `created_at`: Timestamp, when the university was added

### Vehicles

Stores information about user vehicles.

```sql
create table public.vehicles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles not null,
  make text not null,
  model text not null,
  year integer not null,
  color text not null,
  license_plate text not null,
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### Columns

- `id`: UUID, primary key
- `user_id`: UUID, references profiles.id, the owner of the vehicle
- `make`: Text, make of the vehicle
- `model`: Text, model of the vehicle
- `year`: Integer, year of the vehicle
- `color`: Text, color of the vehicle
- `license_plate`: Text, license plate number
- `is_verified`: Boolean, whether the vehicle is verified
- `created_at`: Timestamp, when the vehicle was added
- `updated_at`: Timestamp, when the vehicle was last updated

### Ratings

Stores user ratings for rides.

```sql
create table public.ratings (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references public.rides not null,
  rater_id uuid references public.profiles not null,
  rated_id uuid references public.profiles not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  unique(ride_id, rater_id, rated_id)
);
```

#### Columns

- `id`: UUID, primary key
- `ride_id`: UUID, references rides.id, the ride being rated
- `rater_id`: UUID, references profiles.id, the user giving the rating
- `rated_id`: UUID, references profiles.id, the user being rated
- `rating`: Integer, the rating (1-5)
- `comment`: Text, optional comment with the rating
- `created_at`: Timestamp, when the rating was created

## Relationships

### One-to-Many Relationships

- One profile can have many rides (as driver)
- One profile can have many ride participations (as passenger)
- One profile can have many messages
- One profile can have many vehicles
- One ride can have many participants
- One ride can have many messages

### Many-to-Many Relationships

- Many profiles can participate in many rides (through ride_participants)
- Many profiles can rate many other profiles (through ratings)

## Row-Level Security Policies

Supabase uses PostgreSQL's Row-Level Security (RLS) to control access to data. Here are some example policies for the UniGo database:

### Profiles Table

```sql
-- Allow users to read any profile
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Rides Table

```sql
-- Allow users to read any ride
CREATE POLICY "Rides are viewable by everyone" ON rides
  FOR SELECT USING (true);

-- Allow users to create rides
CREATE POLICY "Users can create rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- Allow users to update their own rides
CREATE POLICY "Users can update their own rides" ON rides
  FOR UPDATE USING (auth.uid() = driver_id);

-- Allow users to delete their own rides
CREATE POLICY "Users can delete their own rides" ON rides
  FOR DELETE USING (auth.uid() = driver_id);
```

### Ride Participants Table

```sql
-- Allow users to read ride participants
CREATE POLICY "Ride participants are viewable by everyone" ON ride_participants
  FOR SELECT USING (true);

-- Allow users to join rides
CREATE POLICY "Users can join rides" ON ride_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own participation
CREATE POLICY "Users can update their own participation" ON ride_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow ride drivers to update participation
CREATE POLICY "Drivers can update participation" ON ride_participants
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT driver_id FROM rides WHERE id = ride_participants.ride_id
    )
  );
```

### Messages Table

```sql
-- Allow ride participants to read messages
CREATE POLICY "Ride participants can read messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM ride_participants WHERE ride_id = messages.ride_id
      UNION
      SELECT driver_id FROM rides WHERE id = messages.ride_id
    )
  );

-- Allow ride participants to send messages
CREATE POLICY "Ride participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT user_id FROM ride_participants WHERE ride_id = messages.ride_id
      UNION
      SELECT driver_id FROM rides WHERE id = messages.ride_id
    )
  );
```

## Indexes

To optimize query performance, the following indexes are recommended:

```sql
-- Rides table indexes
CREATE INDEX rides_driver_id_idx ON rides (driver_id);
CREATE INDEX rides_date_idx ON rides (date);
CREATE INDEX rides_status_idx ON rides (status);

-- Ride participants table indexes
CREATE INDEX ride_participants_ride_id_idx ON ride_participants (ride_id);
CREATE INDEX ride_participants_user_id_idx ON ride_participants (user_id);
CREATE INDEX ride_participants_status_idx ON ride_participants (status);

-- Messages table indexes
CREATE INDEX messages_ride_id_idx ON messages (ride_id);
CREATE INDEX messages_sender_id_idx ON messages (sender_id);
CREATE INDEX messages_created_at_idx ON messages (created_at);

-- Ratings table indexes
CREATE INDEX ratings_ride_id_idx ON ratings (ride_id);
CREATE INDEX ratings_rater_id_idx ON ratings (rater_id);
CREATE INDEX ratings_rated_id_idx ON ratings (rated_id);
```

## Triggers

Triggers can be used to automate certain actions in the database:

```sql
-- Update the updated_at timestamp when a profile is updated
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Update the updated_at timestamp when a ride is updated
CREATE TRIGGER set_updated_at_rides
BEFORE UPDATE ON rides
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Update the updated_at timestamp when a ride participant is updated
CREATE TRIGGER set_updated_at_ride_participants
BEFORE UPDATE ON ride_participants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Function to set updated_at to current timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Migrations

Database migrations are stored in the `supabase/migrations` directory and are applied in order of their timestamp prefix. Each migration file contains SQL statements to create, alter, or drop database objects.

Example migration files:

- `20240601000000_create_messages_table.sql`
- `20240601000001_create_ride_participants_table.sql`
- `20240601000002_create_rides_table.sql`
- `20240601000003_create_profiles_table.sql`
- `20240602000000_add_universities.sql`

## Conclusion

The UniGo database schema is designed to support the core features of the carpooling platform, with tables for user profiles, rides, ride participants, and messaging. The schema includes relationships, indexes, and security policies to ensure data integrity and access control.
