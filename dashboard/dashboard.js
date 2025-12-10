/ Redirect if not logged in
(function () {
  function getCookie(name) {
    return document.cookie.split("; ").find(r => r.startsWith(name + "="));
  }
  if (!getCookie("ns-auth")) {
    window.location.href = "/dashboard/login.html";
  }
})();

import { supabase } from './supabase-client.js';

async function loadDashboard() {
  /* -----------------------------
     LOAD DAILY CALL SUMMARY
  ----------------------------- */
  const { data: calls, error: callsError } = await supabase
    .from('daily_calls_view')   // FIXED TABLE NAME
    .select('*')
    .order('date', { ascending: false })
    .limit(7);

  if (callsError) {
    document.getElementById("stats-content").innerHTML =
      "Error loading call data.";
    console.error("CALL SUMMARY ERROR:", callsError);
  } else {
    document.getElementById("stats-content").innerHTML =
      calls && calls.length
        ? calls.map(c => `<p>${c.date}: ${c.total_calls} calls</p>`).join("")
        : "No call data yet.";
  }

  /* -----------------------------
     LOAD RESERVATIONS
  ----------------------------- */
  const { data: reservations, error: resError } = await supabase
    .from('reservations')    // FIXED TABLE NAME
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (resError) {
    document.getElementById("reservations-list").innerHTML =
      "Error loading reservations.";
    console.error("RESERVATIONS ERROR:", resError);
  } else {
    document.getElementById("reservations-list").innerHTML =
      reservations && reservations.length
        ? reservations.map(r => `
            <div class="reservation-card">
              <strong>${r.guest_name}</strong><br>
              ${r.room_type} — ${r.arrival_date}<br>
              Total: $${r.total_due}
            </div>
          `).join("")
        : "No reservations yet.";
  }
}

loadDashboard();
