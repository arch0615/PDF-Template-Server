import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logoPath = join(__dirname, '..', 'logo.png');
let logoBase64 = '';
try {
  logoBase64 = fs.readFileSync(logoPath).toString('base64');
} catch (e) { /* logo not found */ }

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
  const wasteRowsHtml = rows.map(r => `<tr>
    <td>${r.description || ''}</td>
    <td>${r.ewcCodes || ''}</td>
    <td>${r.containment || ''}</td>
    <td>${r.quantity || ''}</td>
  </tr>`).join('');

  const logoImg = logoBase64
    ? `<img src="data:image/png;base64,${logoBase64}" style="width:40px;height:40px;object-fit:contain" />`
    : '';

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

  /* ===== Fixed-height sections — Page 1 (scaled to ~95%) ===== */
  .p1-header  { height: 5.97%;  flex-shrink: 0; }
  .p1-title   { height: 3.12%;  flex-shrink: 0; }
  .p1-secA    { height: 13.47%; flex-shrink: 0; display: flex; flex-direction: column; margin-bottom: 1.5%; }
  .p1-secB    { height: 34.95%; flex-shrink: 0; display: flex; flex-direction: column; margin-bottom: 1.5%; }
  .p1-secC    { height: 30.40%; flex-shrink: 0; display: flex; flex-direction: column; }
  .p1-footer  { height: 4.10%;  flex-shrink: 0; margin-top: auto; }

  /* ===== Fixed-height sections — Page 2 (scaled to ~95%) ===== */
  .p2-header  { height: 5.97%;  flex-shrink: 0; }
  .p2-title   { height: 3.12%;  flex-shrink: 0; }
  .p2-secD    { height: 33.00%; flex-shrink: 0; display: flex; flex-direction: column; margin-bottom: 2%; }
  .p2-secE    { height: 26.50%; flex-shrink: 0; display: flex; flex-direction: column; }
  .p2-discl   { height: 4.72%;  flex-shrink: 0; }
  .p2-footer  { height: 4.10%;  flex-shrink: 0; margin-top: auto; }

  /* Section inner */
  .sec-inner { flex: 1; display: flex; flex-direction: column; padding: 4px 1cm 6px; }
  .sec-inner > .decl { flex-shrink: 0; }

  /* Header */
  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 1cm;
    background: white;
  }
  .logo { display: flex; align-items: center; gap: 8px; }
  .logo-text { font-size: 14px; font-weight: 700; color: #2bb5a0; }
  .header-right { text-align: right; font-size: 9px; color: #555; line-height: 1.6; }

  /* Title */
  .title {
    display: flex; align-items: center;
    padding: 0 1cm;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
  }

  /* Declaration text */
  .decl {
    font-size: 9px; color: #444; padding: 6px 10px;
    text-align: center; line-height: 1.5;
  }

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

  /* Field table — rows stretch to fill */
  .ft { width: 100%; border-collapse: collapse; border: 1px solid #bbb; font-size: 10px; }
  .ft td { border: 1px solid #bbb; padding: 4px 10px; }
  .ft .lc { width: 50%; color: #333; }
  .ft .li { padding-left: 24px; }
  .ft .vc { width: 50%; color: #1a1a1a; }
  .ft .sub { font-weight: 700; font-size: 10px; }
  .ft .sec-title { font-weight: 700; font-size: 11px; }

  /* Waste table */
  .wt { width: 100%; border-collapse: collapse; border: 1px solid #bbb; font-size: 10px; }
  .wt th { padding: 4px 8px; text-align: left; font-weight: 600; font-size: 10px; color: #333; border: 1px solid #bbb; line-height: 1.3; }
  .wt .sec-title { text-align: left; font-size: 11px; font-weight: 700; }
  .wt td { border: 1px solid #ccc; padding: 3px 8px; }

  /* Regular row height */
  .ft td { height: 28px; }
  /* Signature row — 2x height */
  .sig-row td { height: 56px; }

  /* Footer */
  .footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 1cm;
    font-size: 10px;
    color: #2bb5a0;
  }

  /* Disclaimer */
  .disclaimer {
    display: flex; align-items: center; justify-content: center;
    padding: 0 1cm;
    font-size: 11px;
    color: #888;
    line-height: 1.5;
    text-align: center;
  }
</style>
</head>
<body>

<!-- ==================== PAGE 1 ==================== -->
<div class="page">
  <div class="p1-header header">
    <div class="logo">
      ${logoImg}
      <span class="logo-text">Nationwide Waste &amp; Recycling Limited</span>
    </div>
    <div class="header-right">
      Page 1 of 2<br>
      Season Ticket WTN - Zia Lucia<br>
      (Holloway Road) - 20-01-2026
    </div>
  </div>

  <div class="p1-title title">Season Ticket Waste Transfer Note</div>

  <!-- Section A: 11.58% -->
  <div class="p1-secA">
    <div class="sec-inner">
      <table class="wt">
        <thead>
          <tr><th colspan="4" class="sec-title">Section A - Description of Waste</th></tr>
          <tr>
            <th style="width:22%">A1. Description of Waste Being Transferred</th>
            <th style="width:40%">EWC Codes</th>
            <th style="width:20%">A2. How is the waste contained?</th>
            <th style="width:18%">A3. How Much Waste?</th>
          </tr>
        </thead>
        <tbody>${wasteRowsHtml}</tbody>
      </table>
    </div>
  </div>

  <!-- Section B: 31.34% -->
  <div class="p1-secB">
    <div class="sec-inner">
      <table class="ft" style="flex:none">
        <tr><td colspan="2" class="sec-title">Section B - Current Holder of the Waste - Transferor</td></tr>
      </table>
      <div class="decl">By signing in Section E below, I confirm that I have fulfilled my duty to apply the waste hierarchy as required by Regulation 12 of the Waste (England and Wales) Regulations 2011 <span class="cb">${cb(d.wasteHierarchyConfirm)}</span> Yes</div>
      <table class="ft">
        <tr><td class="lc sub">B1. Full Name</td><td class="vc"></td></tr>
        <tr><td class="lc li">Company Name</td><td class="vc">${d.b1CompanyName}</td></tr>
        <tr><td class="lc li">Company Address</td><td class="vc">${d.b1CompanyAddress}</td></tr>
        <tr><td class="lc li">PostCode</td><td class="vc">${d.b1PostCode}</td></tr>
        <tr><td class="lc li">SIC Code</td><td class="vc">${d.b1SicCode}</td></tr>
        <tr><td class="lc" style="font-weight:600">B2. Name of your Unitary or council</td><td class="vc">${d.b2UnitaryOrCouncil}</td></tr>
        <tr><td class="lc sub">B3. Are you:</td><td class="vc"></td></tr>
        <tr><td class="lc li">The Producer of the waste?</td><td class="vc">${d.b3IsProducer}</td></tr>
        <tr><td class="lc li">A registered waste carrier, broker or dealer?</td><td class="vc">${d.b3IsRegisteredCarrier}</td></tr>
        <tr><td class="lc li">Registration no. if waste carrier, broker or dealer</td><td class="vc">${d.b3CarrierRegNumber}</td></tr>
      </table>
    </div>
  </div>

  <!-- Section C: 27.43% -->
  <div class="p1-secC">
    <div class="sec-inner">
      <table class="ft">
        <tr><td colspan="2" class="sec-title">Section C - Person Collecting the Waste - Transferee</td></tr>
        <tr><td class="lc sub">C1.</td><td class="vc"></td></tr>
        <tr><td class="lc li">Company Name</td><td class="vc">${d.c1CompanyName}</td></tr>
        <tr><td class="lc li">Company Address</td><td class="vc">${d.c1CompanyAddress}</td></tr>
        <tr><td class="lc li">PostCode</td><td class="vc">${d.c1PostCode}</td></tr>
        <tr><td class="lc" style="font-weight:600">C2. Are you the local authority?</td><td class="vc">${d.c2IsLocalAuthority}</td></tr>
        <tr><td class="lc sub">C3. Are you:</td><td class="vc"></td></tr>
        <tr><td class="lc li">The holder of an environmental permit?</td><td class="vc">${d.c3HasEnvironmentalPermit}</td></tr>
        <tr><td class="lc li">Registered Waste exemption?</td><td class="vc">${d.c3HasWasteExemption}</td></tr>
        <tr><td class="lc li">A registered waste carrier, broker or dealer?</td><td class="vc">${d.c3IsRegisteredCarrier}</td></tr>
        <tr><td class="lc li">Registration number:</td><td class="vc">${d.c3RegistrationNumber}</td></tr>
      </table>
    </div>
  </div>

  <div class="p1-footer footer">
    <span>First Mile Limited</span>
    <span>0333 300 3448</span>
    <span>www.thefirstmile.co.uk</span>
  </div>
</div>

<!-- ==================== PAGE 2 ==================== -->
<div class="page">
  <div class="p2-header header">
    <div class="logo">
      ${logoImg}
      <span class="logo-text">Nationwide Waste &amp; Recycling Limited</span>
    </div>
    <div class="header-right">
      Page 2 of 2<br>
      Season Ticket WTN - Zia Lucia<br>
      (Holloway Road) - 20-01-2026
    </div>
  </div>

  <div class="p2-title title">Season Ticket Waste Transfer Note</div>

  <!-- Section D: 27.43% -->
  <div class="p2-secD">
    <div class="sec-inner">
      <table class="ft">
        <tr><td colspan="2" class="sec-title">Section D - The Transfer</td></tr>
        <tr><td class="lc sub">D1. Address of transfer or collection point</td><td class="vc"></td></tr>
        <tr><td class="lc li">Company Name</td><td class="vc">${d.d1CompanyName}</td></tr>
        <tr><td class="lc li">Company Address</td><td class="vc">${d.d1CompanyAddress}</td></tr>
        <tr><td class="lc li">PostCode</td><td class="vc">${d.d1PostCode}</td></tr>
        <tr><td class="lc li">Date of Transfer</td><td class="vc">${d.d1DateFrom}</td></tr>
        <tr><td colspan="2" class="sub">D2. Broker or dealer who arranged this transfer (if applicable)</td></tr>
        <tr><td class="lc li">Company Name</td><td class="vc">${d.d2CompanyName}</td></tr>
        <tr><td class="lc li">Company Address</td><td class="vc">${d.d2CompanyAddress}</td></tr>
        <tr><td class="lc li">PostCode</td><td class="vc">${d.d2PostCode}</td></tr>
        <tr><td class="lc li">Registration number:</td><td class="vc">${d.d2RegNumber}</td></tr>
      </table>
    </div>
  </div>

  <!-- Section E: 22.17% -->
  <div class="p2-secE">
    <div class="sec-inner">
      <table class="ft">
        <tr><td class="lc sec-title">Section E - Signatures</td><td class="vc"></td></tr>
        <tr class="sig-row"><td class="lc li">Transferor's Signature:</td><td class="vc"></td></tr>
        <tr><td class="lc li">Name</td><td class="vc">${d.transferorName}</td></tr>
        <tr><td class="lc li">Representing</td><td class="vc">${d.transferorRepresenting}</td></tr>
        <tr class="sig-row"><td class="lc li">Transferee's Signature:</td><td class="vc"></td></tr>
        <tr><td class="lc li">Name</td><td class="vc">${d.transfereeName}</td></tr>
        <tr><td class="lc li">Representing</td><td class="vc">${d.transfereeRepresenting}</td></tr>
      </table>
    </div>
  </div>

  <!-- Disclaimer: 4.72% -->
  <div class="p2-discl disclaimer">
    Please keep this document for a minimum of 2 years. First Mile reserves the right to invalidate any time remaining on this
    Waste Transfer Note due to service cancellation, non-payment, or any other breach of our terms.
  </div>

  <div class="p2-footer footer">
    <span>First Mile Limited</span>
    <span>0333 300 3448</span>
    <span>www.thefirstmile.co.uk</span>
  </div>
</div>

</body>
</html>`;
}
