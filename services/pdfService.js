import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { generateHtml } from '../templates/pdfTemplate.js';

let browser = null;

async function getBrowser() {
  if (!browser || !browser.connected) {
    const isVercel = !!process.env.VERCEL;
    browser = await puppeteer.launch({
      args: isVercel
        ? chromium.args
        : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: isVercel
        ? await chromium.executablePath()
        : (process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'),
      headless: true,
    });
  }
  return browser;
}

export async function generatePdf(formData) {
  const html = generateHtml(formData);
  const b = await getBrowser();
  const page = await b.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Pixel-based text redistribution for linked fields
  await page.evaluate(() => {
    // Group all linked field elements by data-lg attribute
    const groups = {};
    document.querySelectorAll('[data-lg]').forEach(el => {
      const group = el.dataset.lg;
      const index = parseInt(el.dataset.li);
      if (!groups[group]) groups[group] = [];
      groups[group][index] = el;
    });

    // For each group, concatenate text and redistribute based on pixel width
    Object.values(groups).forEach(fields => {
      // Concatenate all text
      const fullText = fields.map(f => f.textContent).join('');
      if (!fullText) return;

      // Measure how much text fits in each field by pixel width
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let remaining = fullText;
      fields.forEach((field, i) => {
        if (!remaining) {
          field.textContent = '';
          return;
        }

        const style = getComputedStyle(field);
        ctx.font = `${style.fontSize} ${style.fontFamily}`;
        const available = field.offsetWidth
          - parseFloat(style.paddingLeft || 0)
          - parseFloat(style.paddingRight || 0);

        // Binary search for max chars that fit
        let lo = 0, hi = remaining.length;
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(remaining.slice(0, mid)).width <= available) {
            lo = mid;
          } else {
            hi = mid - 1;
          }
        }

        // If this is the last field, just put everything remaining
        if (i === fields.length - 1) {
          field.textContent = remaining;
          remaining = '';
          return;
        }

        // If all remaining text fits, put it here
        if (lo >= remaining.length) {
          field.textContent = remaining;
          remaining = '';
          return;
        }

        // Try word boundary break
        let breakAt = lo;
        const lastSpace = remaining.lastIndexOf(' ', lo);
        if (lastSpace > lo * 0.4) {
          breakAt = lastSpace + 1;
        }

        field.textContent = remaining.slice(0, breakAt);
        remaining = remaining.slice(breakAt);
      });
    });
  });

  const pdfBytes = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await page.close();

  const filename = `completed_${uuidv4()}.pdf`;
  const outputPath = join(config.outputDir, filename);
  fs.writeFileSync(outputPath, pdfBytes);

  return { filename, outputPath };
}
