// Netlify Function to delete properties
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { property_id } = JSON.parse(event.body);

    if (!property_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Property ID is required' })
      };
    }

    // In a real app, this would delete from database
    // For now, we'll simulate successful deletion
    console.log(`Property deleted: ${property_id} at ${new Date().toISOString()}`);

    // Simulate some properties that can't be deleted (for demo)
    if (property_id === 'p-001') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Cannot delete this property - it has active bookings' 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Property deleted successfully',
        property_id: property_id
      })
    };

  } catch (error) {
    console.error('Error deleting property:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to delete property',
        details: error.message 
      })
    };
  }
};