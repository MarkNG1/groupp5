<?php
// SQLite configuration (no MySQL needed)
try {
    $pdo = new PDO('sqlite:muranga_properties.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create tables if they don't exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            price REAL NOT NULL,
            beds INTEGER NOT NULL,
            baths INTEGER NOT NULL,
            thumbnail TEXT,
            rating REAL DEFAULT 0,
            description TEXT,
            amenities TEXT,
            photos TEXT,
            latitude REAL,
            longitude REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id TEXT,
            guest_name TEXT NOT NULL,
            guest_email TEXT NOT NULL,
            guest_phone TEXT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            guests INTEGER NOT NULL,
            special_requests TEXT,
            total_cost REAL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties(id)
        )
    ");
    
    // Insert sample data if properties table is empty
    $count = $pdo->query("SELECT COUNT(*) FROM properties")->fetchColumn();
    if ($count == 0) {
        $pdo->exec("
            INSERT INTO properties (id, name, address, price, beds, baths, thumbnail, rating, description, amenities, photos, latitude, longitude) VALUES
            ('p-001', 'Green Valley Apartments', '123 Valley Road, Murang''a', 8500.00, 2, 1, 'images/outdoors/o1.jpeg', 4.3, 'Modern apartments with stunning views of the surrounding hills. Perfect for students and young professionals.', 'Wi‑Fi,Laundry,CCTV,Parking', 'images/outdoors/o1.jpeg,images/indoor/d1.jpeg,images/indoor/d2.jpeg', -0.7200, 37.1500),
            ('p-002', 'Sunset Heights Residences', '45 Sunset Street, Murang''a', 12000.00, 3, 2, 'images/outdoors/o2.jpeg', 4.6, 'Spacious family units with beautiful sunset views. Features modern amenities and secure environment.', 'Wi‑Fi,Parking,Kitchen,24/7 Security,Gym', 'images/outdoors/o2.jpeg,images/indoor/d3.jpeg,images/indoor/d4.jpeg', -0.7185, 37.1525),
            ('p-003', 'The Scholar''s Inn', '78 Learning Drive, Murang''a', 6500.00, 1, 1, 'images/outdoors/o3.jpeg', 4.1, 'Budget-friendly accommodation designed for students. Clean, safe, and conveniently located.', 'Wi‑Fi,Laundry,Study Room', 'images/outdoors/o3.jpeg,images/indoor/d5.jpeg,images/indoor/d6.jpeg', -0.7225, 37.1475)
        ");
    }
    
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>