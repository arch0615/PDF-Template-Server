import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logoPath = join(__dirname, '..', 'logo3.png');
let logoBase64 = '';
try {
  logoBase64 = fs.readFileSync(logoPath).toString('base64');
} catch (e) { /* logo not found */ }

export function generateHtmlTemplate3(data) {
  const d = {
    quoteDate: '', quoteRef: '', customerName: '', validDays: '',
    serviceRows: [], contractTerms: '', pricingNotes: '',
    weeklyCharge: '', monthlyCharge: '', annualCharge: '', vatRate: '',
    freephone: '', email: '',
    ...data,
  };

  const rows = d.serviceRows || [];
  const serviceRowsHtml = Array.from({ length: 4 }, (_, i) => {
    const r = rows[i] || {};
    return `<tr>
      <td>${r.container || ''}</td>
      <td>${r.containerSize || ''}</td>
      <td>${r.quantity || ''}</td>
      <td>${r.lifts || ''}</td>
      <td>${r.wasteStream || ''}</td>
    </tr>`;
  }).join('');

  const badgeImg = logoBase64
    ? `<img src="data:image/png;base64,${logoBase64}" style="width:60px;height:60px;object-fit:contain" />`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: 250mm 176mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 10px; color: #1a1a1a; line-height: 1.4; }

  .page {
    width: 250mm; height: 176mm;
    position: relative;
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  /* Header */
  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 14px 1cm 10px;
  }
  .header-left { display: flex; align-items: flex-start; gap: 20px; }
  .biffa-logo {
    background: #e31e24; color: white; font-size: 22px; font-weight: 900;
    padding: 6px 14px; border-radius: 4px; font-style: italic;
    line-height: 1;
  }
  .header-date { font-size: 10px; color: #555; padding-top: 4px; }
  .header-right { display: flex; align-items: flex-start; gap: 12px; }
  .company-info { font-size: 8px; color: #555; line-height: 1.5; text-align: right; }
  .company-info strong { font-size: 9px; display: block; margin-bottom: 2px; }

  /* Sections */
  .sec { padding: 6px 1cm 8px; }

  /* Quote title */
  .quote-title { font-size: 18px; font-weight: 700; color: #1a1a1a; }
  .quote-ref { font-size: 11px; color: #555; margin-top: 2px; }

  /* Letter */
  .letter { font-size: 10px; margin-top: 10px; line-height: 1.6; }

  /* Sub header */
  .sub-hdr { font-size: 10px; font-weight: 700; margin: 8px 0 4px; }

  /* Service table */
  .st { width: 100%; border-collapse: collapse; border: 1px solid #bbb; font-size: 10px; margin-top: 6px; }
  .st th { padding: 5px 8px; text-align: left; font-weight: 600; font-size: 9px; border: 1px solid #bbb; background: #f5f5f5; }
  .st td { border: 1px solid #ccc; padding: 4px 8px; }

  /* Field table */
  .ft { border-collapse: collapse; border: 1px solid #bbb; font-size: 10px; }
  .ft td { border: 1px solid #bbb; padding: 5px 10px; }

  /* Pricing layout */
  .pricing { display: flex; gap: 16px; margin-top: 6px; }
  .pricing-notes { flex: 1; font-size: 9px; color: #555; line-height: 1.5; }
  .pricing-summary { width: 180px; }
  .price-label { font-weight: 700; font-size: 10px; text-align: right; padding-right: 10px; }
  .price-value { font-size: 10px; font-weight: 600; }
  .direct-debit { font-size: 8px; font-weight: 700; text-align: center; margin-top: 4px; color: #555; }

  /* Bottom */
  .ready-box {
    display: inline-block; background: #4caf50; color: white;
    padding: 6px 14px; font-size: 11px; font-weight: 700; border-radius: 3px;
    margin-bottom: 8px;
  }
  .contact-row { display: flex; gap: 24px; margin-top: 6px; font-size: 10px; }
  .contact-label { font-weight: 700; margin-right: 6px; }
  .acceptance { font-size: 9px; color: #666; margin-top: 8px; }

  /* Footer */
  .footer { margin-top: auto; }
</style>
</head>
<body>

<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <div class="biffa-logo">Biffa</div>
      <div class="header-date">${d.quoteDate}</div>
    </div>
    <div class="header-right">
      <div class="company-info">
        <strong>Company Information</strong>
        Biffa Group Limited, Coronation Road,<br>
        Cressex Business Park, High Wycombe,<br>
        HP12 3TZ<br>
        VAT No: 621 611 84<br>
        Company Registration No: 946 107
      </div>
      ${badgeImg}
    </div>
  </div>

  <!-- Quotation -->
  <div class="sec">
    <div class="quote-title">Quotation</div>
    <div class="quote-ref">Ref: ${d.quoteRef}</div>

    <div class="letter">
      Dear ${d.customerName},<br>
      We have pleasure in providing the following quotation which is valid for ${d.validDays} days.
    </div>
  </div>

  <!-- Service Table -->
  <div class="sec">
    <table class="st">
      <thead>
        <tr>
          <th>Container</th>
          <th>Container Size</th>
          <th>Quantity</th>
          <th>Lifts</th>
          <th>Waste Stream</th>
        </tr>
      </thead>
      <tbody>${serviceRowsHtml}</tbody>
    </table>
  </div>

  <!-- Contract Terms -->
  <div class="sec">
    <div class="sub-hdr">Contract Terms:</div>
    <div style="font-size:10px">${d.contractTerms}</div>
  </div>

  <!-- Pricing -->
  <div class="sec">
    <div class="sub-hdr">Pricing and Service Charges, charges explained</div>
    <div class="pricing">
      <div class="pricing-notes">${d.pricingNotes}</div>
      <div class="pricing-summary">
        <table class="ft">
          <tr><td class="price-label">WEEKLY</td><td class="price-value">£${d.weeklyCharge}</td></tr>
          <tr><td class="price-label">MONTHLY</td><td class="price-value">£${d.monthlyCharge}</td></tr>
          <tr><td class="price-label">ANNUAL</td><td class="price-value">£${d.annualCharge}</td></tr>
          <tr><td class="price-label">VAT at</td><td class="price-value">${d.vatRate}%</td></tr>
        </table>
        <div class="direct-debit">AND PAYABLE BY DIRECT DEBIT</div>
      </div>
    </div>
  </div>

  <!-- Bottom -->
  <div class="sec">
    <div class="ready-box">Ready to set up your account?</div>
    <div class="contact-row">
      <div><span class="contact-label">Freephone</span>${d.freephone}</div>
      <div><span class="contact-label">E-Mail</span>${d.email}</div>
    </div>
    <div class="acceptance">By returning a signed copy you are confirming your acceptance of this quote.</div>
  </div>

  <div class="footer"></div>
</div>

</body>
</html>`;
}
