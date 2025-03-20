# UniGo - University Carpooling Platform

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technical Implementation](#technical-implementation)
5. [Authentication Flow](#authentication-flow)
6. [Database Schema](#database-schema)
7. [Component Structure](#component-structure)
8. [API Reference](#api-reference)
9. [Environment Setup](#environment-setup)
10. [Deployment](#deployment)

## Project Overview

UniGo is a secure, university-exclusive carpooling platform that connects students traveling similar routes, allowing them to split costs while ensuring safety through ID verification and real-time tracking. The platform focuses on providing a safe, cost-effective, and eco-friendly transportation solution for university students.

### Key Features

- Student-focused ride matching with filters for destination, gender preference, and scheduling options
- University ID verification system with optional dashcam monitoring for enhanced security
- Dynamic fare calculator ensuring transparent cost-sharing based on distance traveled
- Real-time ride tracking with emergency SOS button and in-app messaging
- Community features including ratings, reviews, and eco-friendly badges for frequent carpoolers

## Architecture

The application is built using a modern React frontend with Vite as the build tool. It uses Supabase for backend services including authentication, database, storage, and realtime features.

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 6
- **UI Components**: Shadcn UI (based on Radix UI), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

### Directory Structure

```
/
├── public/                 # Static assets
│   └── images/             # Image assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── home/           # Home page components
│   │   ├── layout/         # Layout components
│   │   ├── profile/        # Profile components
│   │   ├── rides/          # Ride-related components
│   │   └── ui/             # Shadcn UI components
│   ├── context/            # React context providers
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── supabase/               # Supabase migrations and functions
│   └── migrations/         # Database migrations
└── docs/                   # Documentation
```

## Features

### Authentication

- Email/password authentication via Supabase Auth
- University ID verification process
- Protected routes for authenticated users
- User profile management

### Ride Management

- Create, edit, and delete rides
- Search for rides with filters (location, date, time, gender preference)
- Join rides as a passenger
- Real-time updates on ride status

### Messaging

- In-app messaging between ride participants
- Notifications for new messages
- Chat history

### Tracking

- Real-time tracking of active rides
- ETA updates
- Emergency SOS button

### Eco-friendly Features

- Calculation of carbon emissions saved
- Eco-friendly badges and achievements
- Leaderboard of top eco-friendly users

## Technical Implementation

### Authentication Implementation

The authentication state is managed using a React context in `src/context/AuthContext.tsx`. This context provides the following functionality:

- User login with email and password
- User registration with profile creation
- Session management
- Loading state handling
- Error handling

```typescript
// Example usage of AuthContext
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();
  
  // Use authentication state and functions
};
```

### Protected Routes

Protected routes are implemented using a `ProtectedRoute` component that checks for authentication status:

```typescript
// Example of protected route usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Supabase Integration

The Supabase client is initialized in `src/lib/supabase.ts` and provides access to all Supabase services:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Authentication Flow

1. **User Registration**:
   - User enters email, password, and personal details
   - Account is created in Supabase Auth
   - Profile record is created in the profiles table
   - User is redirected to ID verification

2. **ID Verification**:
   - User uploads university ID
   - Admin reviews ID (or automated verification)
   - Verification status is updated in the profile

3. **Login**:
   - User enters email and password
   - Supabase Auth validates credentials
   - User session is created
   - Profile data is fetched

4. **Session Management**:
   - Session is checked on app load
   - Auth state change listener updates UI
   - Protected routes check authentication status

## Database Schema

The application uses Supabase as the backend, with the following main tables:

### Profiles Table

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

### Rides Table

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

### Ride Participants Table

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

### Messages Table

```sql
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references public.rides not null,
  sender_id uuid references public.profiles not null,
  content text not null,
  created_at timestamp with time zone default now()
);
```

## Component Structure

### Authentication Components

- **AuthModal**: Modal container for login and registration forms
- **LoginForm**: Form for user login
- **RegisterForm**: Form for user registration with university ID verification

### Dashboard Components

- **DashboardHeader**: Header with user information and quick stats
- **EcoBadges**: Display of eco-friendly achievements
- **QuickActions**: Quick action buttons for common tasks
- **RideCards**: Display of upcoming and recent rides
- **SavingsHighlight**: Display of cost and environmental savings

### Home Components

- **Hero**: Hero section with call-to-action
- **FeatureHighlights**: Highlights of key platform features
- **UserTestimonialCollage**: Display of user testimonials

### Profile Components

- **ProfileHeader**: User profile header with photo and basic info
- **RideHistory**: History of past rides
- **EcoAchievements**: Environmental impact achievements
- **VehicleManager**: Management of user vehicles
- **VerificationUploader**: Upload and verification of university ID

### Ride Components

- **CreateRideForm**: Multi-step form for creating a new ride
- **MapSelector**: Selection of pickup and dropoff locations
- **RideCard**: Display of a single ride with details
- **RideSearchFilters**: Filters for searching rides
- **RideSearchResults**: Display of search results
- **RideInfo**: Detailed information about a ride
- **RideChat**: Chat interface for ride participants
- **RideTracking**: Real-time tracking of active rides

## API Reference

### Authentication API

```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'example@university.edu',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe',
      university_id: '12345'
    }
  }
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@university.edu',
  password: 'password123'
});

// Sign Out
const { error } = await supabase.auth.signOut();

// Get User
const { data: { user } } = await supabase.auth.getUser();
```

### Profiles API

```typescript
// Get Profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Update Profile
const { data, error } = await supabase
  .from('profiles')
  .update({
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  })
  .eq('id', userId);
```

### Rides API

```typescript
// Create Ride
const { data, error } = await supabase
  .from('rides')
  .insert({
    driver_id: userId,
    origin: 'LUMS Campus',
    destination: 'Gulberg',
    date: '2023-05-15',
    time: '15:30:00',
    available_seats: 3,
    gender_preference: 'any',
    price: 500,
    car_model: 'Honda City (2020)',
    additional_info: 'Air conditioned'
  });

// Get Rides
const { data, error } = await supabase
  .from('rides')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('status', 'active')
  .gte('date', new Date().toISOString().split('T')[0]);

// Search Rides
const { data, error } = await supabase
  .from('rides')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('status', 'active')
  .eq('origin', 'LUMS Campus')
  .eq('destination', 'Gulberg')
  .eq('date', '2023-05-15')
  .lte('price', 1000);
```

## Environment Setup

### Environment Variables

The application requires the following environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_SERVICE_KEY=your-service-key
```

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

## Deployment

The application can be deployed to any static hosting service that supports single-page applications. The build process is as follows:

1. Build the application: `npm run build`
2. Deploy the `dist` directory to your hosting service

### Supabase Setup

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` directory
3. Set up authentication providers
4. Configure storage buckets for file uploads
5. Set up row-level security policies

---

This documentation provides an overview of the UniGo carpooling platform, including its architecture, features, technical implementation, and deployment process. For more detailed information on specific components or APIs, refer to the component reference and API reference documentation.
