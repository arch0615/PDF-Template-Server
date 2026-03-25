export function generateHtml(data) {
  const d = {
    companyName: '', tradingAs: '', regNumber: '', proprietorPartnerName: '',
    invoiceAddress1: '', invoiceAddress2: '', invoiceAddress3: '',
    invoicePostcode: '', businessType: {},
    invoiceContact: '', invoiceTel: '', invoiceEmail: '', invoiceMobile: '',
    proprietorHomeAddress1: '', proprietorHomeAddress2: '', proprietorHomePostcode: '',
    collectionSiteAddress1: '', collectionSiteAddress2: '', collectionSitePostcode: '',
    serviceContactName: '', serviceTel: '', serviceEmail: '', serviceMobile: '',
    orderNumber: '', serviceRows: [],
    specialConditions1: '', specialConditions2: '', specialConditions3: '',
    specialConditions4: '', specialConditions5: '',
    electronicInvoicing: false, electronicInvoicingEmail: '',
    initialServiceTermWeeks: '', paymentMethod: {}, inAdvanceWeeks: '',
    producer: '', wasteProcess: '', transferNoteFrom: '', transferNoteTo: '',
    wasteTypes: {}, segregateWaste: '', recoveredItems: {},
    recoveredOther1: '', recoveredOther2: '',
    healthSafety: {},
    supplierPrintName: '', customerPrintName: '',
    supplierPosition: '', customerPosition: '',
    supplierDate: '', customerDate: '',
    ...data,
  };

  // --- Placeholder redistribution — actual pixel-based splitting done after render ---
  const invoiceAddr = [d.invoiceAddress1, d.invoiceAddress2, d.invoiceAddress3];
  const proprietorAddr = [d.proprietorHomeAddress1, d.proprietorHomeAddress2];
  const collectionAddr = [d.collectionSiteAddress1, d.collectionSiteAddress2];
  const specialCond = [d.specialConditions1, d.specialConditions2, d.specialConditions3, d.specialConditions4, d.specialConditions5];

  const checked = (val) => val ? '&#10003;' : '';
  const bt = (type) => d.businessType?.[type] ? '&#10003;' : '';
  const pm = (type) => d.paymentMethod?.[type] ? '&#10003;' : '';
  const wt = (key) => d.wasteTypes?.[key] ? '&#10003;' : '';
  const ri = (key) => d.recoveredItems?.[key] ? '&#10003;' : '';
  const hs = (key, val) => d.healthSafety?.[key] === val ? '&#10003;' : '';
  const seg = (val) => d.segregateWaste === val ? '&#10003;' : '';

  const rows = d.serviceRows || [];
  const tableBodyRows = Array.from({ length: 5 }, (_, i) => {
    const r = rows[i] || {};
    return `<div class="sched-row">
      <div class="sched-cell">${r.type || ''}</div>
      <div class="sched-cell">${r.size || ''}</div>
      <div class="sched-cell">${r.qty || ''}</div>
      <div class="sched-cell">${r.wasteType || ''}</div>
      <div class="sched-cell">${r.collectionFreq || ''}</div>
      <div class="sched-cell">${r.delDate || ''}</div>
      <div class="sched-cell">${r.emptyCharge || ''}</div>
      <div class="sched-cell">${r.rentalPerBin || ''}</div>
      <div class="sched-cell">${r.dutyCare || ''}</div>
      <div class="sched-cell">${r.delColFee || ''}</div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.4; }

  .page {
    width: 210mm;
    height: 297mm;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }

  /* ===== Header ===== */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px;
    background: #4f5152;
  }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .logo-graphic { position: relative; width: 36px; height: 36px; }
  .logo-tri-left {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    background: repeating-linear-gradient(45deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 1.5px, #8a8f94 1.5px, #8a8f94 3.5px), #8a8f94;
  }
  .logo-tri-right {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    background: white;
  }
  .logo-text { text-align: center; color: white; }
  .logo-text strong { font-size: 10px; letter-spacing: 2px; display: block; }
  .logo-text span { font-size: 5.5px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.7; display: block; margin-top: 1px; }

  .company-info { text-align: right; color: white; font-size: 10px; line-height: 1.4; }
  .company-info strong { font-size: 11px; }
  .company-info a { color: white; }

  .license {
    text-align: center; font-size: 8px; color: rgba(255,255,255,0.85);
    padding: 2px 0; background: #4f5152; border-bottom: 2px solid #3a3b3c;
  }

  /* ===== Page body ===== */
  .page-body { flex: 1; display: flex; flex-direction: column; }

  /* ===== Fixed-height sections for Page 1 — matched to web form percentages ===== */
  .sec-header-area { height: 11.19%; display: flex; flex-direction: column; }
  .sec-accounts { height: 30.85%; display: flex; flex-direction: column; }
  .sec-service  { height: 15.59%; display: flex; flex-direction: column; }
  .sec-schedule { height: 24.24%; display: flex; flex-direction: column; overflow: hidden; }
  .sec-special  { height: 18.14%; display: flex; flex-direction: column; }

  .sec-accounts .section,
  .sec-service .section,
  .sec-special .section { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }

  .sec-schedule .section { flex: 1; display: flex; flex-direction: column; }
  .sec-schedule .row { margin-bottom: 4px; flex-shrink: 0; }
  .sec-schedule .sched-table { table-layout: fixed; }
  .sec-schedule .sched-table th { padding: 3px 2px; }
  .sec-schedule .sched-table-body { flex: 1; display: flex; flex-direction: column; }
  .sec-schedule .sched-table-body .sched-row {
    flex: 1;
    display: flex;
    border-bottom: 1px solid #ccc;
    min-height: 0;
  }
  .sec-schedule .sched-table-body .sched-row:last-child { border-bottom: none; }
  .sec-schedule .sched-table-body .sched-cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ccc;
    font-size: 9px;
    padding: 2px;
  }
  .sec-schedule .sched-table-body .sched-cell:last-child { border-right: none; }
  .sec-schedule .sched-table-body { border: 1px solid #aaa; border-top: none; }
  .sec-schedule .sched-table-body .sched-row:nth-child(even) { background: #fafbfc; }

  /* ===== Sections ===== */
  .section-header {
    background: #edf0f3;
    padding: 4px 1cm;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    border-bottom: 1px solid #d0d5da;
    border-top: 1px solid #d0d5da;
    flex-shrink: 0;
  }
  .section { padding: 5px 1cm 6px; }

  /* ===== Fixed-height sections for Page 2 — matched to web form percentages ===== */
  .sec-invoicing   { height: 9.22%; }
  .sec-waste       { height: 16.04%; display: flex; flex-direction: column; }
  .sec-pretreat    { height: 15.24%; display: flex; flex-direction: column; }
  .sec-hs          { height: 30.47%; display: flex; flex-direction: column; }
  .sec-auth        { height: 18.12%; display: flex; flex-direction: column; }

  .sec-waste .section,
  .sec-pretreat .section,
  .sec-hs .section { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }
  .sec-auth .section { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }

  /* ===== Form rows ===== */
  .row { display: flex; gap: 12px; margin-bottom: 4px; align-items: flex-end; }
  .field { display: flex; align-items: flex-end; gap: 4px; flex: 1; min-width: 0; }
  .field-label { font-size: 10px; color: #444; white-space: nowrap; flex-shrink: 0; }
  .field-value {
    flex: 1; min-width: 0;
    border-bottom: 1px solid #aaa;
    padding: 1px 2px;
    font-size: 12px;
    min-height: 15px;
    color: #1a1a1a;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .flex-1 { flex: 1; } .flex-2 { flex: 2; } .flex-3 { flex: 3; }

  /* ===== Checkbox ===== */
  .field-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .cb {
    display: inline-flex; align-items: center; justify-content: center;
    width: 13px; height: 13px;
    border: 1.5px solid #555;
    border-radius: 2px;
    font-size: 10px;
    line-height: 1;
    flex-shrink: 0;
    color: #1a365d;
    font-weight: 700;
  }

  /* ===== Schedule table ===== */
  .sched-table {
    width: 100%; border-collapse: collapse;
    border: 1px solid #aaa;
    font-size: 9px;
    margin-top: 4px;
  }
  .sched-table th {
    background: #edf0f3;
    padding: 3px 2px;
    text-align: center;
    font-weight: 600;
    border: 1px solid #aaa;
    font-size: 7.5px;
    line-height: 1.25;
    vertical-align: bottom;
    color: #333;
  }
  .sched-table td {
    border: 1px solid #ccc;
    padding: 4px 2px;
    text-align: center;
    font-size: 9px;
  }
  .sched-table tr:nth-child(even) td { background: #fafbfc; }

  /* ===== Invoicing table ===== */
  .inv-table {
    border-collapse: collapse;
    border: 1.5px solid #888;
    margin: 6px 1cm 3px;
    width: calc(100% - 2cm);
    font-size: 10px;
  }
  .inv-table td { border: 1px solid #aaa; padding: 5px 8px; vertical-align: middle; }
  .inv-no-bottom { border-bottom: none !important; }
  .inv-no-top { border-top: none !important; }

  /* ===== Waste grid ===== */
  .waste-row { display: flex; gap: 0; margin-top: 4px; }
  .waste-item { flex: 1; font-size: 10px; padding: 1px 0; }
  .waste-item .code { font-size: 8px; color: #777; margin-left: 17px; }
  .waste-check { display: flex; align-items: center; gap: 3px; }

  /* ===== Recovered items ===== */
  .rec-row { display: flex; gap: 0; margin-bottom: 3px; font-size: 10px; }
  .rec-row .rec-item { flex: 1; display: flex; align-items: center; gap: 3px; }
  .rec-other { flex: 1.5; display: flex; align-items: center; gap: 3px; }
  .rec-other .ov { flex: 1; border-bottom: 1px solid #aaa; min-height: 13px; font-size: 10px; padding: 1px 2px; }

  /* ===== H&S table ===== */
  .hs-table { width: 100%; border-collapse: collapse; border: 1px solid #aaa; }
  .hs-table th {
    background: #edf0f3; padding: 3px 6px; font-size: 9px;
    font-weight: 600; border: 1px solid #aaa; text-align: center;
  }
  .hs-table th:first-child { text-align: left; }
  .hs-table td { padding: 3px 6px; border: 1px solid #ddd; font-size: 9px; }
  .hs-table .hs-c { width: 36px; text-align: center; }
  .hs-table tr:nth-child(even) { background: #f7f8fa; }

  /* ===== Notes ===== */
  .note { font-size: 9px; color: #444; padding: 1px 0; line-height: 1.35; }

  /* ===== Signature ===== */
  .sig-row .field-value { min-height: 20px; }

  /* ===== Footer bar ===== */
  .page-footer {
    background: #4f5152;
    height: 12px;
    margin-top: auto;
  }

  .spacer { flex: 2; }
</style>
</head>
<body>

<!-- ==================== PAGE 1 ==================== -->
<div class="page">
  <!-- HEADER: 2/24 -->
  <div class="sec-header-area">
    <div class="header">
      <div class="logo">
        <div class="logo-graphic"><div class="logo-tri-left"></div><div class="logo-tri-right"></div></div>
        <div class="logo-text"><strong>HPK RECYCLING</strong><span>Rethinking the future of waste</span></div>
      </div>
      <div class="company-info">
        <strong>Nationwide Waste &amp; Recycling Limited</strong><br>
        28 Dunkirk Road, Southport PR8 4RQ<br>
        <u>admin@nationwidewasteandrecycling.co.uk</u><br>
        Tel: 0800 1123443
      </div>
    </div>
    <div class="license">Registered Waste Carriers License No. CBDU 448313</div>
  </div>

  <!-- ACCOUNTS: 9/24 -->
  <div class="sec-accounts">
    <div class="section-header">Accounts</div>
    <div class="section">
      <div class="row">
        <div class="field flex-3"><span class="field-label">Company name</span><span class="field-value">${d.companyName}</span></div>
        <div class="field-row flex-2"><span class="field-label">Limited Company</span><span class="cb">${bt('limitedCompany')}</span></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-label">Trading as</span><span class="field-value">${d.tradingAs}</span></div>
        <div class="field flex-2"><span class="field-label">Reg number</span><span class="field-value">${d.regNumber}</span></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-label">Or full name of proprietor/partner</span><span class="field-value">${d.proprietorPartnerName}</span></div>
        <div class="spacer"></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-label">Invoice address</span><span class="field-value" data-lg="invAddr" data-li="0">${invoiceAddr[0]}</span></div>
        <div class="field-row flex-2"><span class="field-label">Limited liability partnership</span><span class="cb">${bt('limitedLiabilityPartnership')}</span></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-value" data-lg="invAddr" data-li="1">${invoiceAddr[1]}</span></div>
        <div class="field-row flex-2"><span class="field-label">Sole trader</span><span class="cb">${bt('soleTrader')}</span></div>
      </div>
      <div class="row">
        <div style="flex:3;display:flex;gap:12px;min-width:0">
          <div class="field flex-1"><span class="field-value" data-lg="invAddr" data-li="2">${invoiceAddr[2]}</span></div>
          <div class="field flex-1"><span class="field-label">Postcode</span><span class="field-value">${d.invoicePostcode}</span></div>
        </div>
        <div class="field-row flex-2"><span class="field-label">Partnership</span><span class="cb">${bt('partnership')}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Invoice contact</span><span class="field-value">${d.invoiceContact}</span></div>
        <div class="field flex-1"><span class="field-label">Tel</span><span class="field-value">${d.invoiceTel}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Email</span><span class="field-value">${d.invoiceEmail}</span></div>
        <div class="field flex-1"><span class="field-label">Mobile</span><span class="field-value">${d.invoiceMobile}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Proprietor/partner home address</span><span class="field-value" data-lg="propAddr" data-li="0">${proprietorAddr[0]}</span></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-value" data-lg="propAddr" data-li="1">${proprietorAddr[1]}</span></div>
        <div class="field flex-1"><span class="field-label">Postcode</span><span class="field-value">${d.proprietorHomePostcode}</span></div>
      </div>
    </div>
  </div>

  <!-- SERVICE: 3/24 -->
  <div class="sec-service">
    <div class="section-header">Service</div>
    <div class="section">
      <div class="row">
        <div class="field flex-1"><span class="field-label">Collection site address</span><span class="field-value" data-lg="collAddr" data-li="0">${collectionAddr[0]}</span></div>
      </div>
      <div class="row">
        <div class="field flex-3"><span class="field-value" data-lg="collAddr" data-li="1">${collectionAddr[1]}</span></div>
        <div class="field flex-1"><span class="field-label">Postcode</span><span class="field-value">${d.collectionSitePostcode}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Contact name</span><span class="field-value">${d.serviceContactName}</span></div>
        <div class="field flex-1"><span class="field-label">Tel</span><span class="field-value">${d.serviceTel}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Email</span><span class="field-value">${d.serviceEmail}</span></div>
        <div class="field flex-1"><span class="field-label">Mobile</span><span class="field-value">${d.serviceMobile}</span></div>
      </div>
    </div>
  </div>

  <!-- SERVICE SCHEDULE: 6/24 -->
  <div class="sec-schedule">
    <div class="section-header">Service Schedule</div>
    <div class="section">
      <div class="row">
        <div class="field" style="max-width:260px"><span class="field-label">Order number</span><span class="field-value">${d.orderNumber}</span></div>
      </div>
      <table class="sched-table" style="width:100%">
        <thead><tr>
          <th>Type</th><th>Size</th><th>Qty</th><th>Waste Type</th><th>Collection<br>freq</th>
          <th>Del<br>date</th><th>Empty<br>charge per<br>bin / lift</th><th>Rental per<br>bin / day</th>
          <th>Duty of<br>care fee /<br>day</th><th>Del / Col<br>fee</th>
        </tr></thead>
      </table>
      <div class="sched-table-body">${tableBodyRows}</div>
    </div>
  </div>

  <!-- SPECIAL CONDITIONS: 4/24 -->
  <div class="sec-special">
    <div class="section-header">Special Conditions</div>
    <div class="section">
      <div class="row"><div class="field flex-1"><span class="field-value" data-lg="specCond" data-li="0">${specialCond[0]}</span></div></div>
      <div class="row"><div class="field flex-1"><span class="field-value" data-lg="specCond" data-li="1">${specialCond[1]}</span></div></div>
      <div class="row"><div class="field flex-1"><span class="field-value" data-lg="specCond" data-li="2">${specialCond[2]}</span></div></div>
      <div class="row"><div class="field flex-1"><span class="field-value" data-lg="specCond" data-li="3">${specialCond[3]}</span></div></div>
      <div class="row"><div class="field flex-1"><span class="field-value" data-lg="specCond" data-li="4">${specialCond[4]}</span></div></div>
    </div>
  </div>
</div>

<!-- ==================== PAGE 2 ==================== -->
<div class="page">
  <!-- HEADER: 2/24 -->
  <div class="sec-header-area">
    <div class="header">
      <div class="logo">
        <div class="logo-graphic"><div class="logo-tri-left"></div><div class="logo-tri-right"></div></div>
        <div class="logo-text"><strong>HPK RECYCLING</strong><span>Rethinking the future of waste</span></div>
      </div>
      <div class="company-info">
        <strong>Nationwide Waste &amp; Recycling Limited</strong><br>
        28 Dunkirk Road, Southport PR8 4RQ<br>
        <u>admin@nationwidewasteandrecycling.co.uk</u><br>
        Tel: 0800 1123443
      </div>
    </div>
    <div class="license">Registered Waste Carriers License No. CBDU 448313</div>
  </div>

  <!-- INVOICING: 2/24 -->
  <div class="sec-invoicing">
    <table class="inv-table">
      <tr>
        <td class="inv-no-bottom" colspan="2">Electronic invoicing (check if yes, <span class="cb">${checked(d.electronicInvoicing)}</span> )</td>
        <td class="inv-no-bottom">Initial service term</td>
        <td rowspan="2" style="vertical-align:top; padding-top:4px">
          <div style="display:flex;flex-direction:column;gap:3px">
            <div style="display:flex;align-items:center;gap:4px"><span class="cb">${pm('directDebit')}</span> Direct Debit</div>
            <div style="display:flex;align-items:center;gap:4px"><span class="cb">${pm('standardCredit')}</span> Standard credit</div>
            <div style="display:flex;align-items:center;gap:4px"><span class="cb">${pm('inAdvance')}</span> In advance <span style="border-bottom:1px solid #aaa;display:inline-block;width:45px;text-align:center;margin:0 2px">${d.inAdvanceWeeks}</span> Weeks</div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="inv-no-top" colspan="2"><div style="display:flex;align-items:flex-end;gap:5px"><span style="white-space:nowrap">Email address</span><span class="field-value" style="flex:1">${d.electronicInvoicingEmail}</span></div></td>
        <td class="inv-no-top"><div style="display:flex;align-items:flex-end;gap:5px"><span class="field-value" style="flex:1">${d.initialServiceTermWeeks}</span><span>Week(s)</span></div></td>
      </tr>
    </table>
    <div style="font-size:8px;color:#666;font-style:italic;padding:1px 1cm">Standard credit means payment is due 7 days from invoice date.</div>
  </div>

  <!-- WASTE SCHEDULE: 4/24 -->
  <div class="sec-waste">
    <div class="section-header">Waste Schedule (waste types described by the European Waste Catalogue)</div>
    <div class="section">
      <div class="row"><div class="field flex-1"><span class="field-label">Producer</span><span class="field-value">${d.producer}</span></div></div>
      <div class="row">
        <div class="field flex-2"><span class="field-label">Waste process</span><span class="field-value">${d.wasteProcess}</span></div>
        <div class="field flex-1"><span class="field-label">transfer note from</span><span class="field-value">${d.transferNoteFrom}</span></div>
        <div class="field" style="flex:none"><span class="field-label">to</span><span class="field-value" style="width:85px">${d.transferNoteTo}</span></div>
      </div>
      <div class="waste-row">
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('paperCardboard')}</span> Paper/cardboard</div><div class="code">20.01.01</div></div>
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('glass')}</span> Glass</div><div class="code">20.01.02</div></div>
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('plastics')}</span> Plastics</div><div class="code">20.01.39</div></div>
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('metals')}</span> Metals</div><div class="code">20.01.40</div></div>
      </div>
      <div class="waste-row">
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('wood')}</span> Wood</div><div class="code">20.01.38</div></div>
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('cateringWaste')}</span> Catering Waste</div><div class="code">20.01.08</div></div>
        <div class="waste-item"><div class="waste-check"><span class="cb">${wt('mixedMunicipalWaste')}</span> Mixed municipal waste</div><div class="code">20.03.01</div></div>
        <div class="waste-item"></div>
      </div>
    </div>
  </div>

  <!-- PRE-TREATMENT: 4/24 -->
  <div class="sec-pretreat">
    <div class="section-header">Pre-treatment declaration (Environmental Permitting (England &amp; Wales) Regulations 2007)</div>
    <div class="section">
      <div class="row" style="align-items:center;gap:10px">
        <span class="field-label">Do you currently segregate your waste?</span>
        <span class="cb">${seg('yes')}</span> <span class="field-label">Yes (If yes, complete next section)</span>
        <span class="cb">${seg('no')}</span> <span class="field-label">No</span>
      </div>
      <div style="font-size:9px;color:#444;margin:2px 0">Which items of waste generated on site are currently recovered or recycled?</div>
      <div class="rec-row">
        <div class="rec-item"><span class="cb">${ri('paper')}</span> Paper</div>
        <div class="rec-item"><span class="cb">${ri('glass')}</span> Glass</div>
        <div class="rec-item"><span class="cb">${ri('plastic')}</span> Plastic</div>
        <div class="rec-item"><span class="cb">${ri('metals')}</span> Metals</div>
        <div class="rec-other"><span class="cb">${checked(d.recoveredOther1Checked)}</span> Other <span class="ov">${d.recoveredOther1}</span></div>
      </div>
      <div class="rec-row">
        <div class="rec-item"><span class="cb">${ri('wood')}</span> Wood</div>
        <div class="rec-item"><span class="cb">${ri('food')}</span> Food</div>
        <div class="rec-item"><span class="cb">${ri('greenwaste')}</span> Greenwaste</div>
        <div class="rec-item"><span class="cb">${ri('weee')}</span> WEEE</div>
        <div class="rec-other"><span class="cb">${checked(d.recoveredOther2Checked)}</span> Other <span class="ov">${d.recoveredOther2}</span></div>
      </div>
      <div class="note">I confirm that I have fulfilled my duty to apply The Waste Hierarchy as required by regulation 12 of the England, Wales regulations 2011.</div>
    </div>
  </div>

  <!-- HEALTH & SAFETY: 6/24 -->
  <div class="sec-hs">
    <div class="section-header">Health &amp; Safety</div>
    <div class="section">
      <table class="hs-table">
        <thead><tr><th></th><th>Yes</th><th>No</th></tr></thead>
        <tbody>
          <tr><td>Is there a clear access</td><td class="hs-c"><span class="cb">${hs('clearAccess','yes')}</span></td><td class="hs-c"><span class="cb">${hs('clearAccess','no')}</span></td></tr>
          <tr><td>Is the area well lit</td><td class="hs-c"><span class="cb">${hs('wellLit','yes')}</span></td><td class="hs-c"><span class="cb">${hs('wellLit','no')}</span></td></tr>
          <tr><td>Does the vehicle have to reverse in/out of the site</td><td class="hs-c"><span class="cb">${hs('reverseInOut','yes')}</span></td><td class="hs-c"><span class="cb">${hs('reverseInOut','no')}</span></td></tr>
          <tr><td>Are there any overhead cables or narrow gateways</td><td class="hs-c"><span class="cb">${hs('overheadCablesNarrowGateways','yes')}</span></td><td class="hs-c"><span class="cb">${hs('overheadCablesNarrowGateways','no')}</span></td></tr>
          <tr><td>Gravel/cobbles etc.</td><td class="hs-c"><span class="cb">${hs('gravelCobbles','yes')}</span></td><td class="hs-c"><span class="cb">${hs('gravelCobbles','no')}</span></td></tr>
          <tr><td>Is the vehicle in view of operatives when waste is being collected</td><td class="hs-c"><span class="cb">${hs('vehicleInView','yes')}</span></td><td class="hs-c"><span class="cb">${hs('vehicleInView','no')}</span></td></tr>
          <tr><td>Does the collection involve excess walking</td><td class="hs-c"><span class="cb">${hs('excessWalking','yes')}</span></td><td class="hs-c"><span class="cb">${hs('excessWalking','no')}</span></td></tr>
          <tr><td>Members of the public/staff/animals</td><td class="hs-c"><span class="cb">${hs('publicStaffAnimals','yes')}</span></td><td class="hs-c"><span class="cb">${hs('publicStaffAnimals','no')}</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- AUTHORISATION: 6/24 -->
  <div class="sec-auth">
    <div class="section-header">Authorisation</div>
    <div class="section">
      <div class="note">Unless otherwise agreed above, the initial service period will be for 52 weeks. HPK Recycling Limited standard terms and conditions apply. Terms and conditions printed on reverse.</div>
      <div class="row sig-row">
        <div class="field flex-1"><span class="field-label">Signature (supplier)</span><span class="field-value"></span></div>
        <div class="field flex-1"><span class="field-label">Signature (customer)</span><span class="field-value"></span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Print Name</span><span class="field-value">${d.supplierPrintName}</span></div>
        <div class="field flex-1"><span class="field-label">Print Name</span><span class="field-value">${d.customerPrintName}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Position</span><span class="field-value">${d.supplierPosition}</span></div>
        <div class="field flex-1"><span class="field-label">Position</span><span class="field-value">${d.customerPosition}</span></div>
      </div>
      <div class="row">
        <div class="field flex-1"><span class="field-label">Date</span><span class="field-value">${d.supplierDate}</span></div>
        <div class="field flex-1"><span class="field-label">Date</span><span class="field-value">${d.customerDate}</span></div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;
}
