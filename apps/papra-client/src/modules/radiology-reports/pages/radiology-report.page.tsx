import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { SolidEditor } from '@tiptap/solid';
import { TextArea } from '@/modules/ui/components/textarea';
import { Button } from '@/modules/ui/components/button';
import { generateRadiologyReport, autocompleteRadiologyReport } from '../radiology-reports.services';

export const RadiologyReportPage: Component = () => {
  const [getExam, setExam] = createSignal('');
  const [getFindings, setFindings] = createSignal('');
  const [editor] = createSignal(() =>
    new Editor({
      extensions: [StarterKit, Placeholder.configure({ placeholder: 'Report...' })],
      content: '',
    }),
  );
  const [getStyle, setStyle] = createSignal<'concise' | 'detailed'>('concise');

  const generate = async () => {
    const { report } = await generateRadiologyReport({ exam: getExam(), findings: getFindings(), style: getStyle() });
    editor().commands.setContent(report);
  };

  const autocomplete = async () => {
    const { text } = await autocompleteRadiologyReport({ text: editor().getText() });
    editor().commands.insertContent(text);
  };

  return (
    <div class="p-6 mx-auto max-w-3xl flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm">Exam</label>
        <TextArea value={getExam()} onInput={e => setExam(e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm">Findings</label>
        <TextArea value={getFindings()} onInput={e => setFindings(e.currentTarget.value)} />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm">Style</label>
        <select class="border rounded p-2" value={getStyle()} onInput={e => setStyle(e.currentTarget.value as any)}>
          <option value="concise">Concise</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>
      <Button onClick={generate}>Generate Report</Button>
      <div class="border rounded p-4">
        <SolidEditor editor={editor()} />
      </div>
      <Button variant="outline" onClick={autocomplete}>AI Autocomplete</Button>
    </div>
  );
};
