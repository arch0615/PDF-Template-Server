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
    id: 'template-2',
    name: 'Template 2',
    description: 'Coming soon.',
    pages: 0,
    disabled: true,
  },
  {
    id: 'template-3',
    name: 'Template 3',
    description: 'Coming soon.',
    pages: 0,
    disabled: true,
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
