// api/get-dashboard-data.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { hotel_id } = req.query;

    if (!hotel_id) {
      return res.status(400).json({ error: 'hotel_id is required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Last 72 hours window
    const now = new Date();
    const since = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

    // 1) Recent reservations
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select('*')
      .eq('hotel_id', hotel_id)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(50);

    if (resError) {
      console.error('Supabase reservations error:', resError);
      return res.status(500).json({ error: 'Failed to fetch reservations' });
    }

    // 2) Recent call metadata
    const { data: calls, error: callError } = await supabase
      .from('call_metadata')
      .select('*')
      .eq('hotel_id', hotel_id)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(100);

    if (callError) {
      console.error('Supabase calls error:', callError);
      return res.status(500).json({ error: 'Failed to fetch call metadata' });
    }

    return res.status(200).json({
      reservations: reservations || [],
      calls: calls || []
    });

  } catch (err) {
    console.error('Server error in get-dashboard-data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
