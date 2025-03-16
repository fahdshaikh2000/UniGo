# UniGo API Reference

## Overview

UniGo uses Supabase as its backend service, which provides a PostgreSQL database, authentication, storage, and realtime subscriptions. This document outlines the API endpoints and functions used in the application.

## Authentication API

### Sign Up

Registers a new user with email and password.

```typescript
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
```

### Sign In

Signs in an existing user with email and password.

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@university.edu',
  password: 'password123'
});
```

### Sign Out

Signs out the current user.

```typescript
const { error } = await supabase.auth.signOut();
```

### Get User

Retrieves the current user session.

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Reset Password

Sends a password reset email to the user.

```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'example@university.edu'
);
```

## Profiles API

### Get Profile

Retrieves a user's profile by ID.

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Update Profile

Updates a user's profile.

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  })
  .eq('id', userId);
```

### Upload Avatar

Uploads a user's avatar image to storage.

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}.jpg`, file, {
    contentType: 'image/jpeg'
  });
```

### Upload ID Verification

Uploads a user's university ID for verification.

```typescript
const { data, error } = await supabase.storage
  .from('verifications')
  .upload(`${userId}.jpg`, file, {
    contentType: 'image/jpeg'
  });

// Update verification status
const { data: updateData, error: updateError } = await supabase
  .from('profiles')
  .update({
    verification_status: 'pending'
  })
  .eq('id', userId);
```

## Rides API

### Create Ride

Creates a new ride listing.

```typescript
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
```

### Get Rides

Retrieves a list of active rides.

```typescript
const { data, error } = await supabase
  .from('rides')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('status', 'active')
  .gte('date', new Date().toISOString().split('T')[0]);
```

### Get Ride by ID

Retrieves a specific ride by ID.

```typescript
const { data, error } = await supabase
  .from('rides')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('id', rideId)
  .single();
```

### Update Ride

Updates an existing ride.

```typescript
const { data, error } = await supabase
  .from('rides')
  .update({
    available_seats: 2,
    price: 600
  })
  .eq('id', rideId);
```

### Delete Ride

Deletes a ride listing.

```typescript
const { data, error } = await supabase
  .from('rides')
  .delete()
  .eq('id', rideId);
```

### Search Rides

Searches for rides based on filters.

```typescript
const { data, error } = await supabase
  .from('rides')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('status', 'active')
  .eq('origin', 'LUMS Campus')
  .eq('destination', 'Gulberg')
  .eq('date', '2023-05-15')
  .lte('price', 1000);
```

## Ride Participants API

### Request to Join Ride

Requests to join a ride as a passenger.

```typescript
const { data, error } = await supabase
  .from('ride_participants')
  .insert({
    ride_id: rideId,
    user_id: userId,
    status: 'pending'
  });
```

### Approve/Reject Ride Request

Approves or rejects a ride join request.

```typescript
const { data, error } = await supabase
  .from('ride_participants')
  .update({
    status: 'approved' // or 'rejected'
  })
  .eq('id', participantId);
```

### Get Ride Participants

Retrieves participants for a specific ride.

```typescript
const { data, error } = await supabase
  .from('ride_participants')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('ride_id', rideId);
```

### Leave Ride

Leaves a ride as a passenger.

```typescript
const { data, error } = await supabase
  .from('ride_participants')
  .update({
    status: 'cancelled'
  })
  .eq('ride_id', rideId)
  .eq('user_id', userId);
```

## Messages API

### Send Message

Sends a message in a ride chat.

```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    ride_id: rideId,
    sender_id: userId,
    content: 'Hello, I will be at the pickup point in 5 minutes.'
  });
```

### Get Messages

Retrieves messages for a specific ride.

```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('ride_id', rideId)
  .order('created_at', { ascending: true });
```

### Subscribe to Messages

Subscribes to real-time updates for new messages.

```typescript
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `ride_id=eq.${rideId}`
  }, (payload) => {
    // Handle new message
    console.log('New message:', payload.new);
  })
  .subscribe();
```

