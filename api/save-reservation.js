import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Accept data from either query params OR JSON body
    const dataSource = req.method === 'GET' ? req.query : req.body;

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
    } = dataSource;

    if (!hotel_id) {
      return res.status(400).json({ error: "hotel_id is required" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

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

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Database insert failed" });
    }

    return res.status(200).json({ success: true, saved: data });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
