// Protect dashboard
(function () {
  const cookie = document.cookie.split("; ").find(r => r.startsWith("ns-auth="));
  if (!cookie) window.location.href = "/dashboard/login.html";
})();

import { supabase } from "./supabase-client.js";

// LOGOUT
document.getElementById("logout-btn")?.addEventListener("click", () => {
  document.cookie = "ns-auth=; Max-Age=0; path=/;";
  window.location.href = "/dashboard/login.html";
});

async function loadDashboard() {
  // DAILY CALL SUMMARY
  const { data: calls, error: callErr } = await supabase
    .from("daily_calls_view")
    .select("*")
    .order("date", { ascending: false })
    .limit(7);

  if (callErr) {
    console.error(callErr);
    document.getElementById("stats-content").innerHTML = "Error loading data.";
  } else {
    document.getElementById("stats-content").innerHTML =
      calls && calls.length
        ? calls.map(c => `<p>${c.date}: ${c.total_calls} calls</p>`).join("")
        : "No data";
  }

  // RESERVATIONS
  const { data: reservations, error: resErr } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (resErr) {
    console.error(resErr);
    document.getElementById("reservations-list").innerHTML = "Error loading reservations.";
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
