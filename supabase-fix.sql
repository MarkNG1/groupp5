-- Safe Supabase Fix - Only creates what's missing
-- Run this in Supabase SQL Editor

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    special_requests TEXT,
    total_cost DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data only if properties table is empty
INSERT INTO properties (id, name, address, price, beds, baths, thumbnail, rating, description, amenities, photos, latitude, longitude) 
SELECT * FROM (VALUES
    ('p-001', 'Green Valley Apartments', '123 Valley Road, Murang''a', 8500.00, 2, 1, 'images/outdoors/o1.jpeg', 4.3, 'Modern apartments with stunning views of the surrounding hills. Perfect for students and young professionals.', ARRAY['Wi‑Fi','Laundry','CCTV','Parking'], ARRAY['images/outdoors/o1.jpeg','images/indoor/d1.jpeg','images/indoor/d2.jpeg'], -0.7200, 37.1500),
    ('p-002', 'Sunset Heights Residences', '45 Sunset Street, Murang''a', 12000.00, 3, 2, 'images/outdoors/o2.jpeg', 4.6, 'Spacious family units with beautiful sunset views. Features modern amenities and secure environment.', ARRAY['Wi‑Fi','Parking','Kitchen','24/7 Security','Gym'], ARRAY['images/outdoors/o2.jpeg','images/indoor/d3.jpeg','images/indoor/d4.jpeg'], -0.7185, 37.1525),
    ('p-003', 'The Scholar''s Inn', '78 Learning Drive, Murang''a', 6500.00, 1, 1, 'images/outdoors/o3.jpeg', 4.1, 'Budget-friendly accommodation designed for students. Clean, safe, and conveniently located.', ARRAY['Wi‑Fi','Laundry','Study Room'], ARRAY['images/outdoors/o3.jpeg','images/indoor/d5.jpeg','images/indoor/d6.jpeg'], -0.7225, 37.1475),
    ('p-004', 'Murang''a Gardens Estate', '156 Garden Avenue, Murang''a', 15000.00, 4, 3, 'images/outdoors/o4.jpeg', 4.7, 'Luxury family homes in a gated community. Perfect for families and professionals seeking premium living.', ARRAY['Wi‑Fi','Gym','Swimming Pool','CCTV','Parking','Garden'], ARRAY['images/outdoors/o4.jpeg','images/indoor/d7.jpeg','images/indoor/d9.jpeg'], -0.7155, 37.1555),
    ('p-005', 'The Cornerstone Suites', '92 Foundation Lane, Murang''a', 9500.00, 2, 2, 'images/outdoors/o5.jpeg', 4.4, 'Comfortable suites with kitchen facilities, ideal for young couples and working professionals.', ARRAY['Wi‑Fi','Kitchen','Parking','Laundry'], ARRAY['images/outdoors/o5.jpeg','images/indoor/d10.jpeg','images/indoor/d1.jpeg'], -0.7255, 37.1445)
) AS new_data(id, name, address, price, beds, baths, thumbnail, rating, description, amenities, photos, latitude, longitude)
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE properties.id = new_data.id);

-- Enable Row Level Security (RLS) - safe to run multiple times
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
DROP POLICY IF EXISTS "Properties are editable by authenticated users" ON properties;
DROP POLICY IF EXISTS "Bookings are viewable by authenticated users" ON bookings;

-- Create policies for public read access
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Bookings are insertable by everyone" ON bookings FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users (for host dashboard)
CREATE POLICY "Properties are editable by authenticated users" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings FOR SELECT USING (auth.role() = 'authenticated');