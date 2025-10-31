// Netlify Function to create bookings in Supabase
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const bookingData = JSON.parse(event.body);

    // Validate required fields
    const required = ['property_id', 'guest_name', 'guest_email', 'guest_phone', 'check_in', 'check_out', 'guests'];
    for (const field of required) {
      if (!bookingData[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Field '${field}' is required` })
        };
      }
    }

    // Validate dates
    const checkIn = new Date(bookingData.check_in);
    const checkOut = new Date(bookingData.check_out);
    const today = new Date();

    if (checkIn < today) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Check-in date cannot be in the past' })
      };
    }

    if (checkOut <= checkIn) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Check-out date must be after check-in date' })
      };
    }

    // Get property price for cost calculation
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('price')
      .eq('id', bookingData.property_id)
      .single();

    if (propertyError || !property) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Property not found' })
      };
    }

    // Calculate total cost
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const monthlyRate = parseFloat(property.price);
    const totalCost = Math.ceil((days / 30) * monthlyRate);

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        property_id: bookingData.property_id,
        guest_name: bookingData.guest_name,
        guest_email: bookingData.guest_email,
        guest_phone: bookingData.guest_phone,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: parseInt(bookingData.guests),
        special_requests: bookingData.special_requests || null,
        total_cost: totalCost,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        booking_id: booking.id,
        total_cost: totalCost
      })
    };

  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create booking' })
    };
  }
};