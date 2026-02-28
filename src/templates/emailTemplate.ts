export interface EmailTemplateOptions {
  bodyHtml: string;
  personaLabel: string;
  timeframeLabel: string;
  date: string;
  brandColor: string;
  logoUrl?: string;
  companyName?: string;
}

/**
 * Outlook-compatible, table-based HTML email wrapper.
 * All critical styles are inline; a <style> block is included as
 * a progressive enhancement for clients that support it.
 */
export function buildEmailHtml(opts: EmailTemplateOptions): string {
  const {
    bodyHtml,
    personaLabel,
    timeframeLabel,
    date,
    brandColor,
    logoUrl,
    companyName,
  } = opts;

  const brandLight = hexToRgba(brandColor, 0.08);
  const brandMedium = hexToRgba(brandColor, 0.15);

  const logoBlock = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" width="40" height="40" style="display:block;border:0;outline:none;" />`
    : `<span style="font-size:28px;line-height:40px;">🤖</span>`;

  const footerCompany = companyName
    ? `<br/><span style="color:#999999;font-size:12px;">${companyName}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<title>AI Haber Bülteni — ${personaLabel}</title>
<style type="text/css">
  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
  body { margin:0; padding:0; width:100%!important; }

  h2 {
    color: ${brandColor};
    font-size: 20px;
    font-weight: 700;
    margin: 28px 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid ${brandMedium};
  }
  h3 {
    color: #333333;
    font-size: 16px;
    font-weight: 700;
    margin: 20px 0 8px 0;
  }
  p {
    color: #444444;
    font-size: 15px;
    line-height: 1.65;
    margin: 0 0 14px 0;
  }
  a {
    color: ${brandColor};
    text-decoration: underline;
  }
  ul, ol {
    padding-left: 24px;
    margin: 0 0 14px 0;
  }
  li {
    color: #444444;
    font-size: 15px;
    line-height: 1.65;
    margin-bottom: 6px;
  }
  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 24px 0;
  }
  strong { color: #222222; }
  em { color: #555555; }
  blockquote {
    border-left: 3px solid ${brandColor};
    margin: 14px 0;
    padding: 8px 16px;
    background: ${brandLight};
    color: #444444;
    font-size: 14px;
  }
  code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: Consolas, Monaco, 'Courier New', monospace;
  }
  pre {
    background: #1e1e2e;
    color: #cdd6f4;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.5;
    font-family: Consolas, Monaco, 'Courier New', monospace;
  }
  pre code {
    background: none;
    padding: 0;
    color: inherit;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 14px;
  }
  table.data-table th {
    background: ${brandColor};
    color: #ffffff;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
  }
  table.data-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    color: #444444;
  }
  table.data-table tr:nth-child(even) td {
    background: #f9f9f9;
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">

<!--[if mso]>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;">
<tr><td>
<![endif]-->

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f7;">
<tr><td align="center" style="padding:20px 10px;">

<!-- MAIN WRAPPER -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- HEADER -->
<tr>
<td style="background-color:${brandColor};padding:24px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="48" valign="middle" style="padding-right:14px;">
  ${logoBlock}
</td>
<td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
  AI Haber Bülteni
</td>
<td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.85);">
  ${date}
</td>
</tr>
</table>
</td>
</tr>

<!-- PERSONA BADGE -->
<tr>
<td style="background-color:${brandLight};padding:12px 32px;border-bottom:1px solid ${brandMedium};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brandColor};font-weight:600;">
  📌 ${personaLabel} &mdash; ${timeframeLabel} Bülten
</td>
</tr>
</table>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:28px 32px 12px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#444444;line-height:1.65;">
${bodyHtml}
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background-color:#f9f9fb;padding:20px 32px;border-top:1px solid #e8e8ec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;line-height:1.5;text-align:center;">
  Bu bülten <a href="https://www.npmjs.com/package/ai-haber-bulteni-mcp" style="color:${brandColor};text-decoration:underline;">ai-haber-bulteni-mcp</a> ile otomatik oluşturulmuştur.${footerCompany}
</td>
</tr>
</table>
</td>
</tr>

</table>
<!-- /MAIN WRAPPER -->

</td></tr>
</table>

<!--[if mso]>
</td></tr></table>
<![endif]-->

</body>
</html>`;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(26,115,232,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}
