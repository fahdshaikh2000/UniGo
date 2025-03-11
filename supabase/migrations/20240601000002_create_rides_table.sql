-- Create rides table
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    available_seats INTEGER NOT NULL CHECK (available_seats > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    car_model TEXT,
    car_color TEXT,
    license_plate TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (driver_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);

-- Enable Row Level Security
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read rides
CREATE POLICY "Anyone can read rides" ON public.rides
    FOR SELECT
    USING (true);

-- Create policy to allow users to create their own rides
CREATE POLICY "Users can create their own rides" ON public.rides
    FOR INSERT
    WITH CHECK (driver_id = auth.uid());

-- Create policy to allow users to update their own rides
CREATE POLICY "Users can update their own rides" ON public.rides
    FOR UPDATE
    USING (driver_id = auth.uid());

-- Create policy to allow users to delete their own rides
CREATE POLICY "Users can delete their own rides" ON public.rides
    FOR DELETE
    USING (driver_id = auth.uid());
