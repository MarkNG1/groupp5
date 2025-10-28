<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM properties ORDER BY created_at DESC");
    $properties = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $property = [
            'id' => $row['id'],
            'name' => $row['name'],
            'address' => $row['address'],
            'price' => (float)$row['price'],
            'beds' => (int)$row['beds'],
            'baths' => (int)$row['baths'],
            'thumbnail' => $row['thumbnail'],
            'rating' => $row['rating'] ? (float)$row['rating'] : 0,
            'description' => $row['description'],
            'location' => [
                'country' => 'Kenya',
                'state' => 'Central Kenya',
                'city' => 'Murang\'a'
            ],
            'coordinates' => [
                'lat' => $row['latitude'] ? (float)$row['latitude'] : null,
                'lng' => $row['longitude'] ? (float)$row['longitude'] : null
            ],
            'amenities' => $row['amenities'] ? explode(',', $row['amenities']) : [],
            'photos' => $row['photos'] ? explode(',', $row['photos']) : []
        ];
        $properties[] = $property;
    }
    
    echo json_encode($properties);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>