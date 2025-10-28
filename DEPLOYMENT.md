# Deployment Guide

## Local Development Setup

### Using XAMPP (Recommended for Windows)

1. **Install XAMPP**
   - Download from https://www.apachefriends.org/
   - Install and start Apache + MySQL services

2. **Deploy Project**
   ```bash
   # Copy project to XAMPP htdocs
   cp -r muranga-properties/ C:/xampp/htdocs/
   ```

3. **Setup Database**
   - Open http://localhost/phpmyadmin
   - Create database: `muranga_properties`
   - Import `setup.sql`

4. **Configure**
   - Update `config.php` with your database credentials
   - Test: http://localhost/muranga-properties/

### Using PHP Built-in Server

1. **Start Server**
   ```bash
   php -S localhost:8000
   ```

2. **Setup Database**
   - Install MySQL separately
   - Create database and import schema
   - Update config.php

## Production Deployment

### Shared Hosting (cPanel)

1. **Upload Files**
   - Zip project files
   - Upload via File Manager or FTP
   - Extract in public_html/

2. **Database Setup**
   - Create MySQL database via cPanel
   - Import setup.sql via phpMyAdmin
   - Update config.php with hosting credentials

3. **Permissions**
   - Set folder permissions to 755
   - Set file permissions to 644

### VPS/Dedicated Server

1. **Server Requirements**
   - PHP 7.4+ with PDO extension
   - MySQL 5.7+ or MariaDB 10.2+
   - Apache/Nginx web server

2. **Installation**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/muranga-properties.git
   cd muranga-properties
   
   # Set permissions
   chmod 755 .
   chmod 644 *.php *.html *.css *.js
   
   # Setup database
   mysql -u root -p < setup.sql
   ```

3. **Web Server Configuration**
   
   **Apache (.htaccess)**
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.html [QSA,L]
   ```
   
   **Nginx**
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   
   location ~ \.php$ {
       fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
       fastcgi_index index.php;
       include fastcgi_params;
   }
   ```

## Environment Configuration

### Production Config
Create `config_production.php`:
```php
<?php
$host = 'your-production-host';
$dbname = 'your-production-db';
$username = 'your-production-user';
$password = 'your-secure-password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("set names utf8");
} catch(PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die("Database connection failed");
}
?>
```

### Security Checklist

- [ ] Update default database credentials
- [ ] Enable HTTPS/SSL
- [ ] Set proper file permissions
- [ ] Enable error logging (disable display_errors)
- [ ] Implement rate limiting for APIs
- [ ] Add CSRF protection for forms
- [ ] Validate and sanitize all inputs
- [ ] Use prepared statements (already implemented)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check credentials in config.php
   - Verify MySQL service is running
   - Check firewall settings

2. **404 Errors on API Calls**
   - Verify .htaccess is working
   - Check file permissions
   - Ensure mod_rewrite is enabled

3. **Images Not Loading**
   - Check images/ folder permissions
   - Verify image paths in database
   - Ensure web server can serve static files

4. **JavaScript Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS headers

### Performance Optimization

1. **Database**
   - Add indexes on frequently queried columns
   - Optimize queries with EXPLAIN
   - Consider connection pooling

2. **Frontend**
   - Minify CSS/JS files
   - Optimize images
   - Enable gzip compression
   - Add caching headers

3. **Server**
   - Enable OPcache for PHP
   - Configure proper memory limits
   - Set up CDN for static assets