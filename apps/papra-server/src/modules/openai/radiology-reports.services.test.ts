import { describe, expect, test, vi } from 'vitest';
import { createRadiologyReportsService } from './radiology-reports.services';

vi.mock('openai', () => {
  return {
    default: class {
      chat = { completions: { create: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'mock report' } }] }) } };
    },
  };
});

describe('radiology reports services', () => {
  test('generateReport returns the ai report', async () => {
    const service = createRadiologyReportsService({ config: { openai: { apiKey: 'key', model: 'gpt-4o' } } as any });
    const { report } = await service.generateReport({ exam: 'CT chest', findings: 'no abnormalities' });
    expect(report).toBe('mock report');
  });
});
