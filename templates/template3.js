export function generateHtmlTemplate3(data) {
  const d = {
    quoteDate: '', quoteRef: '', customerName: '', validDays: '',
    wasteCollectionAddress: '', contractTerm: '',
    serviceRows: [], pricingTitle: '', pricingNotes: '',
    weeklyCharge: '', monthlyCharge: '', annualCharge: '',
    freephone: '', freephoneHours: '', email: '', emailNote: '',
    ...data,
  };

  const rows = d.serviceRows || [];
  const serviceRowsHtml = rows.map(r => `<tr>
    <td>${r.item || ''}</td>
    <td>${r.wasteType || ''}</td>
    <td>${r.containerSizeType || ''}</td>
    <td>${r.qty || ''}</td>
    <td>${r.collectionFreq || ''}</td>
    <td>${r.weightLimit || ''}</td>
    <td>${r.liftRate || ''}</td>
    <td>${r.priceTonne || ''}</td>
    <td>${r.dailyRental || ''}</td>
    <td>${r.wtnCharge || ''}</td>
    <td class="tw">${r.totalWeekly || ''}</td>
  </tr>`).join('');

  const pricingLines = (d.pricingNotes || '').replace(/\n/g, '<br>');
  const freephoneLines = (d.freephoneHours || '').replace(/\n/g, '<br>');
  const emailLines = (d.emailNote || '').replace(/\n/g, '<br>');

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

  /* Fixed-height sections — matched to web form ratios */
  .s-header   { height: 19.47%; flex-shrink: 0; }
  .s-letter   { height: 9.18%;  flex-shrink: 0; }
  .s-info     { height: 10.71%; flex-shrink: 0; }
  .s-service  { height: 26.70%; flex-shrink: 0; }
  .s-pricing  { height: 17.66%; flex-shrink: 0; }
  .s-bottom   { height: 16.27%; flex-shrink: 0; margin-top: auto; }

  /* Header */
  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 1cm;
    height: 100%;
    overflow: hidden;
  }
  .header-left {
    display: flex; align-items: stretch; align-self: stretch; gap: 16px;
  }
  .logo-col {
    flex-shrink: 0; display: flex; align-items: stretch;
  }
  .nw-logo {
    background: transparent; color: #1a1a1a; font-size: 18px; font-weight: 900;
    font-style: italic; padding: 10px 0;
    display: flex; align-items: center; line-height: 1.2;
  }
  .title-col {
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .header-date { font-size: 12px; color: #555; }
  .title-col-bottom { margin-top: auto; }
  .quote-heading { font-size: 26px; font-weight: 900; color: #1a1a1a; margin: 0; }
  .quote-ref { font-size: 15px; font-weight: 600; color: #555; }

  .header-right { display: flex; align-items: flex-start; gap: 10px; }
  .company-info { font-size: 9px; color: #555; line-height: 1.4; text-align: right; }
  .company-info strong { font-size: 10px; display: block; margin-bottom: 2px; }

  /* Badge - CSS triangle logo */
  .badge { width: 80px; height: 80px; position: relative; }
  .badge .tri-striped {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    background: repeating-linear-gradient(45deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 1.5px, #8a8f94 1.5px, #8a8f94 3.5px), #8a8f94;
  }
  .badge .tri-solid {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    background: #4f5152;
  }

  /* Sections */
  .sec { padding: 4px 1cm 6px; }

  /* Letter */
  .letter { font-size: 10px; line-height: 1.6; }

  /* Info table (Address & Contract) */
  .info-table { width: 100%; border-collapse: collapse; border: 1px solid #bbb; font-size: 10px; }
  .info-table td { border: 1px solid #bbb; padding: 6px 10px; }
  .info-label { font-weight: 700; width: 22%; background: #f5f5f5; white-space: nowrap; }

  /* Service table (11 columns) */
  .st { width: 100%; border-collapse: collapse; border: 1px solid #999; font-size: 9px; }
  .st th {
    background: #f5f5f5; padding: 4px 3px; text-align: center; font-weight: 700;
    font-size: 8px; border: 1px solid #999; white-space: pre-line; line-height: 1.3;
    vertical-align: bottom; text-decoration: underline;
  }
  .st td { border: 1px solid #ccc; padding: 3px 4px; text-align: center; font-size: 9px; height: 24px; }
  .st .tw { font-weight: 700; }

  /* Pricing */
  .pricing-layout { display: flex; gap: 20px; }
  .pricing-notes { flex: 1; }
  .pricing-title { font-size: 10px; font-weight: 700; font-style: italic; margin-bottom: 3px; }
  .pricing-text { font-size: 9px; color: #333; line-height: 1.5; }
  .pricing-summary { width: 180px; text-align: right; flex-shrink: 0; }
  .price-row { display: flex; justify-content: flex-end; align-items: baseline; gap: 10px; }
  .price-row-large { margin-bottom: 3px; }
  .price-label-text { font-size: 10px; font-weight: 700; }
  .price-amount-large { font-size: 18px; font-weight: 900; }
  .price-amount { font-size: 12px; font-weight: 700; }
  .vat-debit { font-size: 8px; font-weight: 900; text-align: right; margin-top: 4px; line-height: 1.5; }

  /* Bottom */
  .bottom-row { display: flex; gap: 12px; align-items: stretch; }
  .ready-box {
    background: #1a1a1a; color: white; padding: 10px 12px; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; white-space: nowrap;
    flex: 0 0 16%;
  }
  .contact-box {
    background: #d9d9d9; color: #1a1a1a; padding: 10px 14px;
    overflow: hidden;
  }
  .contact-phone { flex: 0 0 28%; }
  .contact-email { flex: 0 0 40%; }
  .contact-title { font-size: 11px; font-weight: 700; margin-bottom: 2px; }
  .contact-highlight { font-size: 11px; font-weight: 700; color: #e31e24; text-decoration: underline; }
  .contact-sub { font-size: 9px; color: #1a1a1a; margin-top: 2px; line-height: 1.4; }
</style>
</head>
<body>

<div class="page">
  <!-- Header: 15.04% -->
  <div class="s-header">
    <div class="header">
      <div class="header-left">
        <div class="logo-col">
          <div class="nw-logo">Nationwide Waste<br>&amp; Recycling Limited</div>
        </div>
        <div class="title-col">
          <div class="header-date">${d.quoteDate}</div>
          <div class="title-col-bottom">
            <div class="quote-heading">Quotation</div>
            <div class="quote-ref">Ref: ${d.quoteRef}</div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="company-info">
          <strong>Company Information</strong>
          Nationwide Waste &amp; Recycling Limited,<br>
          28 Dunkirk Road, Southport PR8 4RQ<br><br>
          VAT No: 513 1751 24<br>
          Company No: 06745189
        </div>
        <div class="badge">
          <div class="tri-striped"></div>
          <div class="tri-solid"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Letter: 6.32% -->
  <div class="s-letter">
    <div class="sec">
      <div class="letter">
        Dear ${d.customerName},<br>
        We have pleasure in providing the following quotation which is valid for ${d.validDays} days.
      </div>
    </div>
  </div>

  <!-- Address & Contract: 12% -->
  <div class="s-info">
    <div class="sec">
    <table class="info-table">
      <tr><td class="info-label">Waste Collection Address</td><td>${d.wasteCollectionAddress}</td></tr>
      <tr><td class="info-label">Contract Term</td><td>${d.contractTerm}</td></tr>
    </table>
    </div>
  </div>

  <!-- Service Table: 18% -->
  <div class="s-service">
    <div class="sec">
    <table class="st">
      <thead>
        <tr>
          <th style="width:4%">Item</th>
          <th style="width:12%">Waste Type</th>
          <th style="width:14%">Container
Size & Type</th>
          <th style="width:4%">Qty</th>
          <th style="width:10%">Collection
Frequency</th>
          <th style="width:8%">Weight
Limit *</th>
          <th style="width:10%">Lift Rate /
Haulage †</th>
          <th style="width:8%">Price
per
Tonne</th>
          <th style="width:9%">Daily
Container
Rental</th>
          <th style="width:9%">WTN
Standard
Charge ‡</th>
          <th style="width:12%">Total Weekly
Price</th>
        </tr>
      </thead>
      <tbody>${serviceRowsHtml}</tbody>
    </table>
    </div>
  </div>

  <!-- Pricing: 20% -->
  <div class="s-pricing">
    <div class="sec">
    <div class="pricing-layout">
      <div class="pricing-notes">
        <div class="pricing-title">${d.pricingTitle || 'Pricing and Service Charges, simply explained'}</div>
        <div class="pricing-text">${pricingLines}</div>
      </div>
      <div class="pricing-summary">
        <div class="price-row price-row-large">
          <span class="price-label-text">WEEKLY</span>
          <span class="price-amount-large">£${d.weeklyCharge}</span>
        </div>
        <div class="price-row">
          <span class="price-label-text">MONTHLY</span>
          <span class="price-amount">£${d.monthlyCharge}</span>
        </div>
        <div class="price-row">
          <span class="price-label-text">ANNUAL</span>
          <span class="price-amount">£${d.annualCharge}</span>
        </div>
        <div class="vat-debit">
          ALL RATES ARE SUBJECT TO VAT<br>
          AND PAYABLE BY DIRECT DEBIT
        </div>
      </div>
    </div>
    </div>
  </div>

  <!-- Bottom: 16% -->
  <div class="s-bottom">
    <div class="sec">
      <div class="bottom-row">
        <div class="ready-box">Ready to set up<br>your account?</div>
        <div class="contact-box contact-phone">
          <div class="contact-title">Freephone</div>
          <div class="contact-highlight">${d.freephone}</div>
          <div class="contact-sub">${freephoneLines}</div>
        </div>
        <div class="contact-box contact-email">
          <div class="contact-title">E-Mail</div>
          <div class="contact-highlight">${d.email}</div>
          <div class="contact-sub">${emailLines}</div>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;
}
