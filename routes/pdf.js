import { Router } from 'express';
import { join } from 'path';
import { config } from '../config.js';
import { generatePdf } from '../services/pdfService.js';

export const pdfRouter = Router();

// Serve the original template PDF for preview
pdfRouter.get('/template', (req, res) => {
  res.sendFile(config.templatePath);
});

// Generate a completed PDF
pdfRouter.post('/generate', async (req, res) => {
  try {
    const { filename } = await generatePdf(req.body);
    res.json({
      success: true,
      filename,
      downloadUrl: `/api/pdf/download/${filename}`,
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Preview a completed PDF (inline, not download)
pdfRouter.post('/preview', async (req, res) => {
  try {
    const { filename } = await generatePdf(req.body);
    const filePath = join(config.outputDir, filename);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
  } catch (err) {
    console.error('PDF preview failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download a generated PDF
pdfRouter.get('/download/:filename', (req, res) => {
  const filePath = join(config.outputDir, req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});
