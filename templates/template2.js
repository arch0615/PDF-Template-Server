export function generateHtmlTemplate2(data) {
  const d = {
    ticketName: '', ticketLocation: '', ticketDate: '',
    wasteRows: [],
    wasteHierarchyConfirm: false,
    b1CompanyName: '', b1CompanyAddress: '', b1PostCode: '', b1SicCode: '',
    b2UnitaryOrCouncil: '',
    b3IsProducer: '', b3IsRegisteredCarrier: '', b3CarrierRegNumber: '',
    c1CompanyName: '', c1CompanyAddress: '', c1PostCode: '',
    c2IsLocalAuthority: '',
    c3HasEnvironmentalPermit: '', c3HasWasteExemption: '', c3IsRegisteredCarrier: '', c3RegistrationNumber: '',
    d1CompanyName: '', d1CompanyAddress: '', d1PostCode: '', d1DateFrom: '', d1DateTo: '',
    d2CompanyName: '', d2CompanyAddress: '', d2PostCode: '', d2RegNumber: '',
    transferorSignature: null, transferorName: '', transferorRepresenting: '',
    transfereeSignature: null, transfereeName: '', transfereeRepresenting: '',
    ...data,
  };

  const CHECK = '<span class="cb-tick"></span>';
  const cb = (val) => (val === true || val === 'true') ? CHECK : '';

  const rows = d.wasteRows || [];
  const wasteRowsHtml = Array.from({ length: 6 }, (_, i) => {
    const r = rows[i] || {};
    return `<tr>
      <td>${r.description || ''}</td>
      <td>${r.ewcCodes || ''}</td>
      <td>${r.containment || ''}</td>
      <td>${r.quantity || ''}</td>
    </tr>`;
  }).join('');

  const sigImg = (src) => src
    ? `<img src="${src}" style="max-width:240px;max-height:40px;display:block" />`
    : '';

  const dateRange = [d.d1DateFrom, d.d1DateTo].filter(Boolean).join(' - ');

  const headerLine1 = 'Season Ticket WTN - Zia Lucia';
  const headerLine2 = '(Holloway Road) - 20-01-2026';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 10px; color: #1a1a1a; line-height: 1.35; }

  .page {
    width: 210mm; height: 297mm;
    position: relative;
    page-break-after: always;
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }

  /* Header */
  .header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 1cm 12px;
    border-bottom: 3px solid #2bb5a0;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon {
    width: 36px; height: 36px;
    border: 3px solid #2bb5a0;
    border-radius: 50%;
    position: relative;
  }
  .logo-icon::after {
    content: '';
    position: absolute; top: 7px; left: 7px;
    width: 16px; height: 16px;
    border: 3px solid #2bb5a0;
    border-top: none; border-left: none;
    border-radius: 0 0 4px 0;
    transform: rotate(-45deg);
  }
  .logo-text { font-size: 20px; font-weight: 700; color: #2bb5a0; }
  .header-right { text-align: right; font-size: 9px; color: #555; line-height: 1.6; }

  /* Title */
  .title {
    padding: 12px 1cm 8px;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
  }

  /* Section header */
  .sec-hdr {
    background: #e8f0ee;
    padding: 5px 1cm;
    font-size: 10px;
    font-weight: 700;
    border-bottom: 1px solid #c0d0cc;
    border-top: 1px solid #c0d0cc;
  }
  .sec { padding: 6px 1cm 8px; }

  /* Declaration */
  .decl { font-size: 8.5px; color: #333; padding: 4px 0 6px; line-height: 1.5; }

  /* Checkbox */
  .cb {
    display: inline-flex; align-items: center; justify-content: center;
    width: 11px; height: 11px;
    border: 1.5px solid #555;
    border-radius: 1px;
    flex-shrink: 0;
    vertical-align: middle;
    margin: 0 2px;
  }
  .cb-tick {
    display: block;
    width: 6px; height: 3px;
    border-left: 1.5px solid #1a365d;
    border-bottom: 1.5px solid #1a365d;
    transform: rotate(-45deg);
    margin-top: -1px;
  }

  /* Field table */
  .ft { width: 100%; border-collapse: collapse; border: 1px solid #aaa; font-size: 10px; }
  .ft td { border: 1px solid #aaa; padding: 4px 8px; }
  .ft .lc { width: 44%; color: #333; font-weight: 500; }
  .ft .li { padding-left: 20px; } /* indented label */
  .ft .vc { color: #1a1a1a; }
  .ft .sub { font-weight: 700; font-size: 10px; padding: 5px 8px; }

  /* Waste table */
  .wt { width: 100%; border-collapse: collapse; border: 1px solid #aaa; font-size: 10px; margin-top: 2px; }
  .wt th { padding: 5px 6px; text-align: left; font-weight: 600; font-size: 9px; color: #333; border: 1px solid #aaa; line-height: 1.3; }
  .wt td { border: 1px solid #ccc; padding: 3px 6px; min-height: 14px; }

  /* Signature cell */
  .sig-cell { min-height: 36px; padding: 4px 8px; }

  /* Footer */
  .footer {
    margin-top: auto;
    padding: 8px 1cm;
    font-size: 9px;
    color: #888;
    border-top: 1px solid #ddd;
    display: flex; justify-content: space-between;
  }
  .disclaimer {
    padding: 12px 1cm 4px;
    font-size: 8px;
    color: #666;
    line-height: 1.5;
    text-align: center;
  }
</style>
</head>
<body>

<!-- ==================== PAGE 1 ==================== -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon"></div>
      <span class="logo-text">first mile</span>
    </div>
    <div class="header-right">
      Page 1 of 2<br>
      ${headerLine1 ? `${headerLine1}<br>` : ''}
      ${headerLine2 || ''}
    </div>
  </div>
  <div class="title">Season Ticket Waste Transfer Note</div>

  <!-- Section A -->
  <div class="sec-hdr">Section A - Description of Waste</div>
  <div class="sec">
    <table class="wt">
      <thead>
        <tr>
          <th style="width:32%">A1. Description of Waste Being Transferred</th>
          <th style="width:30%">EWC Codes</th>
          <th style="width:20%">A2. How is the waste contained?</th>
          <th style="width:18%">A3. How Much Waste?</th>
        </tr>
      </thead>
      <tbody>${wasteRowsHtml}</tbody>
    </table>
  </div>

  <!-- Section B -->
  <div class="sec-hdr">Section B - Current Holder of the Waste - Transferor</div>
  <div class="sec">
    <div class="decl">By signing in Section E below, I confirm that I have fulfilled my duty to apply the waste hierarchy as required by Regulation 12 of the Waste (England and Wales) Regulations 2011 <span class="cb">${cb(d.wasteHierarchyConfirm)}</span> Yes</div>

    <table class="ft">
      <tr><td colspan="2" class="sub">B1. Full Name</td></tr>
      <tr><td class="lc li">Company Name</td><td class="vc">${d.b1CompanyName}</td></tr>
      <tr><td class="lc li">Company Address</td><td class="vc">${d.b1CompanyAddress}</td></tr>
      <tr><td class="lc li">PostCode</td><td class="vc">${d.b1PostCode}</td></tr>
      <tr><td class="lc li">SIC Code</td><td class="vc">${d.b1SicCode}</td></tr>
      <tr><td class="lc" style="font-weight:600">B2. Name of your Unitary or council</td><td class="vc">${d.b2UnitaryOrCouncil}</td></tr>
      <tr><td colspan="2" class="sub">B3. Are you:</td></tr>
      <tr><td class="lc li">The Producer of the waste?</td><td class="vc">${d.b3IsProducer}</td></tr>
      <tr><td class="lc li">A registered waste carrier, broker or dealer?</td><td class="vc">${d.b3IsRegisteredCarrier}</td></tr>
      <tr><td class="lc li">Registration no. if waste carrier, broker or dealer</td><td class="vc">${d.b3CarrierRegNumber}</td></tr>
    </table>
  </div>

  <!-- Section C -->
  <div class="sec-hdr">Section C - Person Collecting the Waste - Transferee</div>
  <div class="sec">
    <table class="ft">
      <tr><td colspan="2" class="sub">C1.</td></tr>
      <tr><td class="lc li">Company Name</td><td class="vc">${d.c1CompanyName}</td></tr>
      <tr><td class="lc li">Company Address</td><td class="vc">${d.c1CompanyAddress}</td></tr>
      <tr><td class="lc li">PostCode</td><td class="vc">${d.c1PostCode}</td></tr>
      <tr><td class="lc" style="font-weight:600">C2. Are you the local authority?</td><td class="vc">${d.c2IsLocalAuthority}</td></tr>
      <tr><td colspan="2" class="sub">C3. Are you:</td></tr>
      <tr><td class="lc li">The holder of an environmental permit?</td><td class="vc">${d.c3HasEnvironmentalPermit}</td></tr>
      <tr><td class="lc li">Registered Waste exemption?</td><td class="vc">${d.c3HasWasteExemption}</td></tr>
      <tr><td class="lc li">A registered waste carrier, broker or dealer?</td><td class="vc">${d.c3IsRegisteredCarrier}</td></tr>
      <tr><td class="lc li">Registration number:</td><td class="vc">${d.c3RegistrationNumber}</td></tr>
    </table>
  </div>

  <div class="footer">
    <span>First Mile Limited</span>
    <span>0333 300 3448</span>
    <span>www.thefirstmile.co.uk</span>
  </div>
</div>

<!-- ==================== PAGE 2 ==================== -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon"></div>
      <span class="logo-text">first mile</span>
    </div>
    <div class="header-right">
      Page 2 of 2<br>
      ${headerLine1 ? `${headerLine1}<br>` : ''}
      ${headerLine2 || ''}
    </div>
  </div>

  <!-- Section D -->
  <div class="sec-hdr">Section D - The Transfer</div>
  <div class="sec">
    <table class="ft">
      <tr><td colspan="2" class="sub">D1. Address of transfer or collection point</td></tr>
      <tr><td class="lc li">Company Name</td><td class="vc">${d.d1CompanyName}</td></tr>
      <tr><td class="lc li">Company Address</td><td class="vc">${d.d1CompanyAddress}</td></tr>
      <tr><td class="lc li">PostCode</td><td class="vc">${d.d1PostCode}</td></tr>
      <tr><td class="lc li">Date of Transfer</td><td class="vc">${dateRange}</td></tr>
      <tr><td colspan="2" class="sub">D2. Broker or dealer who arranged this transfer (if applicable)</td></tr>
      <tr><td class="lc li">Company Name</td><td class="vc">${d.d2CompanyName}</td></tr>
      <tr><td class="lc li">Company Address</td><td class="vc">${d.d2CompanyAddress}</td></tr>
      <tr><td class="lc li">PostCode</td><td class="vc">${d.d2PostCode}</td></tr>
      <tr><td class="lc li">Registration number:</td><td class="vc">${d.d2RegNumber}</td></tr>
    </table>
  </div>

  <!-- Section E -->
  <div class="sec-hdr">Section E - Signatures</div>
  <div class="sec">
    <table class="ft">
      <tr><td class="lc li">Transferor's Signature:</td><td class="vc sig-cell">${sigImg(d.transferorSignature)}</td></tr>
      <tr><td class="lc li">Name</td><td class="vc">${d.transferorName}</td></tr>
      <tr><td class="lc li">Representing</td><td class="vc">${d.transferorRepresenting}</td></tr>
      <tr><td class="lc li">Transferee's Signature:</td><td class="vc sig-cell">${sigImg(d.transfereeSignature)}</td></tr>
      <tr><td class="lc li">Name</td><td class="vc">${d.transfereeName}</td></tr>
      <tr><td class="lc li">Representing</td><td class="vc">${d.transfereeRepresenting}</td></tr>
    </table>
  </div>

  <div class="disclaimer">
    Please keep this document for a minimum of 2 years. First Mile reserves the right to invalidate any time remaining on this
    Waste Transfer Note due to service cancellation, non-payment, or any other breach of our terms.
  </div>

  <div class="footer">
    <span>First Mile Limited</span>
    <span>0333 300 3448</span>
    <span>www.thefirstmile.co.uk</span>
  </div>
</div>

</body>
</html>`;
}
