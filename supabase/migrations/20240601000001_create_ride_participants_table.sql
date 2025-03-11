-- Create ride_participants table to track who is part of a ride
CREATE TABLE IF NOT EXISTS public.ride_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('driver', 'passenger')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE(ride_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ride_participants_ride_id ON public.ride_participants(ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_participants_user_id ON public.ride_participants(user_id);

-- Enable Row Level Security
ALTER TABLE public.ride_participants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read ride participants
CREATE POLICY "Users can read ride participants" ON public.ride_participants
    FOR SELECT
    USING (true);

-- Create policy to allow ride creators to add participants
CREATE POLICY "Ride creators can add participants" ON public.ride_participants
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM rides
            WHERE rides.id = ride_participants.ride_id
            AND rides.driver_id = auth.uid()
        ) OR user_id = auth.uid()
    );

-- Create policy to allow ride creators to update participants
CREATE POLICY "Ride creators can update participants" ON public.ride_participants
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM rides
            WHERE rides.id = ride_participants.ride_id
            AND rides.driver_id = auth.uid()
        )
    );

-- Create policy to allow ride creators to delete participants
CREATE POLICY "Ride creators can delete participants" ON public.ride_participants
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM rides
            WHERE rides.id = ride_participants.ride_id
            AND rides.driver_id = auth.uid()
        ) OR user_id = auth.uid()
    );
