# UniGo Component Reference

## Table of Contents

1. [Authentication Components](#authentication-components)
2. [Dashboard Components](#dashboard-components)
3. [Home Components](#home-components)
4. [Layout Components](#layout-components)
5. [Profile Components](#profile-components)
6. [Ride Components](#ride-components)
7. [UI Components](#ui-components)

## Authentication Components

### AuthModal

**Path**: `src/components/auth/AuthModal.tsx`

**Description**: Modal container that switches between login and registration forms.

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when modal is closed
- `defaultTab`: String to set the default tab ('login' or 'register')

**Usage**:
```jsx
<AuthModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  defaultTab="login" 
/>
```

### LoginForm

**Path**: `src/components/auth/LoginForm.tsx`

**Description**: Form for user login with email and password.

**Props**:
- `onSuccess`: Function to call on successful login
- `onRegisterClick`: Function to switch to registration form

**Usage**:
```jsx
<LoginForm 
  onSuccess={() => navigate('/dashboard')} 
  onRegisterClick={() => setActiveTab('register')} 
/>
```

### RegisterForm

**Path**: `src/components/auth/RegisterForm.tsx`

**Description**: Form for user registration with email, password, and university details.

**Props**:
- `onSuccess`: Function to call on successful registration
- `onLoginClick`: Function to switch to login form

**Usage**:
```jsx
<RegisterForm 
  onSuccess={() => navigate('/verify')} 
  onLoginClick={() => setActiveTab('login')} 
/>
```

## Dashboard Components

### DashboardHeader

**Path**: `src/components/dashboard/DashboardHeader.tsx`

**Description**: Header component for the dashboard with user information and quick stats.

**Props**:
- `userName`: String for the user's name
- `userAvatar`: String URL for the user's avatar
- `stats`: Object containing dashboard statistics

**Usage**:
```jsx
<DashboardHeader 
  userName="John Doe" 
  userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john" 
  stats={{ rides: 12, saved: 2500, co2: 45 }} 
/>
```

### EcoBadges

**Path**: `src/components/dashboard/EcoBadges.tsx`

**Description**: Component to display eco-friendly achievements and badges.

**Props**:
- `badges`: Array of badge objects
- `level`: Number representing the user's eco level

**Usage**:
```jsx
<EcoBadges 
  badges={[
    { id: 1, name: "Carbon Saver", icon: "leaf", achieved: true },
    { id: 2, name: "Ride Sharer", icon: "users", achieved: true },
    { id: 3, name: "Eco Warrior", icon: "award", achieved: false }
  ]} 
  level={2} 
/>
```

### QuickActions

**Path**: `src/components/dashboard/QuickActions.tsx`

**Description**: Component with quick action buttons for common tasks.

**Props**:
- `onCreateRide`: Function to navigate to create ride page
- `onFindRide`: Function to navigate to find ride page
- `onViewProfile`: Function to navigate to profile page

**Usage**:
```jsx
<QuickActions 
  onCreateRide={() => navigate('/create-ride')} 
  onFindRide={() => navigate('/find-ride')} 
  onViewProfile={() => navigate('/profile')} 
/>
```

### RideCards

**Path**: `src/components/dashboard/RideCards.tsx`

**Description**: Component to display upcoming and recent rides.

**Props**:
- `upcomingRides`: Array of upcoming ride objects
- `pastRides`: Array of past ride objects
- `onViewRide`: Function to navigate to ride details

**Usage**:
```jsx
<RideCards 
  upcomingRides={upcomingRides} 
  pastRides={pastRides} 
  onViewRide={(id) => navigate(`/ride/${id}`)} 
/>
```

### SavingsHighlight

**Path**: `src/components/dashboard/SavingsHighlight.tsx`

**Description**: Component to display cost and environmental savings.

**Props**:
- `totalKmTravelled`: Number of kilometers traveled
- `totalRides`: Number of rides taken
- `fuelEfficiency`: Number representing fuel efficiency (km/l)
- `fuelPrice`: Number representing fuel price per liter

**Usage**:
```jsx
<SavingsHighlight 
  totalKmTravelled={1250} 
  totalRides={24} 
  fuelEfficiency={12} 
  fuelPrice={280} 
/>
```

## Home Components

### Hero

**Path**: `src/components/home/Hero.tsx`

**Description**: Hero section for the landing page with call-to-action.

**Props**:
- `onLoginClick`: Function to open login modal
- `onRegisterClick`: Function to open registration modal

**Usage**:
```jsx
<Hero 
  onLoginClick={() => setAuthModal({ isOpen: true, tab: 'login' })} 
  onRegisterClick={() => setAuthModal({ isOpen: true, tab: 'register' })} 
/>
```

### FeatureHighlights

**Path**: `src/components/home/FeatureHighlights.tsx`

**Description**: Component to highlight key features of the platform.

**Props**:
- `features`: Array of feature objects

**Usage**:
```jsx
<FeatureHighlights 
  features={[
    { title: "Safe Rides", description: "Verified university students only", icon: "shield" },
    { title: "Save Money", description: "Split costs with fellow students", icon: "dollar-sign" },
    { title: "Go Green", description: "Reduce carbon footprint", icon: "leaf" }
  ]} 
/>
```

### UserTestimonialCollage

**Path**: `src/components/home/UserTestimonialCollage.tsx`

**Description**: Component to display user testimonials in a collage format.

**Props**:
- `testimonials`: Array of testimonial objects

**Usage**:
```jsx
<UserTestimonialCollage 
  testimonials={[
    { id: 1, name: "John Doe", avatar: "...", text: "Great experience!", university: "LUMS" },
    { id: 2, name: "Jane Smith", avatar: "...", text: "Saved so much money!", university: "FAST" }
  ]} 
/>
```

## Layout Components

### Navbar

**Path**: `src/components/layout/Navbar.tsx`

**Description**: Navigation bar component with links and authentication buttons.

**Props**:
- `isLoggedIn`: Boolean indicating if user is logged in
- `onLoginClick`: Function to open login modal
- `onRegisterClick`: Function to open registration modal
- `onLogout`: Function to handle logout

**Usage**:
```jsx
<Navbar 
  isLoggedIn={!!user} 
  onLoginClick={() => setAuthModal({ isOpen: true, tab: 'login' })} 
  onRegisterClick={() => setAuthModal({ isOpen: true, tab: 'register' })} 
  onLogout={() => supabase.auth.signOut()} 
/>
```

### Footer

**Path**: `src/components/layout/Footer.tsx`

**Description**: Footer component with links and copyright information.

**Props**: None

**Usage**:
```jsx
<Footer />
```

## Profile Components

### ProfileHeader

**Path**: `src/components/profile/ProfileHeader.tsx`

**Description**: Header component for the profile page with user information.

**Props**:
- `user`: Object containing user information
- `stats`: Object containing user statistics
- `onEditProfile`: Function to open edit profile modal

**Usage**:
```jsx
<ProfileHeader 
  user={user} 
  stats={{ rides: 12, rating: 4.8, joined: "Jan 2023" }} 
  onEditProfile={() => setEditModalOpen(true)} 
/>
```

### RideHistory

**Path**: `src/components/profile/RideHistory.tsx`

**Description**: Component to display user's ride history.

**Props**:
- `rides`: Array of ride objects
- `onViewRide`: Function to navigate to ride details

**Usage**:
```jsx
<RideHistory 
  rides={userRides} 
  onViewRide={(id) => navigate(`/ride/${id}`)} 
/>
```

### EcoAchievements

**Path**: `src/components/profile/EcoAchievements.tsx`

**Description**: Component to display user's environmental impact achievements.

**Props**:
- `stats`: Object containing eco statistics
- `badges`: Array of badge objects

**Usage**:
```jsx
<EcoAchievements 
  stats={{ co2Saved: 45, treeEquivalent: 2, kmShared: 1250 }} 
  badges={userBadges} 
/>
```

### VehicleManager

**Path**: `src/components/profile/VehicleManager.tsx`

**Description**: Component for managing user's vehicles.

**Props**:
- `vehicles`: Array of vehicle objects
- `onAddVehicle`: Function to add a new vehicle
- `onEditVehicle`: Function to edit a vehicle
- `onDeleteVehicle`: Function to delete a vehicle

**Usage**:
```jsx
<VehicleManager 
  vehicles={userVehicles} 
  onAddVehicle={handleAddVehicle} 
  onEditVehicle={handleEditVehicle} 
  onDeleteVehicle={handleDeleteVehicle} 
/>
```

### VerificationUploader

**Path**: `src/components/profile/VerificationUploader.tsx`

**Description**: Component for uploading and verifying university ID.

**Props**:
- `status`: String indicating verification status ('unverified', 'pending', 'verified', 'rejected')
- `onUpload`: Function to handle ID upload

**Usage**:
```jsx
<VerificationUploader 
  status={user.verificationStatus} 
  onUpload={handleIdUpload} 
/>
```

## Ride Components

### CreateRideForm

**Path**: `src/components/rides/CreateRideForm.tsx`

**Description**: Multi-step form for creating a new ride.

**Props**:
- `onSubmit`: Function to handle form submission
- `isSubmitting`: Boolean indicating if form is submitting
- `initialCarModel`: String for pre-filling car model

**Usage**:
```jsx
<CreateRideForm 
  onSubmit={handleCreateRide} 
  isSubmitting={isSubmitting} 
  initialCarModel="Honda City (2020)" 
/>
```

### MapSelector

**Path**: `src/components/rides/MapSelector.tsx`

**Description**: Component for selecting pickup and dropoff locations on a map.

**Props**:
- `onLocationSelect`: Function to handle location selection
- `initialPickup`: String for initial pickup location
- `initialDropoff`: String for initial dropoff location
- `showRoute`: Boolean to control route display

**Usage**:
```jsx
<MapSelector 
  onLocationSelect={(origin, destination) => {
    setValue('origin', origin);
    setValue('destination', destination);
  }} 
  initialPickup="LUMS Campus" 
  initialDropoff="Gulberg" 
  showRoute={true} 
/>
```

### RideCard

**Path**: `src/components/rides/RideCard.tsx`

**Description**: Card component to display a single ride with details.

**Props**:
- `id`: String ID of the ride
- `driverName`: String name of the driver
- `driverAvatar`: String URL of driver's avatar
- `driverRating`: Number rating of the driver
- `origin`: String pickup location
- `destination`: String dropoff location
- `date`: String date of the ride
- `time`: String time of the ride
- `availableSeats`: Number of available seats
- `price`: Number price per seat
- `carModel`: String car model
- `onRequestRide`: Function to request joining the ride

**Usage**:
```jsx
<RideCard 
  id="1" 
  driverName="John Doe" 
  driverAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john" 
  driverRating={4.8} 
  origin="LUMS Campus" 
  destination="Gulberg" 
  date="May 15, 2023" 
  time="3:30 PM" 
  availableSeats={3} 
  price={500} 
  carModel="Honda City (2020)" 
  onRequestRide={() => handleRequestRide("1")} 
/>
```

### RideSearchFilters

**Path**: `src/components/rides/RideSearchFilters.tsx`

**Description**: Component with filters for searching rides.

**Props**:
- `onFilterChange`: Function to handle filter changes
- `initialFilters`: Object with initial filter values

**Usage**:
```jsx
<RideSearchFilters 
  onFilterChange={handleFilterChange} 
  initialFilters={{
    origin: "LUMS Campus",
    destination: "",
    date: new Date(),
    timeRange: { start: "08:00", end: "20:00" },
    genderPreference: "any",
    maxPrice: 1000
  }} 
/>
```

### RideSearchResults

**Path**: `src/components/rides/RideSearchResults.tsx`

**Description**: Component to display search results with ride cards.

**Props**:
- `rides`: Array of ride objects
- `onRequestRide`: Function to request joining a ride
- `onViewRide`: Function to navigate to ride details
- `isLoading`: Boolean indicating if results are loading

**Usage**:
```jsx
<RideSearchResults 
  rides={searchResults} 
  onRequestRide={handleRequestRide} 
  onViewRide={(id) => navigate(`/ride/${id}`)} 
  isLoading={isSearching} 
/>
```

### RideInfo

**Path**: `src/components/rides/RideInfo.tsx`

**Description**: Component to display detailed information about a ride.

**Props**:
- `ride`: Object containing ride details
- `isDriver`: Boolean indicating if current user is the driver
- `onCancelRide`: Function to cancel the ride
- `onLeaveRide`: Function to leave the ride as a passenger

**Usage**:
```jsx
<RideInfo 
  ride={rideDetails} 
  isDriver={rideDetails.driver_id === user.id} 
  onCancelRide={handleCancelRide} 
  onLeaveRide={handleLeaveRide} 
/>
```

### RideChat

**Path**: `src/components/rides/RideChat.tsx`

**Description**: Chat interface for ride participants.

**Props**:
- `rideId`: String ID of the ride
- `userId`: String ID of the current user
- `participants`: Array of participant objects

**Usage**:
```jsx
<RideChat 
  rideId="1" 
  userId={user.id} 
  participants={rideParticipants} 
/>
```

### RideTracking

**Path**: `src/components/rides/RideTracking.tsx`

**Description**: Component for real-time tracking of active rides.

**Props**:
- `rideId`: String ID of the ride
- `origin`: String pickup location
- `destination`: String dropoff location
- `isDriver`: Boolean indicating if current user is the driver
- `onEmergency`: Function to trigger emergency SOS

**Usage**:
```jsx
<RideTracking 
  rideId="1" 
  origin="LUMS Campus" 
  destination="Gulberg" 
  isDriver={isDriver} 
  onEmergency={handleEmergency} 
/>
```

## UI Components

The application uses Shadcn UI components for consistent styling and behavior. These components are located in `src/components/ui/` and include:

- Button, Input, Textarea, Select, etc.
- Dialog, Modal, Popover
- Card, Badge, Avatar
- Form elements and validation

Refer to the [Shadcn UI documentation](https://ui.shadcn.com/) for detailed usage information.
