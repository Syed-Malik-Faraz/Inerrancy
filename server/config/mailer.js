const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM = { email: 'inerrancyprivatelimited@gmail.com', name: 'Inerrancy' };

const sendEmail = async ({ to, subject, html }) => {
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: FROM,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Brevo API error ${res.status}: ${err.message || res.statusText}`);
  }
};

// Verify API key on startup — deferred so dotenv.config() in index.js runs first
setTimeout(async () => {
  console.log('[MAILER DEBUG] BREVO_API_KEY starts with:', process.env.BREVO_API_KEY?.substring(0, 20));
  try {
    const res = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': process.env.BREVO_API_KEY },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('✅ [MAILER] Brevo API connected — emails ready to send');
  } catch (e) {
    console.error('\n❌ [MAILER] Brevo API connection FAILED:', e.message);
    console.error('❌ [MAILER] Check BREVO_API_KEY in server/.env\n');
  }
}, 0);

export const sendOrderConfirmationEmail = async ({ to, name, orderId, items, total, address }) => {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #C9A84C22;">${item.product?.name || item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #C9A84C22;text-align:center;">${item.size || '-'}</td>
      <td style="padding:8px;border-bottom:1px solid #C9A84C22;text-align:center;">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #C9A84C22;text-align:right;">₹${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Order Confirmed</title></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:'Georgia',serif;color:#F5F0E8;">
      <div style="max-width:600px;margin:0 auto;background:#111111;border:1px solid #C9A84C33;">
        <div style="background:linear-gradient(135deg,#1a1a1a,#0A0A0A);padding:40px;text-align:center;border-bottom:1px solid #C9A84C44;">
          <h1 style="color:#C9A84C;font-size:28px;letter-spacing:3px;margin:0;">INERRANCY</h1>
          <p style="color:#C9A84C88;letter-spacing:2px;font-size:12px;margin:8px 0 0;">THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#C9A84C;margin-bottom:8px;">Order Confirmed ✨</h2>
          <p style="color:#F5F0E8CC;">Dear ${name},</p>
          <p style="color:#F5F0E8CC;">Your order <strong style="color:#C9A84C;">#${orderId}</strong> has been placed successfully. We're preparing your luxury fragrances with care.</p>

          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead>
              <tr style="background:#C9A84C22;">
                <th style="padding:10px 8px;text-align:left;color:#C9A84C;font-size:12px;letter-spacing:1px;">PRODUCT</th>
                <th style="padding:10px 8px;text-align:center;color:#C9A84C;font-size:12px;letter-spacing:1px;">SIZE</th>
                <th style="padding:10px 8px;text-align:center;color:#C9A84C;font-size:12px;letter-spacing:1px;">QTY</th>
                <th style="padding:10px 8px;text-align:right;color:#C9A84C;font-size:12px;letter-spacing:1px;">PRICE</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="text-align:right;border-top:1px solid #C9A84C44;padding-top:16px;">
            <p style="color:#F5F0E8;font-size:18px;"><strong>Total: ₹${total}</strong></p>
          </div>

          <div style="background:#C9A84C11;border:1px solid #C9A84C33;padding:20px;margin-top:24px;">
            <h3 style="color:#C9A84C;margin:0 0 12px;font-size:14px;letter-spacing:1px;">SHIPPING TO</h3>
            <p style="margin:0;color:#F5F0E8CC;line-height:1.8;">${address}</p>
          </div>
        </div>
        <div style="padding:24px;text-align:center;border-top:1px solid #C9A84C22;">
          <p style="color:#C9A84C88;font-size:12px;letter-spacing:1px;">© 2024 INERRANCY. THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to, subject: `Order Confirmed #${orderId} — Inerrancy`, html });
};

