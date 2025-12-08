import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const {
      hotel_id,
      guest_name,
      arrival_date,
      nights,
      room_type,
      guests,
      pets,
      rate_per_night,
      total_price,
      notes
    } = req.body;

    const { data, error } = await supabase
      .from("reservations")
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
          total_price,
          notes
        }
      ]);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
