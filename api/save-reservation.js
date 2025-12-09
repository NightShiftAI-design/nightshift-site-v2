// api/save-reservation.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse incoming data
    const {
      hotel_id,
      guest_name,
      arrival_date,
      nights,
      room_type,
      guests,
      pets,
      rate_per_night,
      total_due,
      notes
    } = req.body;

    // Validate hotel_id
    if (!hotel_id) {
      return res.status(400).json({ error: 'hotel_id is required' });
    }

    // Connect to Supabase using secure service role
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );

    // Insert into reservations
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          hotel_id,
          guest_name,
          arrival_date,
          nights,
          room_type,
          guests,
          pets,
          rate_per_night,
          total_due,
          notes
        }
      ])
      .select();

    // If Supabase returns an error, show full details
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        error: error.message || 'Database insert failed',
        details: error.details || null,
        hint: error.hint || null,
        code: error.code || null
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      saved: data
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
}
