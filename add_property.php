<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['name']) || empty($input['address']) || empty($input['price']) || 
        empty($input['beds']) || empty($input['baths'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    // Generate unique ID
    $property_id = 'p-' . uniqid();
    
    // Prepare amenities and photos as comma-separated strings
    $amenities = isset($input['amenities']) && is_array($input['amenities']) 
        ? implode(',', $input['amenities']) : '';
    $photos = isset($input['photos']) && is_array($input['photos']) 
        ? implode(',', $input['photos']) : '';
    
    $stmt = $pdo->prepare("
        INSERT INTO properties (id, name, address, price, beds, baths, thumbnail, description, amenities, photos, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $property_id,
        $input['name'],
        $input['address'],
        $input['price'],
        $input['beds'],
        $input['baths'],
        $input['thumbnail'] ?? null,
        $input['description'] ?? null,
        $amenities,
        $photos,
        $input['latitude'] ?? null,
        $input['longitude'] ?? null
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Property added successfully',
        'property_id' => $property_id
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>