// Netlify Function to get properties from Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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