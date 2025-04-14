-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_location JSONB NOT NULL,
  stops JSONB NOT NULL,
  end_location JSONB,
  distance INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  geometry TEXT NOT NULL,
  profile JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS routes_user_id_idx ON routes(user_id);

-- Create index on is_favorite
CREATE INDEX IF NOT EXISTS routes_is_favorite_idx ON routes(is_favorite);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 