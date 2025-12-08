import twilio from "twilio";
import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const {
    guest_name,
    arrival_date,
    nights,
    room_type,
    number_of_guests,
    pets,
    total_price,
    phone
  } = req.body;

  try {
    //
    // 1️⃣ SEND SMS via Twilio
    //
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

    await client.messages.create({
      from: process.env.TWILIO_NUMBER,
      to: process.env.MANAGER_NUMBER,
      body: `New Reservation (ABVI Dayton)
Guest: ${guest_name}
Phone: ${phone}
Arrival: ${arrival_date}
Nights: ${nights}
Room: ${room_type}
Guests: ${number_of_guests}
Pets: ${pets}
Total: $${total_price}`
    });

    //
    // 2️⃣ SEND EMAIL via SendGrid
    //
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const emailBody = `
      <h2>New Reservation - ABVI Dayton</h2>
      <p><strong>Guest:</strong> ${guest_name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Arrival:</strong> ${arrival_date}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Room Type:</strong> ${room_type}</p>
      <p><strong>Guests:</strong> ${number_of_guests}</p>
      <p><strong>Pets:</strong> ${pets}</p>
      <p><strong>Total:</strong> $${total_price}</p>
    `;

    await sgMail.send({
      to: process.env.MANAGER_EMAIL,
      from: process.env.NOTIFY_EMAIL,
      subject: "New Reservation - Americas Best Value Inn Dayton",
      html: emailBody
    });

    return res.status(200).json({ status: "sms_and_email_sent" });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
