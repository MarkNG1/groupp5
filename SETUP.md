# Backend Setup Guide

## Prerequisites
- PHP 7.4 or higher
- MySQL/MariaDB
- Web server (Apache/Nginx) or PHP built-in server

## Setup Steps

### 1. Database Setup
1. Create a MySQL database named `muranga_properties`
2. Import the database schema:
   ```sql
   mysql -u root -p muranga_properties < setup.sql
   ```

### 2. Configure Database Connection
Edit `config.php` and update the database credentials:
```php
$host = 'localhost';
$dbname = 'muranga_properties';
$username = 'your_username';
$password = 'your_password';
```

### 3. Start the Server
For development, you can use PHP's built-in server:
```bash
php -S localhost:8000
```

Then visit: http://localhost:8000

## API Endpoints

- `GET get_properties.php` - Fetch all properties
- `POST add_property.php` - Add new property
- `POST add_booking.php` - Create booking

## Features

### For Hosts (host.html)
- Add new properties with full details
- Upload property images
- Set amenities and pricing

### For Guests (index.html)
- Browse properties with dynamic filtering
- View property details with photos
- Make bookings with form validation
- Map view with property markers

## File Structure
```
/
├── index.html          # Main property listing page
├── host.html           # Host dashboard with property creation
├── app.js              # Frontend JavaScript (updated for backend)
├── data.js             # Fallback static data
├── styles.css          # Styling
├── config.php          # Database configuration
├── setup.sql           # Database schema and sample data
├── get_properties.php  # API: Fetch properties
├── add_property.php    # API: Add property
└── add_booking.php     # API: Create booking
```

The system now supports:
- ✅ Dynamic property loading from database
- ✅ Property creation through host dashboard
- ✅ Booking submission with backend processing
- ✅ Fallback to static data if backend unavailable