<?php
include 'config.php';
?>
<!DOCTYPE html>
<html>
<head>
    <title>View Bookings - Murang'a Properties</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status.pending { background: #fff3cd; color: #856404; }
        .status.confirmed { background: #d4edda; color: #155724; }
        .status.cancelled { background: #f8d7da; color: #721c24; }
        .no-bookings { text-align: center; padding: 40px; color: #666; }
        .back-link { display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-link">← Back to Properties</a>
        <h1>All Bookings</h1>
        
        <?php
        try {
            $stmt = $pdo->query("
                SELECT b.*, p.name as property_name 
                FROM bookings b 
                LEFT JOIN properties p ON b.property_id = p.id 
                ORDER BY b.created_at DESC
            ");
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($bookings) > 0) {
                echo "<table>";
                echo "<tr>";
                echo "<th>Booking ID</th>";
                echo "<th>Property</th>";
                echo "<th>Guest Name</th>";
                echo "<th>Email</th>";
                echo "<th>Phone</th>";
                echo "<th>Check-in</th>";
                echo "<th>Check-out</th>";
                echo "<th>Guests</th>";
                echo "<th>Total Cost</th>";
                echo "<th>Status</th>";
                echo "<th>Booking Date</th>";
                echo "</tr>";
                
                foreach ($bookings as $booking) {
                    echo "<tr>";
                    echo "<td>#{$booking['id']}</td>";
                    echo "<td>{$booking['property_name']}</td>";
                    echo "<td>{$booking['guest_name']}</td>";
                    echo "<td>{$booking['guest_email']}</td>";
                    echo "<td>{$booking['guest_phone']}</td>";
                    echo "<td>" . date('M j, Y', strtotime($booking['check_in'])) . "</td>";
                    echo "<td>" . date('M j, Y', strtotime($booking['check_out'])) . "</td>";
                    echo "<td>{$booking['guests']}</td>";
                    echo "<td>KSh " . number_format($booking['total_cost']) . "</td>";
                    echo "<td><span class='status {$booking['status']}'>{$booking['status']}</span></td>";
                    echo "<td>" . date('M j, Y g:i A', strtotime($booking['created_at'])) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<div class='no-bookings'>";
                echo "<h3>No bookings yet</h3>";
                echo "<p>Bookings will appear here once guests start making reservations.</p>";
                echo "</div>";
            }
            
        } catch(Exception $e) {
            echo "<p style='color: red;'>Error loading bookings: " . $e->getMessage() . "</p>";
        }
        ?>
    </div>
</body>
</html>