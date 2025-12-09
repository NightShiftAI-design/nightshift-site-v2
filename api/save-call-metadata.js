// api/save-call-metadata.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse JSON body (Vercel does NOT auto-parse)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Basic validation
    if (!body || !body.hotel_id) {
      return res.status(400).json({ error: 'hotel_id is required' });
    }

    // Connect to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert call metadata
    const { data, error } = await supabase
      .from('call_metadata')
      .insert([
        {
          hotel_id: body.hotel_id,
          caller_number: body.caller_number || null,
          reason: body.reason || null,
          arrival_date: body.arrival_date || null,
          duration_seconds: body.duration_seconds || null,
          audio_url: body.audio_url || null,
          sentiment_score: body.sentiment_score || null,
          tags: body.tags || null,
          risk_flags: body.risk_flags || null,
          summary: body.summary || null,
          outcome: body.outcome || null
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    return res.status(200).json({ success: true, saved: data });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
