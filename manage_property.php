<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch($method) {
        case 'DELETE':
            // Delete property
            if (empty($input['property_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Property ID required']);
                exit;
            }
            
            $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->execute([$input['property_id']]);
            
            echo json_encode(['success' => true, 'message' => 'Property deleted successfully']);
            break;
            
        case 'PUT':
            // Update property
            if (empty($input['property_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Property ID required']);
                exit;
            }
            
            $amenities = isset($input['amenities']) && is_array($input['amenities']) 
                ? implode(',', $input['amenities']) : '';
            $photos = isset($input['photos']) && is_array($input['photos']) 
                ? implode(',', $input['photos']) : '';
            
            $stmt = $pdo->prepare("
                UPDATE properties 
                SET name = ?, address = ?, price = ?, beds = ?, baths = ?, 
                    thumbnail = ?, description = ?, amenities = ?, photos = ?, 
                    latitude = ?, longitude = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
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
                $input['longitude'] ?? null,
                $input['property_id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Property updated successfully']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>