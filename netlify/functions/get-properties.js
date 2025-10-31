// Netlify Function to get properties from Supabase
// Using fetch instead of supabase-js to avoid dependency issues

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Use fetch to call Supabase REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/properties?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const properties = await response.json();

    // Transform data to match frontend expectations
    const transformedProperties = properties.map(property => ({
      id: property.id,
      name: property.name,
      address: property.address,
      price: parseFloat(property.price),
      beds: property.beds,
      baths: property.baths,
      thumbnail: property.thumbnail,
      rating: property.rating ? parseFloat(property.rating) : 0,
      description: property.description,
      location: {
        country: property.country,
        state: 'Central Kenya',
        city: property.city
      },
      coordinates: {
        lat: property.latitude ? parseFloat(property.latitude) : null,
        lng: property.longitude ? parseFloat(property.longitude) : null
      },
      amenities: property.amenities || [],
      photos: property.photos || []
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transformedProperties)
    };

  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch properties' })
    };
  }
};