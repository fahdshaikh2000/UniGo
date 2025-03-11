-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_ride_id ON public.messages(ride_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read messages for rides they participate in
CREATE POLICY "Users can read messages for rides they participate in" ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ride_participants
            WHERE ride_participants.ride_id = messages.ride_id
            AND ride_participants.user_id = auth.uid()
        )
    );

-- Create policy to allow users to insert messages for rides they participate in
CREATE POLICY "Users can insert messages for rides they participate in" ON public.messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM ride_participants
            WHERE ride_participants.ride_id = messages.ride_id
            AND ride_participants.user_id = auth.uid()
        )
    );

-- Create policy to allow users to update their own messages
CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE
    USING (sender_id = auth.uid())
    WITH CHECK (sender_id = auth.uid());

-- Create policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" ON public.messages
    FOR DELETE
    USING (sender_id = auth.uid());
