import { Router } from 'express';

export const templatesRouter = Router();

const templates = [
  {
    id: 'nationwide-waste',
    name: 'Nationwide Waste & Recycling',
    description: 'Service agreement form for waste collection, recycling services, and health & safety assessment.',
    pages: 2,
  },
  {
    id: 'first-mile-wtn',
    name: 'Season Ticket Waste Transfer Note',
    description: 'Season Ticket Waste Transfer Note for waste carrier information, producer details, and transfer records.',
    pages: 2,
  },
  {
    id: 'biffa-quotation',
    name: 'Biffa Quotation',
    description: 'Waste collection quotation with service details, contract terms, and pricing summary.',
    pages: 1,
  },
];

// GET /api/templates — list all templates
templatesRouter.get('/', (req, res) => {
  res.json(templates);
});

// GET /api/templates/:id — get single template metadata
templatesRouter.get('/:id', (req, res) => {
  const t = templates.find((t) => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Template not found' });
  res.json(t);
});
