-- Supabase Schema for Murang'a Properties
-- Run this in Supabase SQL Editor

-- Properties table
CREATE TABLE properties (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    beds INTEGER NOT NULL,
    baths INTEGER NOT NULL,
    thumbnail TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    description TEXT,
    amenities TEXT[], -- PostgreSQL array instead of comma-separated
    photos TEXT[],    -- PostgreSQL array
    country TEXT DEFAULT 'Kenya',
    city TEXT DEFAULT 'Murang''a',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
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

-- Insert sample data
INSERT INTO properties (id, name, address, price, beds, baths, thumbnail, rating, description, amenities, photos, latitude, longitude) VALUES
('p-001', 'Green Valley Apartments', '123 Valley Road, Murang''a', 8500.00, 2, 1, 'images/outdoors/o1.jpeg', 4.3, 'Modern apartments with stunning views of the surrounding hills. Perfect for students and young professionals.', ARRAY['Wi‑Fi','Laundry','CCTV','Parking'], ARRAY['images/outdoors/o1.jpeg','images/indoor/d1.jpeg','images/indoor/d2.jpeg'], -0.7200, 37.1500),
('p-002', 'Sunset Heights Residences', '45 Sunset Street, Murang''a', 12000.00, 3, 2, 'images/outdoors/o2.jpeg', 4.6, 'Spacious family units with beautiful sunset views. Features modern amenities and secure environment.', ARRAY['Wi‑Fi','Parking','Kitchen','24/7 Security','Gym'], ARRAY['images/outdoors/o2.jpeg','images/indoor/d3.jpeg','images/indoor/d4.jpeg'], -0.7185, 37.1525),
('p-003', 'The Scholar''s Inn', '78 Learning Drive, Murang''a', 6500.00, 1, 1, 'images/outdoors/o3.jpeg', 4.1, 'Budget-friendly accommodation designed for students. Clean, safe, and conveniently located.', ARRAY['Wi‑Fi','Laundry','Study Room'], ARRAY['images/outdoors/o3.jpeg','images/indoor/d5.jpeg','images/indoor/d6.jpeg'], -0.7225, 37.1475),
('p-004', 'Murang''a Gardens Estate', '156 Garden Avenue, Murang''a', 15000.00, 4, 3, 'images/outdoors/o4.jpeg', 4.7, 'Luxury family homes in a gated community. Perfect for families and professionals seeking premium living.', ARRAY['Wi‑Fi','Gym','Swimming Pool','CCTV','Parking','Garden'], ARRAY['images/outdoors/o4.jpeg','images/indoor/d7.jpeg','images/indoor/d9.jpeg'], -0.7155, 37.1555),
('p-005', 'The Cornerstone Suites', '92 Foundation Lane, Murang''a', 9500.00, 2, 2, 'images/outdoors/o5.jpeg', 4.4, 'Comfortable suites with kitchen facilities, ideal for young couples and working professionals.', ARRAY['Wi‑Fi','Kitchen','Parking','Laundry'], ARRAY['images/outdoors/o5.jpeg','images/indoor/d10.jpeg','images/indoor/d1.jpeg'], -0.7255, 37.1445);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Bookings are insertable by everyone" ON bookings FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users (for host dashboard)
CREATE POLICY "Properties are editable by authenticated users" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings FOR SELECT USING (auth.role() = 'authenticated');