<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'config.php';

try {
    // Get overall statistics
    $stats = [];
    
    // Total properties
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM properties");
    $stats['total_properties'] = (int)$stmt->fetchColumn();
    
    // Total bookings
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings");
    $stats['total_bookings'] = (int)$stmt->fetchColumn();
    
    // Total revenue
    $stmt = $pdo->query("SELECT SUM(total_cost) as revenue FROM bookings WHERE status = 'confirmed'");
    $stats['total_revenue'] = (float)($stmt->fetchColumn() ?: 0);
    
    // Pending bookings
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    $stats['pending_bookings'] = (int)$stmt->fetchColumn();
    
    // Average property price
    $stmt = $pdo->query("SELECT AVG(price) as avg_price FROM properties");
    $stats['avg_property_price'] = (float)($stmt->fetchColumn() ?: 0);
    
    // Bookings this month
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM bookings WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())");
    $stats['bookings_this_month'] = (int)$stmt->fetchColumn();
    
    // Revenue this month
    $stmt = $pdo->query("SELECT SUM(total_cost) as revenue FROM bookings WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND status = 'confirmed'");
    $stats['revenue_this_month'] = (float)($stmt->fetchColumn() ?: 0);
    
    // Most popular property
    $stmt = $pdo->query("
        SELECT p.name, COUNT(b.id) as booking_count 
        FROM properties p 
        LEFT JOIN bookings b ON p.id = b.property_id 
        GROUP BY p.id 
        ORDER BY booking_count DESC 
        LIMIT 1
    ");
    $popular = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['most_popular_property'] = $popular ? $popular['name'] : 'No bookings yet';
    $stats['most_popular_bookings'] = $popular ? (int)$popular['booking_count'] : 0;
    
    // Recent bookings trend (last 7 days)
    $stmt = $pdo->query("
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM bookings 
        WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    ");
    $trend = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stats['booking_trend'] = $trend;
    
    echo json_encode($stats);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>