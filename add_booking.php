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
    $required = ['property_id', 'guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            exit;
        }
    }
    
    // Get property price for cost calculation
    $stmt = $pdo->prepare("SELECT price FROM properties WHERE id = ?");
    $stmt->execute([$input['property_id']]);
    $property = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$property) {
        http_response_code(404);
        echo json_encode(['error' => 'Property not found']);
        exit;
    }
    
    // Calculate total cost
    $check_in = new DateTime($input['check_in']);
    $check_out = new DateTime($input['check_out']);
    $days = $check_in->diff($check_out)->days;
    $monthly_rate = $property['price'];
    $total_cost = ceil(($days / 30) * $monthly_rate);
    
    // Insert booking
    $stmt = $pdo->prepare("
        INSERT INTO bookings (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, special_requests, total_cost) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $input['property_id'],
        $input['guest_name'],
        $input['guest_email'],
        $input['guest_phone'],
        $input['check_in'],
        $input['check_out'],
        $input['guests'],
        $input['special_requests'] ?? null,
        $total_cost
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Booking created successfully',
        'booking_id' => $pdo->lastInsertId(),
        'total_cost' => $total_cost
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>