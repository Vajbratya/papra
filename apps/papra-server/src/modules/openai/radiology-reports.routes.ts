import type { RouteDefinitionContext } from '../app/server.types';
import { z } from 'zod';
import { requireAuthentication } from '../app/auth/auth.middleware';
import { validateJsonBody } from '../shared/validation/validation';
import { createRadiologyReportsService } from './radiology-reports.services';

export function registerRadiologyReportsRoutes(context: RouteDefinitionContext) {
  setupGenerateReportRoute(context);
  setupAutocompleteRoute(context);
}

function setupGenerateReportRoute({ app, config }: RouteDefinitionContext) {
  const service = createRadiologyReportsService({ config });

  app.post(
    '/api/radiology/report',
    requireAuthentication(),
    validateJsonBody(z.object({ exam: z.string(), findings: z.string(), style: z.string().optional() })),
    async (ctx) => {
      const { exam, findings, style } = ctx.req.valid('json');
      const { report } = await service.generateReport({ exam, findings, style });
      return ctx.json({ report });
    },
  );
}

function setupAutocompleteRoute({ app, config }: RouteDefinitionContext) {
  const service = createRadiologyReportsService({ config });

  app.post(
    '/api/radiology/autocomplete',
    requireAuthentication(),
    validateJsonBody(z.object({ text: z.string() })),
    async (ctx) => {
      const { text } = ctx.req.valid('json');
      const { text: completion } = await service.autocompleteReport({ text });
      return ctx.json({ text: completion });
    },
  );
}
