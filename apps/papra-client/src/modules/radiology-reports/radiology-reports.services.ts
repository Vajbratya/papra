import { apiClient } from '../shared/http/api-client';

export async function generateRadiologyReport({ exam, findings, style }: { exam: string; findings: string; style?: string }) {
  const { report } = await apiClient<{ report: string }>({
    path: '/api/radiology/report',
    method: 'POST',
    body: { exam, findings, style },
  });
  return { report };
}

export async function autocompleteRadiologyReport({ text }: { text: string }) {
  const { text: completion } = await apiClient<{ text: string }>({
    path: '/api/radiology/autocomplete',
    method: 'POST',
    body: { text },
  });
  return { text: completion };
}
