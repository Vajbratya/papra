import type { Config } from '../config/config.types';
import { createError } from '../shared/errors/errors';
import OpenAI from 'openai';

export function createRadiologyReportsService({ config }: { config: Config }) {
  const apiKey = config.openai.apiKey;
  if (!apiKey) {
    throw createError({
      message: 'OpenAI API key not configured',
      code: 'openai.missing_api_key',
      statusCode: 500,
      isInternal: true,
    });
  }

  const openai = new OpenAI({ apiKey });
  const model = config.openai.model;

  async function generateReport({ exam, findings, style = 'concise' }: { exam: string; findings: string; style?: string }) {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: `You are a radiology assistant AI generating ${style} radiology reports.` },
        { role: 'user', content: `Exam: ${exam}\nFindings: ${findings}` },
      ],
    });

    const report = completion.choices[0]?.message?.content ?? '';

    return { report };
  }

  async function autocompleteReport({ text }: { text: string }) {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a radiology assistant AI continuing the report.' },
        { role: 'user', content: text },
      ],
    });

    const continuation = completion.choices[0]?.message?.content ?? '';
    return { text: continuation };
  }

  return { generateReport, autocompleteReport };
}
