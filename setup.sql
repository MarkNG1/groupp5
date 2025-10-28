-- Create database and tables for Murang'a Properties
CREATE DATABASE IF NOT EXISTS muranga_properties;
USE muranga_properties;

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    beds INT NOT NULL,
    baths INT NOT NULL,
    thumbnail VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0,
    description TEXT,
    amenities TEXT,
    photos TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id VARCHAR(50),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL,
    special_requests TEXT,
    total_cost DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Insert existing properties from data.js
INSERT IGNORE INTO properties (id, name, address, price, beds, baths, thumbnail, rating, description, amenities, photos, latitude, longitude) VALUES
('p-001', 'Green Valley Apartments', '123 Valley Road, Murang\'a', 8500.00, 2, 1, 'images/outdoors/o1.jpeg', 4.3, 'Modern apartments with stunning views of the surrounding hills. Perfect for students and young professionals.', 'Wi‑Fi,Laundry,CCTV,Parking', 'images/outdoors/o1.jpeg,images/indoor/d1.jpeg,images/indoor/d2.jpeg', -0.7200, 37.1500),
('p-002', 'Sunset Heights Residences', '45 Sunset Street, Murang\'a', 12000.00, 3, 2, 'images/outdoors/o2.jpeg', 4.6, 'Spacious family units with beautiful sunset views. Features modern amenities and secure environment.', 'Wi‑Fi,Parking,Kitchen,24/7 Security,Gym', 'images/outdoors/o2.jpeg,images/indoor/d3.jpeg,images/indoor/d4.jpeg', -0.7185, 37.1525),
('p-003', 'The Scholar\'s Inn', '78 Learning Drive, Murang\'a', 6500.00, 1, 1, 'images/outdoors/o3.jpeg', 4.1, 'Budget-friendly accommodation designed for students. Clean, safe, and conveniently located.', 'Wi‑Fi,Laundry,Study Room', 'images/outdoors/o3.jpeg,images/indoor/d5.jpeg,images/indoor/d6.jpeg', -0.7225, 37.1475),
('p-004', 'Murang\'a Gardens Estate', '156 Garden Avenue, Murang\'a', 15000.00, 4, 3, 'images/outdoors/o4.jpeg', 4.7, 'Luxury family homes in a gated community. Perfect for families and professionals seeking premium living.', 'Wi‑Fi,Gym,Swimming Pool,CCTV,Parking,Garden', 'images/outdoors/o4.jpeg,images/indoor/d7.jpeg,images/indoor/d9.jpeg', -0.7155, 37.1555),
('p-005', 'The Cornerstone Suites', '92 Foundation Lane, Murang\'a', 9500.00, 2, 2, 'images/outdoors/o5.jpeg', 4.4, 'Comfortable suites with kitchen facilities, ideal for young couples and working professionals.', 'Wi‑Fi,Kitchen,Parking,Laundry', 'images/outdoors/o5.jpeg,images/indoor/d10.jpeg,images/indoor/d1.jpeg', -0.7255, 37.1445),
('p-006', 'The Plaza Apartments', '201 Central Road, Murang\'a', 11000.00, 3, 2, 'images/outdoors/o6.jpeg', 4.5, 'Modern apartments with balcony views, perfect for professionals and families.', 'Wi‑Fi,Parking,Security,Laundry,Balcony', 'images/outdoors/o6.jpeg,images/indoor/d2.jpeg,images/indoor/d3.jpeg', -0.7175, 37.1535),
('p-007', 'Hillcrest Bungalows', '34 Hillcrest Heights, Murang\'a', 18000.00, 4, 3, 'images/outdoors/o7.jpeg', 4.8, 'Spacious bungalows with private gardens, ideal for families seeking tranquility and space.', 'Wi‑Fi,Garden,Parking,Security,Kitchen,Study Area', 'images/outdoors/o7.jpeg,images/indoor/d4.jpeg,images/indoor/d5.jpeg', -0.7195, 37.1515),
('p-008', 'The Learning Lodge', '67 Knowledge Street, Murang\'a', 7500.00, 1, 1, 'images/outdoors/o8.jpeg', 4.0, 'Affordable accommodation with shared facilities and study areas, perfect for students.', 'Wi‑Fi,Laundry,Common Room,Study Area', 'images/outdoors/o8.jpeg,images/indoor/d6.jpeg,images/indoor/d7.jpeg', -0.7235, 37.1465),
('p-009', 'The Manor House', '189 Heritage Avenue, Murang\'a', 13000.00, 3, 2, 'images/outdoors/o9.jpeg', 4.6, 'Premium apartments with modern amenities, perfect for professionals seeking comfort and style.', 'Wi‑Fi,Parking,Security,Garden,Kitchen,Laundry', 'images/outdoors/o9.jpeg,images/indoor/d9.jpeg,images/indoor/d10.jpeg', -0.7165, 37.1545);