## Vehicles API

### Add Vehicle

Adds a new vehicle for a user.

```typescript
const { data, error } = await supabase
  .from('vehicles')
  .insert({
    user_id: userId,
    make: 'Honda',
    model: 'City',
    year: 2020,
    color: 'Silver',
    license_plate: 'ABC-123'
  });
```

### Get User Vehicles

Retrieves vehicles for a specific user.

```typescript
const { data, error } = await supabase
  .from('vehicles')
  .select('*')
  .eq('user_id', userId);
```

### Update Vehicle

Updates an existing vehicle.

```typescript
const { data, error } = await supabase
  .from('vehicles')
  .update({
    color: 'Black',
    license_plate: 'XYZ-789'
  })
  .eq('id', vehicleId);
```

### Delete Vehicle

Deletes a vehicle.

```typescript
const { data, error } = await supabase
  .from('vehicles')
  .delete()
  .eq('id', vehicleId);
```

## Ratings API

### Rate User

Rates a user after a ride.

```typescript
const { data, error } = await supabase
  .from('ratings')
  .insert({
    ride_id: rideId,
    rater_id: userId,
    rated_id: ratedUserId,
    rating: 5,
    comment: 'Great driver, very punctual!'
  });
```

### Get User Ratings

Retrieves ratings for a specific user.

```typescript
const { data, error } = await supabase
  .from('ratings')
  .select('*, profiles(first_name, last_name, avatar_url)')
  .eq('rated_id', userId);
```

## Storage API

### Upload File

Uploads a file to storage.

```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('file-path', file, {
    contentType: 'image/jpeg'
  });
```

### Download File

Downloads a file from storage.

```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('file-path');
```

### Get Public URL

Gets a public URL for a file.

```typescript
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('file-path');
```

## Realtime Subscriptions

### Subscribe to Table Changes

Subscribes to real-time updates for a table.

```typescript
const subscription = supabase
  .channel('table-changes')
  .on('postgres_changes', {
    event: '*', // or 'INSERT', 'UPDATE', 'DELETE'
    schema: 'public',
    table: 'table-name'
  }, (payload) => {
    console.log('Change received:', payload);
  })
  .subscribe();
```

### Unsubscribe

Unsubscribes from a channel.

```typescript
supabase.removeChannel(subscription);
```

## Error Handling

All Supabase API calls return an object with `data` and `error` properties. It's important to check for errors before using the data.

```typescript
const { data, error } = await supabase.from('table').select('*');

if (error) {
  console.error('Error fetching data:', error);
  // Handle error (show message, retry, etc.)
  return;
}

// Use data safely
console.log('Data:', data);
```

## Utility Functions

The application includes several utility functions to simplify common API operations:

### `fetchProfile`

Fetches the current user's profile.

```typescript
export const fetchProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};
```

### `createRide`

Creates a new ride listing.

```typescript
export const createRide = async (rideData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('rides')
    .insert({
      driver_id: user.id,
      ...rideData
    })
    .select()
    .single();
    
  return { data, error };
};
```

### `searchRides`

Searches for rides based on filters.

```typescript
export const searchRides = async (filters) => {
  let query = supabase
    .from('rides')
    .select('*, profiles(first_name, last_name, avatar_url)')
    .eq('status', 'active')
    .gte('date', new Date().toISOString().split('T')[0]);
    
  if (filters.origin) {
    query = query.ilike('origin', `%${filters.origin}%`);
  }
  
  if (filters.destination) {
    query = query.ilike('destination', `%${filters.destination}%`);
  }
  
  if (filters.date) {
    query = query.eq('date', filters.date);
  }
  
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  
  if (filters.genderPreference && filters.genderPreference !== 'any') {
    query = query.eq('gender_preference', filters.genderPreference);
  }
  
  const { data, error } = await query;
  
  return { data, error };
};
```

## Conclusion

This API reference provides an overview of the endpoints and functions used in the UniGo application. For more detailed information, refer to the [Supabase documentation](https://supabase.io/docs).
