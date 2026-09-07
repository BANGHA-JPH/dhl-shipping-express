import { Resend } from 'resend';

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Clean corporate email layout with DHL Express brand identity (DHL Yellow #FFCC00 & DHL Red #D40511)
 */
function buildHtmlEmail({ recipientName, title, message, trackingNumber, status, origin, destination, credentials }) {
  const domain = process.env.PORTAL_DOMAIN || 'dhlglobaltracking.com';
  const supportEmail = process.env.FROM_EMAIL?.includes('<') 
    ? process.env.FROM_EMAIL.match(/<([^>]+)>/)[1] 
    : (process.env.FROM_EMAIL || `support@${domain}`);
  const siteUrl = `https://www.${domain}/#login`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 30px 15px; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6;">
    <div style="max-width: 580px; margin: 0 auto;">
      
      <!-- Top DHL Brand Header Bar -->
      <div style="background-color: #FFCC00; border-radius: 6px 6px 0 0; padding: 18px 24px; text-align: left; display: flex; align-items: center; border-bottom: 3px solid #D40511;">
        <span style="font-size: 26px; font-weight: 900; font-style: italic; color: #D40511; letter-spacing: 1px; font-family: 'Arial Black', Impact, sans-serif;">DHL</span>
        <span style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Express Logistics</span>
      </div>

      <!-- Main Content Card -->
      <div style="background-color: #ffffff; border-radius: 0 0 6px 6px; padding: 32px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-top: none; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <p style="font-size: 16px; color: #1a1a1a; margin-top: 0; margin-bottom: 18px; font-weight: 700;">
          Dear ${recipientName || 'Valued Customer'},
        </p>

        <div style="font-size: 15px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
          ${message.replace(/\n/g, '<br/>')}
        </div>

        ${credentials ? `
        <!-- Credentials Box -->
        <div style="background-color: #FFFDE7; border-left: 4px solid #FFCC00; border: 1px solid #FFF59D; border-left-width: 4px; border-radius: 4px; padding: 18px; margin-bottom: 24px; font-size: 14px;">
          <div style="font-weight: 800; color: #D40511; margin-bottom: 10px; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px;">🔐 Customer Portal Credentials</div>
          <div style="margin-bottom: 8px; color: #1a1a1a;"><strong>Portal Username / Email:</strong> <span style="font-family: monospace; font-size: 14px; background: #ffffff; padding: 3px 8px; border-radius: 3px; border: 1px solid #E0E0E0;">${credentials.email}</span></div>
          <div style="color: #1a1a1a;"><strong>Access Password:</strong> <span style="font-family: monospace; font-weight: 800; background: #FFCC00; padding: 3px 8px; border-radius: 3px; color: #1a1a1a;">${credentials.password}</span></div>
        </div>
        ` : ''}

        ${trackingNumber ? `
        <!-- Tracking Summary Box -->
        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 18px; margin-bottom: 24px; font-size: 14px;">
          <div style="margin-bottom: 8px; color: #1a1a1a;"><strong>Tracking Code:</strong> <span style="font-family: monospace; font-weight: 800; color: #D40511; font-size: 15px;">${trackingNumber}</span></div>
          ${status ? `<div style="margin-bottom: 8px; color: #1a1a1a;"><strong>Live Status:</strong> <span style="font-weight: 600; color: #059669; text-transform: uppercase;">${status}</span></div>` : ''}
          ${origin || destination ? `<div style="color: #495057;"><strong>Route Transit:</strong> ${origin || 'N/A'} &rarr; ${destination || 'N/A'}</div>` : ''}
        </div>
        ` : ''}

        <!-- Track Shipment CTA Button -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="${siteUrl}" style="display: inline-block; background-color: #D40511; color: #ffffff; font-weight: 800; font-size: 15px; padding: 14px 32px; border-radius: 4px; text-decoration: none; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(212, 5, 17, 0.25);">
            Track Your Shipment Live &rarr;
          </a>
        </div>

      </div>

      <!-- Contact & Legal Footer Card -->
      <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border: 1px solid #e2e8f0; font-size: 12px; color: #6c757d; box-shadow: 0 2px 6px rgba(0,0,0,0.03); text-align: center;">
        <p style="margin: 0 0 6px 0; font-weight: 800; color: #1a1a1a; font-size: 13px;">DHL Express Global Logistics Services</p>
        <p style="margin: 0 0 4px 0;">Official Automated Shipment Notification</p>
        <p style="margin: 0 0 4px 0;">Customer Portal: <a href="${siteUrl}" style="color: #D40511; font-weight: 600; text-decoration: underline;">${domain}</a></p>
        <p style="margin: 0; color: #868e96;">Support Desk: ${supportEmail}</p>
        <div style="margin-top: 12px; border-top: 1px solid #edf2f7; padding-top: 10px; font-size: 11px; color: #adb5bd;">
          &copy; ${new Date().getFullYear()} Deutsche Post DHL Group. All rights reserved.
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
}

/**
 * Main email sender service
 */
export async function sendEmail({ to, recipientName, subject, messageBody, templateType, shipment, credentials, inReplyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const domain = process.env.PORTAL_DOMAIN || 'dhlglobaltracking.com';
  const fromEmail = process.env.FROM_EMAIL || `DHL Express Support <support@${domain}>`;
  const supportEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)[1] : fromEmail;

  let emailSubject = subject || 'Update regarding your DHL Shipment';
  let trackingCode = shipment?.id || '';
  let status = shipment?.status || '';
  let origin = shipment?.origin || '';
  let destination = shipment?.destination || '';

  if (templateType === 'OUT_FOR_DELIVERY') {
    emailSubject = subject || `Out for Delivery: DHL Package #${trackingCode}`;
  } else if (templateType === 'SHIPMENT_UPDATE') {
    emailSubject = subject || `Shipment Update: DHL Package #${trackingCode}`;
  } else if (templateType === 'DELAY_NOTICE') {
    emailSubject = subject || `Important Notice: Update on DHL Package #${trackingCode}`;
  } else if (templateType === 'NEW_REGISTRATION') {
    emailSubject = subject || `DHL Shipment Confirmation & Credentials - #${trackingCode}`;
  }

  const html = buildHtmlEmail({
    recipientName: recipientName || to.split('@')[0],
    title: emailSubject,
    message: messageBody,
    trackingNumber: trackingCode,
    status: status,
    origin: origin,
    destination: destination,
    credentials: credentials
  });

  const textContent = `Dear ${recipientName || 'Customer'},\n\n${messageBody}\n\n${credentials ? `CUSTOMER PORTAL CREDENTIALS:\nUsername: ${credentials.email}\nPassword: ${credentials.password}\n\n` : ''}${trackingCode ? `SHIPMENT DETAILS:\nTracking Code: ${trackingCode}\nStatus: ${status || 'IN TRANSIT'}\nRoute: ${origin || 'N/A'} -> ${destination || 'N/A'}\n` : ''}\nTrack Shipment: https://www.${domain}/#login\n\nDHL Express Global Logistics Services\nWebsite: https://www.${domain}/#login\nEmail: ${supportEmail}`;

  try {
    const resend = new Resend(apiKey);
    const emailHeaders = {
      'X-Entity-Ref-ID': `DHL-MSG-${Date.now()}`
    };
    if (inReplyTo) {
      emailHeaders['In-Reply-To'] = inReplyTo;
      emailHeaders['References'] = inReplyTo;
    }

    const response = await resend.emails.send({
      from: fromEmail,
      to: [to],
      replyTo: supportEmail,
      subject: emailSubject,
      html: html,
      text: textContent,
      headers: emailHeaders
    });

    if (response.error) {
      console.error('[RESEND API ERROR]:', response.error);
      throw new Error(response.error.message || 'Resend API rejected email delivery.');
    }

    console.log(`[RESEND EMAIL SENT] Successfully sent email to ${to} (ID: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error('[EMAIL SERVICE EXCEPTION]:', err);
    throw err;
  }
}
