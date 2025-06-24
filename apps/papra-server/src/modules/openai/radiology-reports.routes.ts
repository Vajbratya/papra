import type { RouteDefinitionContext } from '../app/server.types';
import { z } from 'zod';
import { requireAuthentication } from '../app/auth/auth.middleware';
import { validateJsonBody } from '../shared/validation/validation';
import { createRadiologyReportsService } from './radiology-reports.services';

export function registerRadiologyReportsRoutes(context: RouteDefinitionContext) {
  setupGenerateReportRoute(context);
}

function setupGenerateReportRoute({ app, config }: RouteDefinitionContext) {
  const service = createRadiologyReportsService({ config });

  app.post(
    '/api/radiology/report',
    requireAuthentication(),
    validateJsonBody(z.object({ exam: z.string(), findings: z.string() })),
    async (ctx) => {
      const { exam, findings } = ctx.req.valid('json');
      const { report } = await service.generateReport({ exam, findings });
      return ctx.json({ report });
    },
  );
}
