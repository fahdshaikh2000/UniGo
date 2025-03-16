# UniGo - University Carpooling Platform Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component Structure](#component-structure)
4. [Pages](#pages)
5. [Features](#features)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [Ride Creation and Management](#ride-creation-and-management)
9. [User Profiles](#user-profiles)
10. [Technical Stack](#technical-stack)
11. [Environment Setup](#environment-setup)
12. [Deployment](#deployment)

## Project Overview

UniGo is a secure, university-exclusive carpooling platform that connects students traveling similar routes, allowing them to split costs while ensuring safety through ID verification and real-time tracking. The platform focuses on providing a safe, cost-effective, and eco-friendly transportation solution for university students.

### Key Features

- Student-focused ride matching with filters for destination, gender preference, and scheduling options
- University ID verification system with optional dashcam monitoring for enhanced security
- Dynamic fare calculator ensuring transparent cost-sharing based on distance traveled
- Real-time ride tracking with emergency SOS button and in-app messaging
- Community features including ratings, reviews, and eco-friendly badges for frequent carpoolers

## Architecture

The application is built using a modern React frontend with Vite as the build tool. It uses Supabase for backend services including authentication, database, and storage. The application follows a component-based architecture with reusable UI components and page-level components.

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
└── tempobook/              # Storyboard files for development
```

## Component Structure

### UI Components (Shadcn)

The application uses Shadcn UI components for consistent styling and behavior. These components are located in `src/components/ui/` and include:

- Button, Input, Textarea, Select, etc.
- Dialog, Modal, Popover
- Card, Badge, Avatar
- Form elements and validation

### Authentication Components

Components related to user authentication are located in `src/components/auth/`:

- **AuthModal**: Modal container for login and registration forms
- **LoginForm**: Form for user login
- **RegisterForm**: Form for user registration with university ID verification

### Dashboard Components

Components for the user dashboard are located in `src/components/dashboard/`:

- **DashboardHeader**: Header with user information and quick stats
- **EcoBadges**: Display of eco-friendly achievements
- **QuickActions**: Quick action buttons for common tasks
- **RideCards**: Display of upcoming and recent rides
- **SavingsHighlight**: Display of cost and environmental savings

### Home Components

Components for the landing page are located in `src/components/home/`:

- **Hero**: Hero section with call-to-action
- **FeatureHighlights**: Highlights of key platform features
- **UserTestimonialCollage**: Display of user testimonials

### Profile Components

Components for user profiles are located in `src/components/profile/`:

- **ProfileHeader**: User profile header with photo and basic info
- **RideHistory**: History of past rides
- **EcoAchievements**: Environmental impact achievements
- **VehicleManager**: Management of user vehicles
- **VerificationUploader**: Upload and verification of university ID

### Ride Components

Components for ride creation, search, and management are located in `src/components/rides/`:

- **CreateRideForm**: Multi-step form for creating a new ride
- **MapSelector**: Selection of pickup and dropoff locations
- **RideCard**: Display of a single ride with details
- **RideSearchFilters**: Filters for searching rides
- **RideSearchResults**: Display of search results
- **RideInfo**: Detailed information about a ride
- **RideChat**: Chat interface for ride participants
- **RideTracking**: Real-time tracking of active rides

## Pages

The application has the following main pages:

### Home Page

The landing page for the application, accessible to all users. It includes:

- Hero section with call-to-action
- Feature highlights
- User testimonials
- Login/Register buttons

### Dashboard

The main page for authenticated users, showing:

- Upcoming rides
- Recent activity
- Quick actions
- Eco-friendly statistics

### Create Ride

A multi-step form for creating a new ride, including:

- Route selection with map
- Date and time selection
- Vehicle details
- Passenger preferences
- Pricing

### Find Ride

Search interface for finding available rides, including:

- Search filters (location, date, time, gender preference)
- Search results with ride cards
- Quick booking options

### Ride Details

Detailed view of a specific ride, including:

- Ride information (route, time, driver, vehicle)
- Passenger list
- Chat interface
- Tracking map

### Profile

User profile page, including:

- Personal information
- Ride history
- Eco achievements
- Vehicle management
- ID verification

## Features

### Authentication

- Email/password authentication via Supabase Auth
- University ID verification process
- Protected routes for authenticated users

### Ride Management

- Create, edit, and delete rides
- Search for rides with filters
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

## Database Schema

The application uses Supabase as the backend, with the following main tables:

### Users

Stores user information and authentication details.

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

### Rides

Stores information about rides.

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

## Authentication Flow

1. User registers with email and password
2. User uploads university ID for verification
3. Admin reviews ID (or automated verification)
4. Once verified, user gains full access to the platform

## Ride Creation and Management

### Creating a Ride

1. User navigates to Create Ride page
2. User fills out multi-step form:
   - Route selection (origin, destination)
   - Date and time
   - Vehicle details
   - Passenger preferences
   - Pricing
3. User submits the form
4. Ride is created and appears in search results

### Finding a Ride

1. User navigates to Find Ride page
2. User sets search filters (location, date, time, gender preference)
3. User views search results
4. User requests to join a ride
5. Driver approves or rejects the request

### During a Ride

1. Participants can chat with each other
2. Real-time tracking is available
3. Emergency SOS button is available
4. Notifications for important updates

### After a Ride

1. Users rate each other
2. Eco-friendly statistics are updated
3. Ride history is updated

## User Profiles

### Profile Information

- Personal information (name, photo)
- University affiliation
- Verification status
- Rating and reviews

### Vehicle Management

- Add, edit, and delete vehicles
- Vehicle details (make, model, year, color, license plate)
- Vehicle verification

### Eco Achievements

- Carbon emissions saved
- Number of rides shared
- Eco-friendly badges
- Leaderboard position

## Technical Stack

### Frontend

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Vite**: Build tool and development server
- **React Router**: Routing library for React
- **React Hook Form**: Form handling library
- **Zod**: Schema validation library
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI
- **Lucide React**: Icon library

### Backend

- **Supabase**: Backend-as-a-Service platform
  - **Authentication**: User authentication and management
  - **Database**: PostgreSQL database
  - **Storage**: File storage for user uploads
  - **Realtime**: Real-time subscriptions

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

## Conclusion

UniGo is a comprehensive carpooling platform designed specifically for university students. It provides a secure, cost-effective, and eco-friendly transportation solution with features like ID verification, real-time tracking, and community engagement. The application is built with modern web technologies and follows best practices for security, performance, and user experience.
