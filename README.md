# Murang'a Properties - Full-Stack Property Management System

A property rental platform I built for the Murang'a University area where I study. Started as a simple class project but grew into a full booking system. Helps students find accommodation near campus.

## 🌟 Features

### For Guests
- **Property Browsing**: Search and filter properties by price, rating, and amenities
- **Interactive Map**: View properties on an interactive map with markers
- **Booking System**: Complete booking flow with form validation and cost calculation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### For Hosts
- **Property Management**: Add, edit, and delete property listings
- **Booking Management**: View and manage booking requests
- **Analytics Dashboard**: Track revenue, bookings, and property performance
- **Real-time Statistics**: Monitor booking trends and property popularity

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL/MariaDB
- **Maps**: Leaflet.js for interactive mapping
- **Styling**: Custom CSS with modern design patterns

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- MySQL/MariaDB
- Web server (Apache/Nginx) or XAMPP

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/muranga-properties.git
   cd muranga-properties
   ```

2. **Set up database**
   - Create MySQL database: `muranga_properties`
   - Import schema: `mysql -u root -p muranga_properties < setup.sql`

3. **Configure database connection**
   - Edit `config.php` with your database credentials
   ```php
   $host = 'localhost';
   $dbname = 'muranga_properties';
   $username = 'your_username';
   $password = 'your_password';
   ```

4. **Start the server**
   ```bash
   # Using PHP built-in server
   php -S localhost:8000
   
   # Or copy to XAMPP htdocs folder
   cp -r . /path/to/xampp/htdocs/muranga-properties/
   ```

5. **Access the application**
   - Main site: `http://localhost:8000/index.html`
   - Host dashboard: `http://localhost:8000/host.html`

## 📁 Project Structure

```
muranga-properties/
├── index.html              # Main property listing page
├── host.html              # Host dashboard with property creation
├── manage_listings.html   # Property management interface
├── insights.html          # Analytics dashboard
├── view_bookings.php      # Booking management page
├── app.js                 # Frontend JavaScript logic
├── styles.css             # Main stylesheet
├── data.js                # Fallback static data
├── config.php             # Database configuration
├── setup.sql              # Database schema and sample data
├── get_properties.php     # API: Fetch properties
├── add_property.php       # API: Add new property
├── add_booking.php        # API: Create booking
├── get_host_listings.php  # API: Host property management
├── get_insights.php       # API: Analytics data
├── manage_property.php    # API: Update/delete properties
├── test_connection.php    # Database connection test
└── images/                # Property images directory
    ├── indoor/            # Interior photos
    └── outdoors/          # Exterior photos
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `get_properties.php` | Fetch all properties with details |
| POST | `add_property.php` | Add new property listing |
| POST | `add_booking.php` | Create booking request |
| GET | `get_host_listings.php` | Get properties with booking stats |
| GET | `get_insights.php` | Fetch analytics and insights |
| DELETE | `manage_property.php` | Delete property |
| PUT | `manage_property.php` | Update property details |

## 🎯 Key Features Implemented

### Property Management
- ✅ Dynamic property loading from database
- ✅ Advanced filtering (price, rating, amenities)
- ✅ Interactive map with property markers
- ✅ Image galleries and detailed property views
- ✅ Responsive design for all screen sizes

### Booking System
- ✅ Complete booking flow with validation
- ✅ Cost calculation and confirmation
- ✅ Database storage of booking requests
- ✅ Booking management for hosts

### Host Dashboard
- ✅ Property creation and management
- ✅ Booking statistics and tracking
- ✅ Revenue analytics and insights
- ✅ Performance metrics and trends

## 🌍 Sample Data

The system includes 9 sample properties around Murang'a University:
- Green Valley Apartments (KSh 8,500/month)
- Sunset Heights Residences (KSh 12,000/month)
- The Scholar's Inn (KSh 6,500/month)
- And more...

## 🔒 Security Features

- SQL injection prevention with prepared statements
- Input validation and sanitization
- CORS headers for API security
- Error handling and logging

## 📱 Responsive Design

- Mobile-first approach
- Optimized for screens from 320px to 1920px+
- Touch-friendly interface elements
- Adaptive layouts for different devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built by [Your Name] as a learning project for property management systems

## Known Bugs (Working on These!)

- Sometimes the map doesn't load on slow connections
- Mobile modal scrolling is a bit wonky on some phones
- Need to add image upload - currently just using URLs
- Booking confirmation emails don't work yet
- The search could be faster with more properties

## What I Want to Add Next

- Email notifications (still figuring out how to do this)
- Payment system (maybe M-Pesa integration?)
- Better search features
- User login system
- Maybe a mobile app later
- Swahili language support for local users

