// Simple booking function that simulates saving to database
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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

    // Simulate property prices (since we can't query database easily)
    const propertyPrices = {
      'p-001': 8500,
      'p-002': 12000,
      'p-003': 6500,
      'p-004': 15000,
      'p-005': 9500
    };

    const propertyPrice = propertyPrices[bookingData.property_id] || 10000;

    // Calculate total cost
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const monthlyRate = propertyPrice;
    const totalCost = Math.ceil((days / 30) * monthlyRate);

    // Generate a booking ID
    const bookingId = Math.floor(Math.random() * 10000) + 1000;

    // Log booking data (in real app, this would save to database)
    console.log('Booking created:', {
      booking_id: bookingId,
      property_id: bookingData.property_id,
      guest_name: bookingData.guest_name,
      guest_email: bookingData.guest_email,
      guest_phone: bookingData.guest_phone,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      guests: bookingData.guests,
      special_requests: bookingData.special_requests,
      total_cost: totalCost,
      created_at: new Date().toISOString()
    });

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        booking_id: bookingId,
        total_cost: totalCost
      })
    };

  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create booking',
        details: error.message 
      })
    };
  }
};