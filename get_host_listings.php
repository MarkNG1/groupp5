<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'config.php';

try {
    // Get all properties with booking counts
    $stmt = $pdo->query("
        SELECT p.*, 
               COUNT(b.id) as total_bookings,
               COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bookings,
               COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
               MAX(b.created_at) as last_booking
        FROM properties p 
        LEFT JOIN bookings b ON p.id = b.property_id 
        GROUP BY p.id 
        ORDER BY p.created_at DESC
    ");
    
    $listings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $listing = [
            'id' => $row['id'],
            'name' => $row['name'],
            'address' => $row['address'],
            'price' => (float)$row['price'],
            'beds' => (int)$row['beds'],
            'baths' => (int)$row['baths'],
            'thumbnail' => $row['thumbnail'],
            'rating' => $row['rating'] ? (float)$row['rating'] : 0,
            'description' => $row['description'],
            'amenities' => $row['amenities'] ? explode(',', $row['amenities']) : [],
            'photos' => $row['photos'] ? explode(',', $row['photos']) : [],
            'created_at' => $row['created_at'],
            'stats' => [
                'total_bookings' => (int)$row['total_bookings'],
                'pending_bookings' => (int)$row['pending_bookings'],
                'confirmed_bookings' => (int)$row['confirmed_bookings'],
                'last_booking' => $row['last_booking']
            ]
        ];
        $listings[] = $listing;
    }
    
    echo json_encode($listings);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>