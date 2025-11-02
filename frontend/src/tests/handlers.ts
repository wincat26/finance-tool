import { rest } from 'msw';

export const handlers = [
  rest.get('*/api/customers/:id/files', (_req, res, ctx) => res(ctx.json([]))),
  rest.get('*/api/customers/:id/revenues', (_req, res, ctx) => res(ctx.json([]))),
  rest.get('*/api/customers/:id/expenses', (_req, res, ctx) => res(ctx.json([]))),
  rest.post('*/api/customers/:id/files', (_req, res, ctx) => res(ctx.json({}))),
  rest.put('*/api/customers/:id/files/:fileId', (_req, res, ctx) => res(ctx.json({}))),
  rest.delete('*/api/customers/:id/files/:fileId', (_req, res, ctx) => res(ctx.status(204))),
  rest.post('*/api/customers/:id/revenues', (_req, res, ctx) => res(ctx.json({}))),
  rest.put('*/api/customers/:id/revenues/:revenueId', (_req, res, ctx) => res(ctx.json({}))),
  rest.delete('*/api/customers/:id/revenues/:revenueId', (_req, res, ctx) => res(ctx.status(204))),
  rest.post('*/api/customers/:id/expenses', (_req, res, ctx) => res(ctx.json({}))),
  rest.put('*/api/customers/:id/expenses/:expenseId', (_req, res, ctx) => res(ctx.json({}))),
  rest.delete('*/api/customers/:id/expenses/:expenseId', (_req, res, ctx) => res(ctx.status(204)))
];
