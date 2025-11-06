export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || origin || '*';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const cors = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    };

    if (request.method !== 'POST') {
      return json({ error: 'Method Not Allowed' }, 405, cors);
    }

    // Ensure secrets are configured
    if (!env.BREVO_API_KEY || !env.TO_EMAIL || !env.FROM_EMAIL) {
      return json({ error: 'Server Misconfigured: missing BREVO_API_KEY/TO_EMAIL/FROM_EMAIL' }, 500, cors);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON' }, 400, cors);
    }

    const name = (payload?.name || '').toString().trim();
    const email = (payload?.email || '').toString().trim();
    const subject = (payload?.subject || '').toString().trim() || 'פנייה חדשה מהאתר';
    const message = (payload?.message || '').toString().trim();
    const updates = !!payload?.updates;
    const source = (payload?.source || 'portfolio_site').toString();

    if (!name || !email || !message) {
      return json({ error: 'Missing required fields (name, email, message)' }, 400, cors);
    }

    if (message.length > 5000) {
      return json({ error: 'Message too long' }, 413, cors);
    }

    const nowIL = new Date().toLocaleString('he-IL');

    const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="he"><head><meta charset="utf-8"/><style>
body{font-family:Arial,sans-serif;line-height:1.6;background:#f4f4f4;margin:0;padding:0}
.container{max-width:600px;margin:20px auto;background:white;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);overflow:hidden}
.header{background:#3b82f6;color:white;padding:20px;text-align:center}
.content{padding:30px}
.field{margin-bottom:20px;padding:15px;background:#f8f9fa;border-right:4px solid #3b82f6;border-radius:4px}
.label{font-weight:bold;color:#333;display:block;margin-bottom:5px}
.value{color:#555}
.message-box{background:#e7f3ff;border:1px solid #b3d9ff;padding:20px;border-radius:6px;margin:20px 0}
.footer{background:#f8f9fa;padding:20px;text-align:center;color:#666;font-size:14px}
.updates{color:#28a745;font-weight:bold}
.no-updates{color:#666}
</style></head><body>
<div class="container">
  <div class="header"><h2>📬 פנייה חדשה מהאתר</h2></div>
  <div class="content">
    <div class="field"><span class="label">👤 שם:</span><div class="value">${escapeHtml(name)}</div></div>
    <div class="field"><span class="label">📧 אימייל:</span><div class="value">${escapeHtml(email)}</div></div>
    <div class="field"><span class="label">📝 נושא:</span><div class="value">${escapeHtml(subject)}</div></div>
    <div class="message-box"><span class="label">💬 הודעה:</span><div class="value">${escapeHtml(message).replace(/\n/g,'<br>')}</div></div>
    <div class="field"><span class="label">📮 עדכונים:</span><div class="value ${updates?'updates':'no-updates'}">${updates?'✅ מעוניין לקבל עדכונים':'❌ לא מעוניין לקבל עדכונים'}</div></div>
  </div>
  <div class="footer">נשלח בתאריך: ${escapeHtml(nowIL)}<br/>מקור: ${escapeHtml(source)}</div>
</div>
</body></html>`;

    const textContent = `פנייה חדשה מהאתר\n\nשם: ${name}\nאימייל: ${email}\nנושא: ${subject}\n\nהודעה:\n${message}\n\nעדכונים: ${updates?'כן':'לא'}\n---\nנשלח בתאריך: ${nowIL} | מקור: ${source}`;

    const brevoPayload = {
      sender: { name: 'Portfolio Contact Form', email: env.FROM_EMAIL },
      to: [{ email: env.TO_EMAIL }],
      subject: `פנייה מהאתר - ${subject}`,
      htmlContent,
      textContent,
      replyTo: { email, name }
    };

    const brevoResp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify(brevoPayload),
    });

    if (!brevoResp.ok) {
      const errText = await safeText(brevoResp);
      return json({ error: 'Brevo error', status: brevoResp.status, details: errText?.slice(0, 1000) }, brevoResp.status === 401 ? 502 : 500, cors);
    }

    const result = await brevoResp.json().catch(() => ({}));
    return json({ ok: true, result }, 201, cors);
  },
};

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function safeText(resp) {
  try { return await resp.text(); } catch { return ''; }
}
