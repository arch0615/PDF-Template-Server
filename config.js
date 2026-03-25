import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isVercel = !!process.env.VERCEL;

// PDF page size: 594.96 x 841.92 points (A4)
// Coordinate origin: bottom-left
// Coordinates calibrated from grid overlay

export const config = {
  templatePath: join(__dirname, '3a3de12b-352c-43a1-9527-2007b2948259.pdf'),
  outputDir: isVercel ? '/tmp/output' : join(__dirname, 'output'),

  fields: {
    // ===================== PAGE 1 =====================

    // --- Accounts (section header ~y:745) ---
    companyName:            { page: 0, x: 155, y: 718, size: 9 },
    businessType: {
      limitedCompany:                { page: 0, x: 555, y: 718 },
      limitedLiabilityPartnership:   { page: 0, x: 555, y: 648 },
      soleTrader:                    { page: 0, x: 555, y: 625 },
      partnership:                   { page: 0, x: 555, y: 602 },
    },
    tradingAs:              { page: 0, x: 120, y: 695, size: 9 },
    regNumber:              { page: 0, x: 500, y: 695, size: 9 },
    proprietorPartnerName:  { page: 0, x: 255, y: 672, size: 9 },
    invoiceAddress1:        { page: 0, x: 145, y: 648, size: 9 },
    invoiceAddress2:        { page: 0, x: 60,  y: 625, size: 9 },
    invoiceAddress3:        { page: 0, x: 60,  y: 602, size: 9 },
    invoicePostcode:        { page: 0, x: 280, y: 602, size: 9 },
    invoiceContact:         { page: 0, x: 140, y: 578, size: 9 },
    invoiceTel:             { page: 0, x: 365, y: 578, size: 9 },
    invoiceEmail:           { page: 0, x: 100, y: 555, size: 9 },
    invoiceMobile:          { page: 0, x: 395, y: 555, size: 9 },
    proprietorHomeAddress1: { page: 0, x: 240, y: 532, size: 9 },
    proprietorHomeAddress2: { page: 0, x: 60,  y: 510, size: 9 },
    proprietorHomePostcode: { page: 0, x: 470, y: 510, size: 9 },

    // --- Service (section header ~y:490) ---
    collectionSiteAddress1: { page: 0, x: 185, y: 468, size: 9 },
    collectionSiteAddress2: { page: 0, x: 60,  y: 448, size: 9 },
    collectionSitePostcode: { page: 0, x: 470, y: 448, size: 9 },
    serviceContactName:     { page: 0, x: 145, y: 425, size: 9 },
    serviceTel:             { page: 0, x: 365, y: 425, size: 9 },
    serviceEmail:           { page: 0, x: 100, y: 402, size: 9 },
    serviceMobile:          { page: 0, x: 395, y: 402, size: 9 },

    // --- Service Schedule (section header ~y:385) ---
    orderNumber:            { page: 0, x: 155, y: 362, size: 9 },

    // Service schedule table — header row ~y:330, data rows below
    serviceTableStartY: 298,
    serviceTableRowHeight: 20,
    serviceTableColumns: {
      type:           { x: 68 },
      size:           { x: 140 },
      qty:            { x: 205 },
      wasteType:      { x: 255 },
      collectionFreq: { x: 350 },
      delDate:        { x: 420 },
      emptyCharge:    { x: 475 },
      rentalPerBin:   { x: 540 },
      dutyCare:       { x: 600 },
      delColFee:      { x: 660 },
    },
    serviceTableSize: 7,

    // --- Special Conditions (section header ~y:170) ---
    specialConditions: {
      startY: 150,
      lineHeight: 22,
      x: 60,
      size: 9,
      page: 0,
    },

    // ===================== PAGE 2 =====================

    // --- Invoicing & Payment (bordered box ~y:710-740) ---
    electronicInvoicing:      { page: 1, x: 310, y: 740 },
    electronicInvoicingEmail: { page: 1, x: 140, y: 712, size: 9 },
    initialServiceTermWeeks:  { page: 1, x: 440, y: 712, size: 9 },
    paymentMethod: {
      directDebit:    { page: 1, x: 540, y: 740 },
      standardCredit: { page: 1, x: 540, y: 725 },
      inAdvance:      { page: 1, x: 540, y: 710 },
    },
    inAdvanceWeeks: { page: 1, x: 610, y: 710, size: 8 },

    // --- Waste Schedule (section header ~y:650) ---
    producer:         { page: 1, x: 115, y: 628, size: 9 },
    wasteProcess:     { page: 1, x: 155, y: 605, size: 9 },
    transferNoteFrom: { page: 1, x: 440, y: 605, size: 9 },
    transferNoteTo:   { page: 1, x: 540, y: 605, size: 9 },
    wasteTypes: {
      paperCardboard:     { page: 1, x: 68,  y: 582 },
      glass:              { page: 1, x: 210, y: 582 },
      plastics:           { page: 1, x: 370, y: 582 },
      metals:             { page: 1, x: 510, y: 582 },
      wood:               { page: 1, x: 68,  y: 548 },
      cateringWaste:      { page: 1, x: 210, y: 548 },
      mixedMunicipalWaste:{ page: 1, x: 370, y: 548 },
    },

    // --- Pre-treatment Declaration (section header ~y:520) ---
    segregateWaste: {
      yes: { page: 1, x: 300, y: 488 },
      no:  { page: 1, x: 510, y: 488 },
    },
    recoveredItems: {
      paper:     { page: 1, x: 68,  y: 435 },
      glass:     { page: 1, x: 175, y: 435 },
      plastic:   { page: 1, x: 280, y: 435 },
      metals:    { page: 1, x: 390, y: 435 },
      wood:      { page: 1, x: 68,  y: 412 },
      food:      { page: 1, x: 175, y: 412 },
      greenwaste:{ page: 1, x: 280, y: 412 },
      weee:      { page: 1, x: 390, y: 412 },
    },
    recoveredOther1: { page: 1, x: 490, y: 435, size: 8 },
    recoveredOther2: { page: 1, x: 490, y: 412, size: 8 },

    // --- Health & Safety (section header ~y:350) ---
    healthSafety: {
      clearAccess:                   { page: 1, yesX: 510, noX: 565, y: 300 },
      wellLit:                       { page: 1, yesX: 510, noX: 565, y: 282 },
      reverseInOut:                  { page: 1, yesX: 510, noX: 565, y: 265 },
      overheadCablesNarrowGateways:  { page: 1, yesX: 510, noX: 565, y: 248 },
      gravelCobbles:                 { page: 1, yesX: 510, noX: 565, y: 232 },
      vehicleInView:                 { page: 1, yesX: 510, noX: 565, y: 215 },
      excessWalking:                 { page: 1, yesX: 510, noX: 565, y: 198 },
      publicStaffAnimals:            { page: 1, yesX: 510, noX: 565, y: 182 },
    },

    // --- Authorisation (section header ~y:170) ---
    supplierSignature: { page: 1, x: 185, y: 118, width: 130, height: 25 },
    customerSignature: { page: 1, x: 440, y: 118, width: 130, height: 25 },
    supplierPrintName: { page: 1, x: 140, y: 95, size: 9 },
    customerPrintName: { page: 1, x: 415, y: 95, size: 9 },
    supplierPosition:  { page: 1, x: 125, y: 72, size: 9 },
    customerPosition:  { page: 1, x: 400, y: 72, size: 9 },
    supplierDate:      { page: 1, x: 110, y: 48, size: 9 },
    customerDate:      { page: 1, x: 380, y: 48, size: 9 },
  },
};
