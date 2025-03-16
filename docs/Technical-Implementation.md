# UniGo Technical Implementation Guide

## Table of Contents

1. [Project Setup](#project-setup)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Integration](#backend-integration)
4. [Authentication Implementation](#authentication-implementation)
5. [Database Schema Implementation](#database-schema-implementation)
6. [Component Implementation](#component-implementation)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Form Handling](#form-handling)
10. [API Integration](#api-integration)
11. [Real-time Features](#real-time-features)
12. [Styling and UI](#styling-and-ui)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Performance Optimization](#performance-optimization)

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/your-org/unigo.git
cd unigo
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_SERVICE_KEY=your-service-key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Frontend Architecture

### Project Structure

The project follows a feature-based structure, with components organized by feature and shared components in a common directory:

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── home/           # Home page components
│   ├── layout/         # Layout components
│   ├── profile/        # Profile components
│   ├── rides/          # Ride-related components
│   └── ui/             # Shadcn UI components
├── context/            # React context providers
├── lib/                # Utility libraries
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Component Hierarchy

The application follows a component hierarchy with pages at the top level, composed of feature components, which in turn are composed of UI components:

1. **Pages**: Top-level components that represent routes in the application
2. **Feature Components**: Components specific to a feature (e.g., CreateRideForm, RideSearchResults)
3. **UI Components**: Reusable UI components (e.g., Button, Card, Input)

## Backend Integration

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Set up the database schema using the migrations in the `supabase/migrations` directory
3. Configure authentication providers (email/password)
4. Set up storage buckets for file uploads
5. Configure row-level security policies

### Supabase Client

The Supabase client is initialized in `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Authentication Implementation

### Auth Context

The authentication state is managed using a React context in `src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(data);
      }
      
      setLoading(false);
    };
    
    getSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setProfile(data);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };
  
  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        university_id: userData.university_id
      });
    }
    
    return { data, error };
  };
  
  const signOut = async () => {
    return supabase.auth.signOut();
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Routes

Protected routes are implemented using a `ProtectedRoute` component in `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireVerification = true 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (requireVerification && profile?.verification_status !== 'verified') {
    return <Navigate to="/verify" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

## Database Schema Implementation

The database schema is implemented using SQL migrations in the `supabase/migrations` directory. Each migration file contains SQL statements to create, alter, or drop database objects.

Example migration file (`20240601000003_create_profiles_table.sql`):

```sql
-- Create profiles table
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

-- Set up row level security
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view any profile"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();
```

## Component Implementation

### Example Component: CreateRideForm

The `CreateRideForm` component is a multi-step form for creating a new ride. It's implemented in `src/components/rides/CreateRideForm.tsx`:

```typescript
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

// Import UI components and icons

const formSchema = z.object({
  origin: z.string().min(3, { message: "Origin is required" }),
  destination: z.string().min(3, { message: "Destination is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  availableSeats: z.number().min(1).max(8),
  genderPreference: z.enum(["any", "male", "female"]),
  price: z.number().min(1),
  carModel: z.string().min(3, { message: "Car model is required" }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRideFormProps {
  onSubmit?: (data: FormValues) => void;
  isSubmitting?: boolean;
  initialCarModel?: string;
}

const CreateRideForm = ({
  onSubmit = () => {},
  isSubmitting = false,
  initialCarModel = "",
}: CreateRideFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      time: "",
      availableSeats: 3,
      genderPreference: "any",
      price: 5,
      carModel: initialCarModel || "",
      additionalInfo: "",
    },
  });

  // Set initial car model when prop changes
  useEffect(() => {
    if (initialCarModel) {
      setValue("carModel", initialCarModel);
    }
  }, [initialCarModel, setValue]);

  const availableSeats = watch("availableSeats");
  const price = watch("price");

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  };

  const handleMapSelection = (origin: string, destination: string) => {
    setValue("origin", origin);
    setValue("destination", destination);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
      <CardContent className="p-6">
        {/* Form content with steps */}
      </CardContent>
    </Card>
  );
};

export default CreateRideForm;
```

## State Management

The application uses a combination of React Context and local component state for state management:

- **Global State**: Managed using React Context (e.g., AuthContext)
- **Component State**: Managed using React's useState and useReducer hooks
- **Form State**: Managed using React Hook Form

### Example: Using AuthContext

```typescript
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user, profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    // Redirect to home page
  };
  
  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {profile?.first_name} {profile?.last_name}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
```

## Routing

The application uses React Router for routing. Routes are defined in `src/App.tsx`:

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import CreateRide from '@/pages/create-ride';
import FindRide from '@/pages/find-ride';
import RideDetails from '@/pages/ride-details/[id]';
import Profile from '@/pages/profile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-ride" element={
            <ProtectedRoute>
              <CreateRide />
            </ProtectedRoute>
          } />
          <Route path="/find-ride" element={
            <ProtectedRoute>
              <FindRide />
            </ProtectedRoute>
          } />
          <Route path="/ride/:id" element={
            <ProtectedRoute>
              <RideDetails />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
```

## Form Handling

The application uses React Hook Form with Zod for form handling and validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
