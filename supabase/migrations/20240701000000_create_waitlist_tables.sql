-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  phone TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  referrer_id UUID REFERENCES public.waitlist(id),
  referral_count INTEGER DEFAULT 0,
  position INTEGER,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'joined')),
  access_level TEXT DEFAULT 'general' CHECK (access_level IN ('general', 'early_access', 'vip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create waitlist_notifications table
CREATE TABLE IF NOT EXISTS public.waitlist_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  waitlist_id UUID REFERENCES public.waitlist(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'position_update', 'invite')),
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to waitlist for leaderboard" 
ON public.waitlist FOR SELECT 
USING (true);

CREATE POLICY "Allow insert to waitlist" 
ON public.waitlist FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow users to update their own waitlist entry" 
ON public.waitlist FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Allow users to read their own notifications" 
ON public.waitlist_notifications FOR SELECT 
USING (waitlist_id = auth.uid());

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code(name_input TEXT) RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  random_suffix TEXT;
  full_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Create base code from name (first 5 chars)
  base_code := SUBSTRING(REGEXP_REPLACE(name_input, '[^a-zA-Z0-9]', '', 'g'), 1, 5);
  
  -- Generate random suffix
  random_suffix := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  -- Combine
  full_code := UPPER(base_code) || random_suffix;
  
  -- Check if exists
  SELECT EXISTS(SELECT 1 FROM public.waitlist WHERE referral_code = full_code) INTO code_exists;
  
  -- If exists, recursively try again
  IF code_exists THEN
    RETURN generate_referral_code(name_input);
  END IF;
  
  RETURN full_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to update positions
CREATE OR REPLACE FUNCTION update_waitlist_positions() RETURNS TRIGGER AS $$
BEGIN
  -- Update positions based on referral count (higher count = lower position number)
  UPDATE public.waitlist
  SET position = subquery.new_position,
      updated_at = now()
  FROM (
    SELECT id, ROW_NUMBER() OVER (
      ORDER BY 
        CASE WHEN access_level = 'vip' THEN 0
             WHEN access_level = 'early_access' THEN 1
             ELSE 2 END,
        referral_count DESC,
        created_at ASC
    ) AS new_position
    FROM public.waitlist
    WHERE status = 'waiting'
  ) AS subquery
  WHERE public.waitlist.id = subquery.id
  AND public.waitlist.position IS DISTINCT FROM subquery.new_position;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update positions
CREATE TRIGGER update_waitlist_positions_trigger
AFTER INSERT OR UPDATE OF referral_count, access_level, status ON public.waitlist
FOR EACH STATEMENT
EXECUTE FUNCTION update_waitlist_positions();

-- Create function to increment referrer's count
CREATE OR REPLACE FUNCTION increment_referrer_count() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referrer_id IS NOT NULL THEN
    UPDATE public.waitlist
    SET referral_count = referral_count + 1,
        updated_at = now()
    WHERE id = NEW.referrer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment referrer count
CREATE TRIGGER increment_referrer_count_trigger
AFTER INSERT ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION increment_referrer_count();

-- Enable realtime
alter publication supabase_realtime add table waitlist;
alter publication supabase_realtime add table waitlist_notifications;