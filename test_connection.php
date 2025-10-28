<?php
echo "<h2>Testing PHP and Database Connection</h2>";

// Test PHP
echo "<p>✅ PHP is working! Version: " . phpversion() . "</p>";

// Test database connection
try {
    include 'config.php';
    echo "<p>✅ Database connection successful!</p>";
    
    // Test if properties table exists
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM properties");
    $result = $stmt->fetch();
    echo "<p>✅ Properties table found with " . $result['count'] . " records</p>";
    
} catch(Exception $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
    echo "<p>Make sure to:</p>";
    echo "<ul>";
    echo "<li>Start MySQL in XAMPP</li>";
    echo "<li>Create database 'muranga_properties'</li>";
    echo "<li>Import setup.sql</li>";
    echo "<li>Update config.php with correct credentials</li>";
    echo "</ul>";
}
?>

<style>
body { font-family: Arial, sans-serif; margin: 40px; }
h2 { color: #333; }
p { margin: 10px 0; }
ul { margin-left: 20px; }
</style>