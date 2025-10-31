<?php
/**
 * Online hosting configuration for InfinityFree
 * Replace these values with your actual hosting details
 */

// Database configuration for InfinityFree
$host = 'sql200.infinityfree.com'; // Replace with your actual host
$dbname = 'if0_12345678_muranga_properties'; // Replace with your actual database name
$username = 'if0_12345678'; // Replace with your actual username
$password = 'your_password_here'; // Replace with your actual password

// Create PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch(PDOException $e) {
    // Log error in production, show message in development
    error_log("Database connection failed: " . $e->getMessage());
    die("Database connection failed. Please check your configuration.");
}
?>

<!-- 
INSTRUCTIONS:
1. Get your database details from InfinityFree control panel
2. Replace the values above with your actual details
3. Rename this file to config.php
4. Upload to your hosting account
-->