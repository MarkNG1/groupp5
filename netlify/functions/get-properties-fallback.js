// Fallback function that returns static data if Supabase fails
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Static fallback data
  const properties = [
    {
      id: 'p-001',
      name: 'Green Valley Apartments',
      address: '123 Valley Road, Murang\'a',
      price: 8500,
      beds: 2,
      baths: 1,
      thumbnail: 'images/outdoors/o1.jpeg',
      rating: 4.3,
      description: 'Modern apartments with stunning views of the surrounding hills. Perfect for students and young professionals.',
      location: { country: 'Kenya', state: 'Central Kenya', city: 'Murang\'a' },
      coordinates: { lat: -0.7200, lng: 37.1500 },
      amenities: ['Wi‑Fi','Laundry','CCTV','Parking'],
      photos: ['images/outdoors/o1.jpeg','images/indoor/d1.jpeg','images/indoor/d2.jpeg']
    },
    {
      id: 'p-002',
      name: 'Sunset Heights Residences',
      address: '45 Sunset Street, Murang\'a',
      price: 12000,
      beds: 3,
      baths: 2,
      thumbnail: 'images/outdoors/o2.jpeg',
      rating: 4.6,
      description: 'Spacious family units with beautiful sunset views. Features modern amenities and secure environment.',
      location: { country: 'Kenya', state: 'Central Kenya', city: 'Murang\'a' },
      coordinates: { lat: -0.7185, lng: 37.1525 },
      amenities: ['Wi‑Fi','Parking','Kitchen','24/7 Security','Gym'],
      photos: ['images/outdoors/o2.jpeg','images/indoor/d3.jpeg','images/indoor/d4.jpeg']
    },
    {
      id: 'p-003',
      name: 'The Scholar\'s Inn',
      address: '78 Learning Drive, Murang\'a',
      price: 6500,
      beds: 1,
      baths: 1,
      thumbnail: 'images/outdoors/o3.jpeg',
      rating: 4.1,
      description: 'Budget-friendly accommodation designed for students. Clean, safe, and conveniently located.',
      location: { country: 'Kenya', state: 'Central Kenya', city: 'Murang\'a' },
      coordinates: { lat: -0.7225, lng: 37.1475 },
      amenities: ['Wi‑Fi','Laundry','Study Room'],
      photos: ['images/outdoors/o3.jpeg','images/indoor/d5.jpeg','images/indoor/d6.jpeg']
    },
    {
      id: 'p-004',
      name: 'Murang\'a Gardens Estate',
      address: '156 Garden Avenue, Murang\'a',
      price: 15000,
      beds: 4,
      baths: 3,
      thumbnail: 'images/outdoors/o4.jpeg',
      rating: 4.7,
      description: 'Luxury family homes in a gated community. Perfect for families and professionals seeking premium living.',
      location: { country: 'Kenya', state: 'Central Kenya', city: 'Murang\'a' },
      coordinates: { lat: -0.7155, lng: 37.1555 },
      amenities: ['Wi‑Fi','Gym','Swimming Pool','CCTV','Parking','Garden'],
      photos: ['images/outdoors/o4.jpeg','images/indoor/d7.jpeg','images/indoor/d9.jpeg']
    },
    {
      id: 'p-005',
      name: 'The Cornerstone Suites',
      address: '92 Foundation Lane, Murang\'a',
      price: 9500,
      beds: 2,
      baths: 2,
      thumbnail: 'images/outdoors/o5.jpeg',
      rating: 4.4,
      description: 'Comfortable suites with kitchen facilities, ideal for young couples and working professionals.',
      location: { country: 'Kenya', state: 'Central Kenya', city: 'Murang\'a' },
      coordinates: { lat: -0.7255, lng: 37.1445 },
      amenities: ['Wi‑Fi','Kitchen','Parking','Laundry'],
      photos: ['images/outdoors/o5.jpeg','images/indoor/d10.jpeg','images/indoor/d1.jpeg']
    }
  ];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(properties)
  };
};