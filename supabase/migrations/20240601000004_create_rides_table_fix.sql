-- Create rides table if it doesn't exist
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES profiles(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  available_seats INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  car_model TEXT,
  gender_preference TEXT,
  additional_info TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view all rides" ON rides;
CREATE POLICY "Users can view all rides"
  ON rides FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own rides" ON rides;
CREATE POLICY "Users can insert their own rides"
  ON rides FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Users can update their own rides" ON rides;
CREATE POLICY "Users can update their own rides"
  ON rides FOR UPDATE
  USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Users can delete their own rides" ON rides;
CREATE POLICY "Users can delete their own rides"
  ON rides FOR DELETE
  USING (auth.uid() = driver_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