export const sendOtpEmail = async ({ to, otp }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Verification Code</title></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:'Georgia',serif;color:#F5F0E8;">
      <div style="max-width:520px;margin:0 auto;background:#111111;border:1px solid #C9A84C33;">
        <div style="background:linear-gradient(135deg,#1a1a1a,#0A0A0A);padding:40px;text-align:center;border-bottom:1px solid #C9A84C44;">
          <h1 style="color:#C9A84C;font-size:26px;letter-spacing:4px;margin:0;">INERRANCY</h1>
          <p style="color:#C9A84C88;letter-spacing:2px;font-size:11px;margin:8px 0 0;">THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
        <div style="padding:48px 40px;text-align:center;">
          <p style="color:#F5F0E8CC;font-size:13px;letter-spacing:1px;margin:0 0 8px;">YOUR VERIFICATION CODE</p>
          <div style="display:inline-block;background:#C9A84C11;border:1px solid #C9A84C44;padding:24px 48px;margin:24px 0;border-radius:2px;">
            <span style="color:#C9A84C;font-size:42px;font-weight:bold;letter-spacing:12px;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#F5F0E8CC;font-size:13px;line-height:1.8;margin:0;">Enter this code on the registration page to verify your identity.</p>
          <p style="color:#F5F0E8CC;font-size:13px;line-height:1.8;margin:8px 0 0;">This code expires in <strong style="color:#C9A84C;">5 minutes</strong>.</p>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #C9A84C22;">
            <p style="color:#C9A84C88;font-size:11px;letter-spacing:1px;margin:0;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        </div>
        <div style="padding:20px;text-align:center;border-top:1px solid #C9A84C22;">
          <p style="color:#C9A84C88;font-size:11px;letter-spacing:1px;margin:0;">© 2024 INERRANCY. THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({ to, subject: `${otp} — Your Inerrancy Verification Code`, html });
};

export const sendPasswordResetEmail = async ({ to, otp }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Password Reset</title></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:'Georgia',serif;color:#F5F0E8;">
      <div style="max-width:520px;margin:0 auto;background:#111111;border:1px solid #C9A84C33;">
        <div style="background:linear-gradient(135deg,#1a1a1a,#0A0A0A);padding:40px;text-align:center;border-bottom:1px solid #C9A84C44;">
          <h1 style="color:#C9A84C;font-size:26px;letter-spacing:4px;margin:0;">INERRANCY</h1>
          <p style="color:#C9A84C88;letter-spacing:2px;font-size:11px;margin:8px 0 0;">THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
        <div style="padding:48px 40px;text-align:center;">
          <p style="color:#F5F0E8CC;font-size:13px;letter-spacing:1px;margin:0 0 8px;">PASSWORD RESET CODE</p>
          <div style="display:inline-block;background:#C9A84C11;border:1px solid #C9A84C44;padding:24px 48px;margin:24px 0;border-radius:2px;">
            <span style="color:#C9A84C;font-size:42px;font-weight:bold;letter-spacing:12px;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#F5F0E8CC;font-size:13px;line-height:1.8;margin:0;">Enter this code to reset your password.</p>
          <p style="color:#F5F0E8CC;font-size:13px;line-height:1.8;margin:8px 0 0;">This code expires in <strong style="color:#C9A84C;">5 minutes</strong>.</p>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #C9A84C22;">
            <p style="color:#C9A84C88;font-size:11px;letter-spacing:1px;margin:0;">If you did not request a password reset, please ignore this email.</p>
          </div>
        </div>
        <div style="padding:20px;text-align:center;border-top:1px solid #C9A84C22;">
          <p style="color:#C9A84C88;font-size:11px;letter-spacing:1px;margin:0;">© 2024 INERRANCY. THE HOUSE OF LUXURY FRAGRANCES</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({ to, subject: `${otp} — Reset Your Inerrancy Password`, html });
};

export const sendWelcomeEmail = async ({ to, name }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:'Georgia',serif;color:#F5F0E8;">
      <div style="max-width:600px;margin:0 auto;background:#111111;border:1px solid #C9A84C33;">
        <div style="background:linear-gradient(135deg,#1a1a1a,#0A0A0A);padding:40px;text-align:center;border-bottom:1px solid #C9A84C44;">
          <h1 style="color:#C9A84C;font-size:28px;letter-spacing:3px;margin:0;">INERRANCY</h1>
        </div>
        <div style="padding:40px;text-align:center;">
          <h2 style="color:#C9A84C;">Welcome, ${name} ✨</h2>
          <p style="color:#F5F0E8CC;line-height:1.8;">You've joined the house of luxury fragrances. Explore our curated collection of premium Middle Eastern and international perfumes.</p>
          <a href="${process.env.CLIENT_URL}/shop" style="display:inline-block;margin-top:24px;padding:14px 36px;background:#C9A84C;color:#0A0A0A;text-decoration:none;letter-spacing:2px;font-size:13px;">SHOP NOW</a>
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail({ to, subject: `Welcome to Inerrancy — The House of Luxury Fragrances`, html });
};
